import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SpotifyWebApi from "spotify-web-api-node";

import { getEmotions, reset } from "../features/fer/ferSlice";
import { setTrackList } from "../features/track/trackSlice";
import { refreshAuthToken } from "../features/auth/authSlice";

import Spinner from "../components/Spinner";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
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

  useEffect(() => {
    if (!user_auth) return;
    spotifyApi.setAccessToken(user_auth);
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
      // Find the playlist according to the primary emotion, if not create one
      if (!user_auth) return;
      if (!myInfo) return;

      // console.log("[DEBUG] my info: ", myInfo);
      spotifyApi.getUserPlaylists(myInfo.id, { limit: 50 }).then(
        (res) => {
          console.log("[DEBUG] playlist results: ", res.body);
        },
        (err) => {
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
    }
  }, [emotions, user_auth, myInfo, dispatch]);

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
      </section>
    </>
  );
}

export default Fer;
