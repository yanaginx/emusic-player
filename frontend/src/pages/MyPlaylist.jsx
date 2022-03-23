import SpotifyWebApi from "spotify-web-api-node";
import { useState, useEffect } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setTrackList, reset } from "../features/track/trackSlice";
import { refreshAuthToken } from "../features/auth/authSlice";

import CustomPagination from "../components/CustomPagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [playlistsPerPage, setPlaylistsPerPage] = useState(8);

  function choosePlaylist(playlist) {
    dispatch(setTrackList([playlist?.uri]));
    // setPlayingTrack(track);
  }

  // DEBUG
  useEffect(() => {
    console.log("[DEBUG] current playlistResults: ", playlistResults);
  }, [playlistResults]);
  // END : DEBUG

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

    const fetchAllPlaylists = async () => {
      const allPlaylists = (await spotifyApi.getUserPlaylists(myInfo.id)).body;

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
      setPlaylistResults(
        allPlaylists.items.map((playlist) => {
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
    };

    fetchAllPlaylists().catch((err) => {
      console.log("[DEBUG] error in search: ", err);
      console.log("[DEBUG] error in search: ", typeof err);
      if (
        err.toString().search("No token provided") !== -1 ||
        err.toString().search("The access token expired") !== -1
      ) {
        console.log("Refreshed here from Search box");
        dispatch(refreshAuthToken());
      }
    });
  }, [user_auth, myInfo, dispatch]);

  // useEffect(() => {
  //   if (!user_auth) return;
  //   if (!myInfo) return;

  //   // console.log("[DEBUG] my info: ", myInfo);
  //   spotifyApi.getUserPlaylists(myInfo.id).then(
  //     (res) => {
  //       console.log("[DEBUG] playlist results: ", res.body);
  //       const allPlaylists = [...res.body.items];
  //       // Fetch all available playlists
  //       if (res.body.total > res.body.limit) {
  //         // Divide the total number of playlist by the limit to get the number of API calls
  //         for (let i = 1; i < Math.ceil(res.body.total / res.body.limit); i++) {
  //           spotifyApi
  //             .getUserPlaylists(myInfo.id, {
  //               limit: res.body.limit,
  //               offset: i * res.body.limit,
  //             })
  //             .then((data) => {
  //               data.body.items.forEach((item) => allPlaylists.push(item));
  //             });
  //         }
  //       }
  //       console.log("[DEBUG] all playlists: ", allPlaylists);
  //       setPlaylistResults(
  //         allPlaylists.map((playlist) => {
  //           let smallestAlbumImage = "";
  //           if (playlist.images.length > 0) {
  //             smallestAlbumImage = playlist.images.reduce((smallest, image) => {
  //               if (image.height < smallest.height) return image;
  //               return smallest;
  //             });
  //           }
  //           return {
  //             owner: playlist.owner.display_name,
  //             name: playlist.name,
  //             uri: playlist.uri,
  //             albumUrl: smallestAlbumImage.url,
  //           };
  //         })
  //       );
  //       // console.log("[DEBUG] playlist results: ", res.body);
  //     },
  //     (err) => {
  //       console.log("[DEBUG] error in search: ", err);
  //       console.log("[DEBUG] error in search: ", typeof err);
  //       if (
  //         err.toString().search("No token provided") !== -1 ||
  //         err.toString().search("The access token expired") !== -1
  //       ) {
  //         console.log("Refreshed here from Search box");
  //         dispatch(refreshAuthToken());
  //       }
  //     }
  //   );
  //   return () => {};
  // }, [user_auth, myInfo, dispatch]);

  // Get current playlists
  const indexOfLastPlaylist = currentPage * playlistsPerPage;
  const indexOfFirstPlaylist = indexOfLastPlaylist - playlistsPerPage;
  const currentPlaylists = playlistResults.slice(
    indexOfFirstPlaylist,
    indexOfLastPlaylist
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Row className="m-2" style={{ height: "95%" }}>
        <Col style={{ height: "100%", overflowY: "auto" }}>
          {currentPlaylists.map((playlist) => (
            <PlaylistResult
              playlist={playlist}
              key={playlist.uri}
              choosePlaylist={choosePlaylist}
            />
          ))}
        </Col>
      </Row>
      <Row>
        <CustomPagination
          totalItems={playlistResults.length}
          itemsPerPage={playlistsPerPage}
          activePage={currentPage}
          paginate={paginate}
        ></CustomPagination>
      </Row>
    </>
  );
}

export default MyPlaylist;
