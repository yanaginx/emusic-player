import { useState, useEffect } from "react";
import { PlayCircleFilled, AddCircleTwoTone } from "@material-ui/icons";

// function RecommendTrackResult({ track }) {
function RecommendTrackResult({ track, chooseTrack, selectToPlaylist }) {
  // const useAudio = (url) => {
  //   const [audio] = useState(new Audio(url));
  //   const [playing, setPlaying] = useState(false);

  //   const toggle = () => setPlaying(!playing);

  //   useEffect(() => {
  //     playing ? audio.play() : audio.pause();
  //   }, [playing]);

  //   useEffect(() => {
  //     audio.addEventListener("ended", () => setPlaying(false));
  //     return () => {
  //       audio.removeEventListener("ended", () => setPlaying(false));
  //     };
  //   }, []);

  //   return [playing, toggle];
  // };

  // const [playing, toggle] = useAudio(track.previewUrl);

  // return (
  //   <>
  //     <div
  //       className="d-flex m-2 align-items-center"
  //       style={{ cursor: "pointer" }}
  //     >
  //       {track.previewUrl ? (
  //         <span className="mx-2" style={{ cursor: "pointer" }} onClick={toggle}>
  //           {playing ? (
  //             <PauseCircleFilled fontSize="large" />
  //           ) : (
  //             <PlayCircleFilled fontSize="large" />
  //           )}
  //         </span>
  //       ) : (
  //         <span className="mx-2">
  //           {" "}
  //           <NotInterested fontSize="large" />{" "}
  //         </span>
  //       )}
  //       <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} />
  //       <div className="mx-3">
  //         <div>{track.title}</div>
  //         <div className="text-muted">{track.artist}</div>
  //       </div>
  //     </div>
  //   </>
  // );

  function handlePlay() {
    chooseTrack(track);
  }

  function handleSelect() {
    selectToPlaylist(track);
  }

  return (
    <>
      <div
        className="d-flex m-2 align-items-center"
        style={{ cursor: "pointer" }}
      >
        <span
          className="mx-2"
          style={{ cursor: "pointer" }}
          onClick={handlePlay}
        >
          <PlayCircleFilled fontSize="large" />
        </span>
        <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} />
        <div className="mx-3">
          <div>{track.title}</div>
          <div className="text-muted">{track.artist}</div>
        </div>
        <span
          className="mx-2"
          style={{ cursor: "pointer" }}
          onClick={handleSelect}
        >
          <AddCircleTwoTone fontSize="large" />
        </span>
      </div>
    </>
  );
}

export default RecommendTrackResult;
