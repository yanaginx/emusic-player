import { Remove } from "@material-ui/icons";

function SelectedTrack({ track, unselectToPlaylist }) {
  function handleUnselect() {
    unselectToPlaylist(track);
  }
  return (
    <>
      <div
        className="d-flex m-2 align-items-center"
        style={{ cursor: "pointer" }}
      >
        <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} />
        <div className="mx-3">
          <div>{track.title}</div>
          <div className="text-muted">{track.artist}</div>
        </div>
        <span
          className="mx-2"
          style={{ cursor: "pointer" }}
          onClick={handleUnselect}
        >
          <Remove fontSize="large" />
        </span>
      </div>
    </>
  );
}

export default SelectedTrack;
