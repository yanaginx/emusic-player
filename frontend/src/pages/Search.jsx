import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { Col, Container, Form, Row } from "react-bootstrap";
import TrackSearchResult from "../components/TrackSearchResult";
import { useDispatch, useSelector } from "react-redux";
import { setTrackList, reset } from "../features/track/trackSlice";
import { refreshAuthToken } from "../features/auth/authSlice";
import PlaylistResult from "../components/PlaylistResult";

const spotifyApi = new SpotifyWebApi({
  // clientId: process.env.SPOTIFY_CLIENT_ID,
  clientId: import.meta.env.SPOTIFY_CLIENT_ID,
});

function Search({ auth }) {
  // console.log("[DEBUG] auth can be seen from SEARCH: ", auth);
  const dispatch = useDispatch();
  const { tracks } = useSelector((state) => state.track);
  const { user_auth } = useSelector((state) => state.auth);
  // console.log("[DEBUG] user_auth can be seen from SEARCH: ", user_auth);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playlistSearchResults, setPlaylistSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();

  function chooseTrack(track) {
    dispatch(setTrackList([track?.uri]));
    // setPlayingTrack(track);
    setSearch("");
  }

  function choosePlaylist(playlist) {
    dispatch(setTrackList([playlist?.uri]));
    // setPlayingTrack(track);
    setSearch("");
  }

  // useEffect(() => {
  //   if (!tracks) return;
  //   // Get the User's Currently Playing Track
  //   spotifyApi.getMyCurrentPlayingTrack().then(
  //     function (data) {
  //       console.log("Now playing: " + data.body);
  //       // console.log("Now playing details: " + data.body.item);
  //     },
  //     function (err) {
  //       // console.log("Something went wrong!", err);
  //       // dispatch(refreshAuthToken());
  //       if (err.toString().search("No token provided") !== -1) {
  //         console.log("Refreshed here from top Search");
  //         dispatch(refreshAuthToken());
  //       }
  //     }
  //   );
  // }, [tracks, dispatch]);

  // useEffect(() => {
  //   if (!auth) return;
  //   spotifyApi.setAccessToken(auth);
  //   // console.log("[DEBUG] accessToken from useAuth: ", accessToken);
  //   // console.log(
  //   //   "[DEBUG] The set access token is " + spotifyApi.getAccessToken()
  //   // );
  // }, [auth]);

  useEffect(() => {
    if (!user_auth) return;
    spotifyApi.setAccessToken(user_auth);
    console.log("[DEBUG] jump here and set user_auth to: ", user_auth);
    // console.log("[DEBUG] accessToken from useAuth: ", accessToken);
    // console.log(
    //   "[DEBUG] The set access token is " + spotifyApi.getAccessToken()
    // );
  }, [user_auth]);

  useEffect(() => {
    if (!search) {
      setSearchResults([]);
      setPlaylistSearchResults([]);
      return;
    }
    if (!user_auth) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then(
      (res) => {
        if (cancel) return;
        setSearchResults(
          res.body.tracks.items.map((track) => {
            let smallestAlbumImage = "";
            if (track.album.images.length > 0) {
              smallestAlbumImage = track.album.images.reduce(
                (smallest, image) => {
                  if (image.height < smallest.height) return image;
                  return smallest;
                }
              );
            }
            return {
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: smallestAlbumImage.url,
            };
          })
        );
      },
      (err) => {
        console.log("[DEBUG] error in search: ", err);
        console.log("[DEBUG] error in search: ", typeof err);
        if (
          err.toString().search("No token provided") !== -1 ||
          err.toString().search("The access token expired") !== -1
        ) {
          // console.log("[DEBUG] Refreshed here from Search box");
          console.log("[DEBUG] Current auth: ", user_auth);
          dispatch(refreshAuthToken());
          console.log("[DEBUG] After refresh: ", user_auth);
        }
      }
    );

    spotifyApi.searchPlaylists(search).then(
      (res) => {
        if (cancel) return;
        setPlaylistSearchResults(
          res.body.playlists.items.map((playlist) => {
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
          // console.log("[DEBUG] Refreshed here from Search box");
          console.log("[DEBUG] Current auth: ", user_auth);
          dispatch(refreshAuthToken());
          console.log("[DEBUG] After refresh: ", user_auth);
        }
      }
    );

    return () => {
      cancel = true;
    };
  }, [search, user_auth, dispatch]);

  return (
    <>
      <Row className="m-2" style={{ height: "100%" }}>
        <Form.Control
          type="search"
          placeholder="Search Song/Artist"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></Form.Control>
        <Col style={{ height: "100%", overflowY: "auto" }}>
          {searchResults.map((track) => (
            <TrackSearchResult
              track={track}
              key={track.uri}
              chooseTrack={chooseTrack}
            />
          ))}
        </Col>
        <Col style={{ height: "100%", overflowY: "auto" }}>
          {playlistSearchResults.map((playlist) => (
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

export default Search;
