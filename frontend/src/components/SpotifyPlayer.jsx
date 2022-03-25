import { useState, useEffect, useRef } from "react";

import { styled, useTheme } from "@mui/material/styles";
import { FaFastBackward, FaFastForward, FaPlay, FaPause } from "react-icons/fa";
import {
  MdVolumeUp,
  MdVolumeDown,
  MdVolumeMute,
  MdVolumeOff,
} from "react-icons/md";
import {
  Stack,
  Slider,
  Box,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";

import { useSelector, useDispatch } from "react-redux";
import { setAccessToken } from "../features/auth/authSlice";

import SpotifyWebApi from "spotify-web-api-node";

const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

const Widget = styled("div")(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: "90%",
  maxWidth: "100%",
  margin: "auto",
  position: "relative",
  alignItems: "center",
  zIndex: 1,
  backgroundColor: "rgba(255,255,255,0.4)",
  backdropFilter: "blur(40px)",
}));

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
  duration_ms: 0,
};

const spotifyApi = new SpotifyWebApi({
  // clientId: process.env.SPOTIFY_CLIENT_ID,
  clientId: import.meta.env.SPOTIFY_CLIENT_ID,
});

function SpotifyPlayer(props) {
  const dispatch = useDispatch();
  const { user_auth } = useSelector((state) => state.auth);
  const { tracks } = useSelector((state) => state.track);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  // const duration = 200;
  const [duration, setDuration] = useState(-2);
  const [position, setPosition] = useState(-1);
  const [player, setPlayer] = useState(undefined);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(track);
  const increment = useRef(null);

  // toggle play/pause progress bar
  useEffect(() => {
    if (!isPlaying && position >= 0) {
      increment.current = setInterval(() => {
        setPosition((t) => t + 1);
      }, 1000);
    } else {
      clearInterval(increment.current);
    }
  }, [isPlaying]);

  // set access token for spotify api instance
  useEffect(() => {
    if (!user_auth) return;
    spotifyApi.setAccessToken(user_auth);
    console.log("[DEBUG] jump here and set user_auth to: ", user_auth);
  }, [user_auth]);

  // set duration for current playing track
  useEffect(() => {
    if (!current_track) return;
    setDuration(Math.round(current_track.duration_ms / 1000));
  }, [current_track]);

  // set context uri for the player
  useEffect(() => {
    if (tracks.length <= 0) return;
    if (tracks[0].includes("spotify:track:")) {
      spotifyApi
        .play({
          uris: tracks,
        })
        .then((res) => {
          player.getCurrentState().then((state) => {
            console.log("[DEBUG] current state: ", state);
          });
          player.resume();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      spotifyApi
        .play({
          context_uri: tracks[0],
        })
        .then((res) => {
          player.getCurrentState().then((state) => {
            console.log("[DEBUG] current state context: ", state);
          });
          player.resume();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [tracks]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: async (cb) => {
          const response = await fetch("/api/auth/refresh-token");
          const json = await response.json();
          if (json.access_token) {
            // Set here
            console.log("[DEBUG] set the refreshed token below!");
            dispatch(setAccessToken(json.access_token));
            cb(json.access_token);
          } else {
            console.log("[DEBUG] set the token below!");
            cb(props.token);
          }
        },
        volume: 1,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        const id_array = [device_id];
        // Transfer the playback to new device
        spotifyApi.transferMyPlayback(id_array).then(
          function () {
            console.log("Transfering playback to " + id_array);
            toast.info("Playback transferred to new device!");
          },
          function (err) {
            console.log("Something went wrong!", err);
          }
        );
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        console.log("[DEBUG] current track pos: ", state.position);

        setPosition(Math.round(state.position / 1000));
        setTrack(state.track_window.current_track);
        setIsPlaying(state.paused);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();
    };
  }, []);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e, value) => {
    if (!player) {
      return;
    }
    setVolume(value);
    player.setVolume(value / 100);
  };

  const handlePositionChange = (e, value) => {
    if (!player) {
      return;
    }
    setPosition(value);
    player.seek(value * 1000);
  };

  const formatDuration = (value) => {
    if (value < 0) return null;
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft <= 9 ? `0${secondLeft}` : secondLeft}`;
  };

  return (
    <>
      <Widget>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          {/* Track and artist name */}
          <Box sx={{ width: 300, overflow: "auto" }}>
            <Typography variant="h6">{current_track.name}</Typography>
            <Typography variant="button">
              {current_track.artists[0].name}
            </Typography>
          </Box>
          {/* controllers */}
          <Stack direction="row" alignItems="center">
            <IconButton
              size="large"
              onClick={() => {
                player.previousTrack();
              }}
            >
              <FaFastBackward size={24} />
            </IconButton>
            <IconButton
              size="large"
              onClick={() => {
                player.togglePlay();
              }}
            >
              {!isPlaying ? <FaPause size={32} /> : <FaPlay size={32} />}
            </IconButton>
            <IconButton
              size="large"
              onClick={() => {
                player.nextTrack();
              }}
            >
              <FaFastForward size={24} />
            </IconButton>
          </Stack>
          {/* progress bar */}
          <Box sx={{ width: 600 }}>
            <Slider
              aria-label="time-indicator"
              size="small"
              value={position}
              min={0}
              step={1}
              max={duration}
              onChange={handlePositionChange}
              sx={{
                height: 4,
                "& .MuiSlider-thumb": {
                  width: 8,
                  height: 8,
                  transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                  "&:before": {
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                  },
                  "&.Mui-active": {
                    width: 20,
                    height: 20,
                  },
                },
                "& .MuiSlider-rail": {
                  opacity: 0.28,
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: -2,
              }}
            >
              <TinyText>{formatDuration(position)}</TinyText>
              <TinyText>-{formatDuration(duration - position)}</TinyText>
            </Box>
          </Box>
          {/* volume slider */}
          <Stack
            spacing={2}
            direction="row"
            sx={{ width: 150, mb: 1 }}
            alignItems="center"
          >
            {(() => {
              if (volume === 0) {
                return <MdVolumeOff size={24} />;
              } else if (volume > 0 && volume <= 25) {
                return <MdVolumeMute size={24} />;
              } else if (volume > 25 && volume <= 75) {
                return <MdVolumeDown size={24} />;
              } else {
                return <MdVolumeUp size={24} />;
              }
            })()}
            <Slider
              aria-label="Volume"
              value={volume}
              onChange={handleVolumeChange}
            />
          </Stack>
        </Stack>
      </Widget>
    </>
  );
}

export default SpotifyPlayer;
