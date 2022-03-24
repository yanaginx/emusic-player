# TODO

- [x] Init the project ~~using `vite`~~ , redux also
  > Deadline on 7th March
  >
  > Currently using webpack since the playback device have trouble when bundling with `vite`
- [x] Build the authentication process

  > Deadline on 8th March

  Note:

  ~~Might consider moving it as a slice and not a route on the server (the route on server seems not working quite well imo, if using slice then localStorage can be used also)~~

  ⇒ Make that a route on server now so lets just continue with that

  ⇒ Passing the access_token as props and update when needed so i guess we still good to go

- Using `spotify-web-api-node` :
  - [x] Playlist fetch
  - [x] Create playlist with given artist's seeds (5 seeds)
    > Will consider adding genre seeds also, but this will reduce the available seed slots for artist
  - [x] Search
    > Issues: Currently using new token will result in new playback device created → disrupting the music listening process. → Will find way to fix this
- [x] Build the routes for:
  - [x] FER
    > Deadline on 10th March
- [x] Pagination for playlist's tracks and fetch all the playlist for searching purpose
  > Refer to this https://github.com/thelinmichael/spotify-web-api-node/issues/356#issuecomment-760781584 for more info
- [x] Auto pick playlist based on mood recognized on fer route
- [ ] Make new the player
  - [x] Basic interface and buttons
  - [x] Forward track, backward track, pause/play functionality
  - [x] Progress bar functionality
  - [ ] Progress bar seek
  - [ ] Volume control
  - [ ] Track name, artist name display
  - [ ] Change context uri
- [ ] Initial UI, with fully functional components first
- [ ] Refined UI

---

Issues:

When using `react-spotify-web-playback`, refreshing token and using new token caused the playback device to re-instantiate
-> Breaking the listening flow (since it lost its current playback state)

> Will find way to fix this
