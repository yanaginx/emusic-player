function PlaylistResult({ playlist, choosePlaylist }) {
  function handlePlay() {
    choosePlaylist(playlist);
  }

  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img src={playlist.albumUrl} style={{ height: "64px", width: "64px" }} />
      <div className="mx-3">
        <div>{playlist.name}</div>
        <div className="text-muted">{playlist.owner}</div>
      </div>
    </div>
  );
}

export default PlaylistResult;
