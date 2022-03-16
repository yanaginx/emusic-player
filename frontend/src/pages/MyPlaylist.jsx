import SpotifyWebApi from "spotify-web-api-node";
import { useState, useEffect } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setTrackList, reset } from "../features/track/trackSlice";
import { refreshAuthToken } from "../features/auth/authSlice";
import PlaylistResult from "../components/PlaylistResult";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
});

function MyPlaylist({ auth }) {
  const dispatch = useDispatch();
  const { tracks } = useSelector((state) => state.track);
  const { user_auth } = useSelector((state) => state.auth);
  console.log("[DEBUG] user_auth can be seen from MY-PLAYLIST: ", user_auth);

  const [playlistResults, setPlaylistResults] = useState([]);
  const [myInfo, setMyInfo] = useState(null);

  function choosePlaylist(playlist) {
    dispatch(setTrackList([playlist?.uri]));
    // setPlayingTrack(track);
  }

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
    if (!user_auth) return;
    if (!myInfo) return;

    // console.log("[DEBUG] my info: ", myInfo);
    spotifyApi.getUserPlaylists(myInfo.id).then(
      (res) => {
        console.log("[DEBUG] playlist results: ", res.body);
        setPlaylistResults(
          res.body.items.map((playlist) => {
            let smallestAlbumImage = "";
            if (playlist.images.length > 0) {
              smallestAlbumImage = playlist.images.reduce((smallest, image) => {
                if (image.height < smallest.height) return image;
                return smallest;
              });
            }
            return {
              owner: playlist.owner.display_name,
              name: playlist.name,
              uri: playlist.uri,
              albumUrl: smallestAlbumImage.url,
            };
          })
        );
        // console.log("[DEBUG] playlist results: ", res.body);
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
    return () => {};
  }, [user_auth, myInfo, dispatch]);

  return (
    <>
      <Row className="m-2" style={{ height: "100%" }}>
        <Col style={{ height: "100%", overflowY: "auto" }}>
          {playlistResults.map((playlist) => (
            <PlaylistResult
              playlist={playlist}
              key={playlist.uri}
              choosePlaylist={choosePlaylist}
            />
          ))}
        </Col>
      </Row>
    </>
  );
}

export default MyPlaylist;
