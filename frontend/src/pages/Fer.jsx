import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SpotifyWebApi from "spotify-web-api-node";

import { getEmotions, reset } from "../features/fer/ferSlice";
import { setTrackList } from "../features/track/trackSlice";
import { refreshAuthToken } from "../features/auth/authSlice";

import Spinner from "../components/Spinner";
import { Button } from "react-bootstrap";

const spotifyApi = new SpotifyWebApi({
  // clientId: process.env.SPOTIFY_CLIENT_ID,
  clientId: import.meta.env.SPOTIFY_CLIENT_ID,
});

function Fer({ auth }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { emotions, isLoading, isError, message, isSuccess } = useSelector(
    (state) => state.fer
  );
  const { user_auth } = useSelector((state) => state.auth);
  const { tracks } = useSelector((state) => state.track);

  const [isCreated, setIsCreated] = useState(false);
  const [moodPlaylist, setMoodPlaylist] = useState(null);
  const [primaryEmo, setPrimaryEmo] = useState(null);
  const [myInfo, setMyInfo] = useState(null);

  console.log("[DEBUG] auth can be seen from FER: ", user_auth);

  const onMood = (emotion) => {
    navigate(`/create-playlist/${emotion}`);
  };

  useEffect(() => {
    if (!user_auth) return;
    spotifyApi.setAccessToken(user_auth);
    console.log("[DEBUG] jump here and set user_auth to: ", user_auth);
  }, [user_auth]);

  useEffect(() => {
    if (!user_auth) return;

    spotifyApi.getMe().then(
      function (data) {
        console.log(
          "[DEBUG] Some information about the authenticated user",
          data.body
        );
        setMyInfo(data.body);
      },
      function (err) {
        console.log("[DEBUG] error in search: ", err);
        console.log("[DEBUG] error in search: ", typeof err);
        if (
          err.toString().search("No token provided") !== -1 ||
          err.toString().search("The access token expired") !== -1
        ) {
          console.log("Refreshed here from Search box");
          dispatch(refreshAuthToken());
        }
      }
    );
  }, [user_auth, dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getEmotions());

    return () => dispatch(reset());
  }, [message, isError, dispatch]);

  useEffect(() => {
    if (!user_auth) return;
    if (!myInfo) return;

    const findPlaylist = async (emoPlaylistName) => {
      const allPlaylists = (
        await spotifyApi.getUserPlaylists(myInfo.id, { limit: 50 })
      ).body;

      // Fetch all available playlists
      if (allPlaylists.total > allPlaylists.limit) {
        // Divide the total number of playlist by the limit to get the number of API calls
        for (
          let i = 1;
          i < Math.ceil(allPlaylists.total / allPlaylists.limit);
          i++
        ) {
          const playlistToAdd = (
            await spotifyApi.getUserPlaylists(myInfo.id, {
              limit: allPlaylists.limit,
              offset: i * allPlaylists.limit,
            })
          ).body;

          playlistToAdd.items.forEach((item) => allPlaylists.items.push(item));
        }
      }
      // console.log("[DEBUG] all playlists: ", allPlaylists);
      // setPlaylistResults(allPlaylists);
      const playlistResults = allPlaylists.items.map((playlist) => {
        return {
          name: playlist.name,
          uri: playlist.uri,
        };
      });
      console.log("[DEBUG] playlistResults: ", playlistResults);

      // Find the playlist with the name of the emotion
      const playlist = playlistResults.find(
        (playlist) => playlist.name === emoPlaylistName
      );

      if (playlist) {
        console.log("[DEBUG] playlist found: ", playlist.uri);
        setMoodPlaylist([playlist.uri]);
        setIsCreated(true);
      }
    };

    if (isSuccess) {
      let primaryEmotion = emotions.find((o) => {
        return (
          o.counts ===
          Math.max.apply(
            Math,
            emotions.map(function (o) {
              return o.counts;
            })
          )
        );
      });
      console.log(
        "[DEBUG] The primary emotion: ",
        primaryEmotion?.id.toLowerCase()
      );
      setPrimaryEmo(primaryEmotion?.id.toLowerCase());
      const playlistName = `Emusic - ${primaryEmotion.id.toLowerCase()} mood playlist`;
      findPlaylist(playlistName).catch((err) => {
        console.log("[DEBUG] error in search: ", err);
        console.log("[DEBUG] error in search: ", typeof err);
        if (
          err.toString().search("No token provided") !== -1 ||
          err.toString().search("The access token expired") !== -1
        ) {
          dispatch(refreshAuthToken());
        }
      });
    }
  }, [emotions, user_auth, myInfo, dispatch]);

  useEffect(() => {
    if (!moodPlaylist) return;

    dispatch(setTrackList(moodPlaylist));
  }, [moodPlaylist]);

  // DEBUG
  useEffect(() => {
    console.log("[DEBUG] isCreated: ", isCreated);
    console.log("[DEBUG] moodPlaylist: ", moodPlaylist);
  }, [isCreated, moodPlaylist]);
  // END : DEBUG

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>Emotions</h1>
        <p>Your detected emotions info:</p>
      </section>
      <section className="content">
        <ul>
          {emotions.map((emotion) => (
            <li key={emotion.id}>
              {emotion.id} : {emotion.counts}
            </li>
          ))}
        </ul>
        {isCreated ? (
          <></>
        ) : (
          <>
            <p>
              No playlist created yet, wanna create your own {primaryEmo}
              mood playlist? Click the button down below
            </p>
            <Button onClick={() => onMood(primaryEmo)}>
              Create {primaryEmo} mood playlist{" "}
            </Button>
          </>
        )}
      </section>
    </>
  );
}

export default Fer;
