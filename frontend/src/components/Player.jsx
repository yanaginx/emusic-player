import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SpotifyPlayer from "react-spotify-web-playback";
import { refreshAuthToken } from "../features/auth/authSlice";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
});

function Player({ accessToken, trackUris }) {
  const dispatch = useDispatch();
  const [isStateChange, setIsStateChange] = useState(false);
  const [play, setPlay] = useState(false);
  const { user_auth } = useSelector((state) => state.auth);

  console.log("[DEBUG] auth can be seen from PLAYER: ", user_auth);

  useEffect(() => {
    if (trackUris) {
      console.log("[DEBUG] current track URIs: ", trackUris);
      setPlay(true);
    }
  }, [trackUris]);

  useEffect(() => {
    if (!user_auth) return;
    spotifyApi.setAccessToken(user_auth);
    // console.log("[DEBUG] accessToken from useAuth: ", accessToken);
    // console.log(
    //   "[DEBUG] The set access token is " + spotifyApi.getAccessToken()
    // );
  }, [user_auth]);

  useEffect(() => {
    if (!trackUris) return;
    console.log("[DEBUG] state change and this ran in Player: ", user_auth);
    // Get the User's Currently Playing Track
    spotifyApi.getMyCurrentPlayingTrack().then(
      function (data) {
        console.log("[DEBUG] Now playing: " + data.body);
        // console.log(data.body.item?.name);
        // console.log("Now playing details: " + data.body.item);
      },
      function (err) {
        console.log("[DEBUG] Something went wrong!", err);
        // dispatch(refreshAuthToken());
        if (
          err.toString().search("No token provided") !== -1 ||
          err.toString().search("The access token expired") !== -1
        ) {
          console.log("[DEBUG] Refreshed here from top Player");
          dispatch(refreshAuthToken());
        }
      }
    );
  }, [trackUris, dispatch, isStateChange]);

  if (!accessToken) return null;
  return (
    <>
      <SpotifyPlayer
        token={user_auth}
        showSaveIcon
        callback={(state) => {
          console.log("[DEBUG] Player state", state, new Date().toUTCString());
          console.log(
            "[DEBUG] Toggling isStateChange: before: ",
            isStateChange
          );
          setIsStateChange(!isStateChange);
          console.log("[DEBUG] Toggling isStateChange: after: ", isStateChange);
          if (state.error || state.errorType) {
            console.log(
              "[DEBUG] error && errorType: ",
              state.error,
              state.errorType
            );
          }
          if (state.error) {
            console.log(state.errorType);
            console.log(
              "[DEBUG] refreshed here from inside state's callback of Player"
            );
            dispatch(refreshAuthToken());
          }
          if (!state.isPlaying) setPlay(false);
        }}
        play={play}
        uris={trackUris ? trackUris : []}
        // styles={{
        //   activeColor: "#fff",
        //   bgColor: "#333",
        //   color: "#fff",
        //   loaderColor: "#fff",
        //   sliderColor: "#1cb954",
        //   trackArtistColor: "#ccc",
        //   trackNameColor: "#fff",
        // }}
      ></SpotifyPlayer>
    </>
  );
}

export default Player;
