import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { Container, Form } from "react-bootstrap";
import TrackSearchResult from "../components/TrackSearchResult";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
});

function Search({ auth }) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
  }

  useEffect(() => {
    if (!playingTrack) return;
    // Get the User's Currently Playing Track
    spotifyApi.getMyCurrentPlayingTrack().then(
      function (data) {
        console.log("Now playing: " + data.body);
        // console.log("Now playing details: " + data.body.item);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  }, [playingTrack]);

  useEffect(() => {
    if (!auth) return;
    spotifyApi.setAccessToken(auth);
    // console.log("[DEBUG] accessToken from useAuth: ", accessToken);
    // console.log(
    //   "[DEBUG] The set access token is " + spotifyApi.getAccessToken()
    // );
  }, [auth]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!auth) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            }
          );
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => {
      cancel = true;
    };
  }, [search, auth]);

  return (
    <>
      <Form.Control
        type="search"
        placeholder="Search Song/Artist"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      ></Form.Control>
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map((track) => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
      </div>
    </>
  );
}

export default Search;
