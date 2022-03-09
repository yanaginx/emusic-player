import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

function Player({ accessToken, trackUris }) {
  const [play, setPlay] = useState(false);

  console.log("[DEBUG] auth can be seen from PLAYER: ", accessToken);

  useEffect(() => setPlay(true), [trackUris]);

  if (!accessToken) return null;
  return (
    <>
      <SpotifyPlayer
        token={accessToken}
        showSaveIcon
        callback={(state) => {
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
