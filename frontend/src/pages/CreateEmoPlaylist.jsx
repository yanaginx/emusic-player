import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { Search, Add } from "@material-ui/icons";
import SpotifyWebApi from "spotify-web-api-node";
import { refreshAuthToken } from "../features/auth/authSlice";
import { setTrackList, reset } from "../features/track/trackSlice";

import QueryCard from "../components/QueryCard";
import RecommendTrackResult from "../components/RecommendTrackResult";
import SelectedTrack from "../components/SelectedTrack";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
});

function CreateEmoPlaylist() {
  const dispatch = useDispatch();
  const { mood } = useParams();
  const { user_auth } = useSelector((state) => state.auth);
  const [seeds, setSeeds] = useState([]);
  const [seedArtistPairs, setSeedArtistPairs] = useState({});
  const [searchString, setSearchString] = useState("");
  const [searchQueryList, setSearchQueryList] = useState([]);
  const [trackResults, setTrackResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);

  function chooseTrack(track) {
    dispatch(setTrackList([track?.uri]));
    // setPlayingTrack(track);
  }

  function unselectToPlaylist(track) {
    const newTrackList = playlistTracks.filter((t) => t.uri !== track.uri);
    setPlaylistTracks(newTrackList);
  }

  function selectToPlaylist(track) {
    setPlaylistTracks([...playlistTracks, track]);
  }

  console.log("[DEBUG] user_auth can be seen from MY-PLAYLIST: ", user_auth);

  useEffect(() => {
    if (!user_auth) return;
    spotifyApi.setAccessToken(user_auth);
  }, [user_auth]);

  // DEBUG
  useEffect(() => {
    console.log("[DEBUG] seeds: ", seeds);
    console.log(seedArtistPairs[seeds[0]]);
    console.log("[DEBUG] seed & aritst pairs: ", seedArtistPairs);
    console.log("[DEBUG] playlist tracks: ", playlistTracks);
  }, [seeds, seedArtistPairs, playlistTracks]);
  // END : DEBUG

  // useEffect(() => {
  //   if (!user_auth) return;

  //   spotifyApi
  //     .getRecommendations({
  //       min_energy: 0.7,
  //       seed_artists: seeds,
  //       min_popularity: 50,
  //     })
  //     .then(
  //       function (data) {
  //         let recommendations = data.body;
  //         console.log(recommendations);
  //       },
  //       function (err) {
  //         console.log("[DEBUG] error in search: ", err);
  //         console.log("[DEBUG] error in search: ", typeof err);
  //         if (err.toString().search("No token provided") !== -1) {
  //           console.log("Refreshed here from Search box");
  //           dispatch(refreshAuthToken());
  //         }
  //       }
  //     );
  // }, [user_auth, dispatch, seeds]);

  const addSeedQuery = () => {
    // let recommendSeeds = [...seeds];
    if (searchString === "") {
      toast.error("Please enter a search query");
      return;
    }
    spotifyApi.searchArtists(searchString, { limit: 1 }).then(
      function (data) {
        console.log(`[DEBUG] Search artists by ${searchString}`, data.body);
        if (data.body.artists && data.body.artists.items.length > 0) {
          // recommendSeeds.push(data.body.artists.items[0].id);
          if (seeds.length === 5) {
            toast.error("You can only add maximum 5 artists");
            return;
          }
          setSeeds([...seeds, data.body.artists.items[0].id]);
          setSeedArtistPairs({
            ...seedArtistPairs,
            [data.body.artists.items[0].id]: data.body.artists.items[0].name,
          });
          setSearchString("");
        } else {
          toast.warning("No artist found with this query");
        }
      },
      function (err) {
        console.log("[DEBUG] error in search: ", err);
        console.log("[DEBUG] error in search: ", typeof err);
        if (
          err.toString().search("No token provided") !== -1 ||
          err.toString().search("The access token expired") !== -1
        ) {
          toast.info(
            "Token expired, refreshing token, please wait and try again later..."
          );
          dispatch(refreshAuthToken());
        }
      }
    );
  };

  const removeSeedQuery = (id) => {
    let newSeedArtistPairs = seedArtistPairs;
    delete newSeedArtistPairs[id];
    setSeedArtistPairs(newSeedArtistPairs);
    setSeeds(seeds.filter((item) => item !== id));
  };

  const getRecommendedTracks = async () => {
    console.log("[DEBUG] current seeds in getRecommendedTracks: ", seeds);
    let min_energy = 0;
    let max_energy = 1;
    switch (mood) {
      case "happy":
        min_energy = 0.5;
        max_energy = 1;
        console.log(`[DEBUG] min energy of mood ${mood} : ${min_energy}`);
        break;
      case "sad":
        min_energy = 0.2;
        max_energy = 0.5;
        console.log(`[DEBUG] min energy of mood ${mood} : ${min_energy}`);
        break;
      case "angry":
        min_energy = 0.7;
        max_energy = 1;
        console.log(`[DEBUG] min energy of mood ${mood} : ${min_energy}`);
        break;
      default:
        break;
    }
    if (seeds.length < 1) {
      toast.error("Please add at least one seed artist");
      return;
    }
    spotifyApi
      .getRecommendations({
        // min_energy: min_energy,
        // max_energy: max_energy,
        seed_artists: seeds,
        // min_popularity: 50,
        limit: 40,
        market: "VN",
      })
      .then(
        function (data) {
          if (data.body.tracks) {
            console.log("[DEBUG] recommendations: ", data.body);
            setTrackResults(
              data.body.tracks.map((track) => {
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
                  previewUrl: track.preview_url,
                };
              })
            );
          } else {
            toast.warning("Cannot get recommendations, please try again");
            return;
          }
        },
        function (err) {
          console.log("[DEBUG] error in search: ", err);
          console.log("[DEBUG] error in search: ", typeof err);
          if (
            err.toString().search("No token provided") !== -1 ||
            err.toString().search("The access token expired") !== -1
          ) {
            console.log("[DEBUG] Refreshed here from Search box");
            toast.info(
              "Token expired, refreshing token, please wait and try again later..."
            );
            dispatch(refreshAuthToken());
          }
        }
      );
  };

  return (
    <>
      <h1>CreateEmoPlaylist for {mood} mood</h1>
      <Row className="my-2">
        <Col>
          {seeds.map((id) => (
            <span
              style={{ cursor: "pointer" }}
              onClick={() => removeSeedQuery(id)}
            >
              <QueryCard key={id} name={seedArtistPairs[id]} />{" "}
            </span>
          ))}
        </Col>
      </Row>
      <Row className="my-2">
        <Col xs={8}>
          <Form.Control
            type="search"
            placeholder="Search Artists, seperated by ;"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          ></Form.Control>
        </Col>
        <Col xs={1}>
          <Button onClick={addSeedQuery}>
            <Add />
          </Button>
        </Col>
        <Col>
          <Button onClick={getRecommendedTracks}>Get recommendations</Button>
        </Col>
      </Row>

      <Row style={{ height: "80%" }}>
        <Col style={{ height: "100%", overflowY: "auto" }}>
          {trackResults.map((track) => (
            <RecommendTrackResult
              track={track}
              key={track.uri}
              chooseTrack={chooseTrack}
              selectToPlaylist={selectToPlaylist}
            />
          ))}
        </Col>
        <Col style={{ height: "100%", overflowY: "auto" }}>
          {playlistTracks.map((track) => (
            <SelectedTrack
              track={track}
              key={track.uri}
              unselectToPlaylist={unselectToPlaylist}
            />
          ))}
        </Col>
      </Row>
    </>
  );
}

export default CreateEmoPlaylist;
