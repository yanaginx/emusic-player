import { useState, useEffect } from "react";
import { FaPlayCircle } from "react-icons/fa";
import { MdRemove } from "react-icons/md";

// function RecommendTrackResult({ track }) {
function RecommendTrackResult({ track, chooseTrack, unselectToPlaylist }) {
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

  function handleUnselect() {
    unselectToPlaylist(track);
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
          <FaPlayCircle size={32} />
        </span>
        <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} />
        <div className="mx-3" style={{ width: "80%" }}>
          <div>{track.title}</div>
          <div className="text-muted">{track.artist}</div>
        </div>
        <span
          className="mx-2"
          style={{ cursor: "pointer" }}
          onClick={handleUnselect}
        >
          <MdRemove size={32} />
        </span>
      </div>
    </>
  );
}

export default RecommendTrackResult;
