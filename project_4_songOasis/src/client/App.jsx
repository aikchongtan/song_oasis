import React from 'react';
import { hot } from 'react-hot-loader';
import axios from 'axios';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import styles from './style.scss';
import PropTypes from 'prop-types';
import Lyrics from './components/Lyrics/Lyrics';

import uniqBy from 'lodash/uniqBy';

import SideMenu from './components/SideMenu/SideMenu';
import UserPlaylists from './components/UserPlaylists/UserPlaylists';
import ArtWork from './components/ArtWork/ArtWork';

import Header from './components/Header/Header';
import MainHeader from './components/MainHeader/MainHeader';
import MainView from './components/MainView/MainView';

import Footer from './components/Footer/Footer';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			play: false,
			//stop:false,
			pause: false,
			/*App*/

			volume: 0,
			isAudio: false,
			lyrics: "",
			audio: null,

			/*SideMenu*/
			token: null,
			artistIds: null,
			title: null,
			viewtype: null,

			/*MainHeader*/
			songPaused: false,
			songPlaying: false,
			songDetails: null,
			headerTitle: "",
			playlists: [],
			playlistMenu: [],
			artists: [],

			/*UserPlaylist*/
			userId: "",

			songs: null,
			song: null,
			categories: null,
			newReleases: null,
			featured: null,
			user: null,
			songId: 0,
			songAddedId: null,

			/*songAction*/
			fetchSongsError: false,
			fetchSongsSuccess: false,
			fetchSongsPending: false,

			fetchPlaylistSongsError: false,
			fetchPlaylistSongsSuccess: false,
			fetchPlaylistSongsPending: false,

			fetchArtistsError: false,
			fetchArtistsSuccess: false,
			fetchArtistsPending: false,

			isStopSong: false,
			isPauseSong: false,
			isResumeSong: false,
			isPlaySong: false,
			time: null,

			timeElapsed: 0,

			songName: "",//songName: state.songsReducer.songDetails ? state.songsReducer.songDetails.name : '',
			artistName: "",
			//increaseSongTime: null,
		}

		/*SideMenu*/
		this.updateHeaderTitle = this.updateHeaderTitle.bind(this)
		this.updateViewType = this.updateViewType.bind(this)
		this.fetchFeatured = this.fetchFeatured.bind(this)
		this.fetchRecentlyPlayed = this.fetchRecentlyPlayed.bind(this)
		this.fetchSongs = this.fetchSongs.bind(this)
		this.fetchAlbums = this.fetchAlbums.bind(this)
		this.fetchArtists = this.fetchArtists.bind(this)
		this.handleBrowseClick = this.handleBrowseClick.bind(this)

		/*MainHeader*/
		this.stopSong = this.stopSong.bind(this)
		this.pauseSong = this.pauseSong.bind(this)
		this.resumeSong = this.resumeSong.bind(this)
		this.playSong = this.playSong.bind(this)
		this.fetchCategories = this.fetchCategories.bind(this)
		this.fetchNewReleases = this.fetchNewReleases.bind(this)
		//this.fetchFeatured = this.fetchFeatured.bind(this)
		//this.updateHeaderTitle = this.updateHeaderTitle.bind(this)
		//this.updateViewType = this.updateViewType.bind(this)

		/*UserPlaylist*/
		this.fetchPlaylistsMenu = this.fetchPlaylistsMenu.bind(this)
		this.fetchPlaylistSongs = this.fetchPlaylistSongs.bind(this)
		this.updateHeaderTitle = this.updateHeaderTitle.bind(this)

		/*BrowseView*/
		//fetchPlaylistSongs: PropTypes.func,
		//updateHeaderTitle: PropTypes.func,
		this.addPlaylistItem = this.addPlaylistItem.bind(this)
		this.getLyrics = this.getLyrics.bind(this)

		this.updateVolume = this.updateVolume.bind(this)
		this.increaseSongTime = this.increaseSongTime.bind(this)


	}

	/*********** All actions  ********************************* */
	handleBrowseClick() {
		console.log("calling handleBrowseClick -------------------------")
		this.setState({ lyrics: "" })
		this.updateHeaderTitle('Browse');
		this.setState({lyrics:""})

		this.updateViewType('Featured');
		this.fetchFeatured(this.state.token);
	}

	/*uiAction*/
	updateHeaderTitle(inputTitle) {

		this.setState({ headerTitle: inputTitle })
		this.setState({ title: inputTitle })
	}

	getLyrics(song) {
		let trackTitle = song.name;

		let url = "https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.search?q_track=" + trackTitle + "&page_size=10&page=1&s_track_rating=desc&apikey=" + "0bd2d42337eee91e9a126ec59be1aadf";
		axios.get(url)
			.then(res => {

				let track_id = res.data.message.body.track_list[0].track.track_id;
				url = "https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=" + track_id + "&apikey=" + "0bd2d42337eee91e9a126ec59be1aadf";
				axios.get(url)
					.then(res => {
						let lyric = res.data.message.body.lyrics.lyrics_body;
						this.setState({ lyrics: lyric })

					})
					.catch(function (error) {
						//console.log(error.response);
					});
			})
			.catch(function (error) {
				//console.log(error.response);
			});
	}

	/*songAction*/
	fetchSongsPending() {
		console.log("calling fetchSongs - fetchSongsPending")
		this.setState({ fetchSongsPending: true })
		return {
			type: 'FETCH_SONGS_PENDING'
		}

	}

	fetchSongsSuccess(songList) {
		console.log("calling fetchSongs >>>>>>>>>>>>> success")
		this.setState({ fetchSongsSuccess: true })
		this.setState({ songs: songList })
		console.log("calling fetchSongs >>>>>>>>>>>>> success" + this.state.songs)
		return {
			type: 'FETCH_SONGS_SUCCESS',
			songList
		}
	}

	fetchSongsError() {
		console.log("calling fetchSongs - error")
		this.setState({ fetchSongsError: true })
		return {
			type: 'FETCH_SONGS_ERROR'
		}
	}

	fetchSongs(accessToken) {
		console.log("calling fetchSongs" + accessToken)
		/*return dispatch => {
			const request = new Request("https://api.spotify.com/v1/me/tracks?limit=50", {
				headers: new Headers({
					'Authorization': 'Bearer ' + accessToken
				})
			});

			dispatch(this.fetchSongsPending());

			fetch(request).then(res => {
				console.log("calling fetchSongs - Unauthorized")
				if (res.statusText === "Unauthorized") {
					window.location.href = './';
				}
				return res.json();
			}).then(res => {
				// get all artist ids and remove duplicates
				console.log("calling fetchSongs - callback")
				console.log(res.items)
				let uniqArtistIds = uniqBy(res.items);
				console.log("uniqArtistIds ::: " + uniqArtistIds.length)
				this.setState({artistIds:uniqArtistIds.map(item => {
					return item.track.artists[0].id
				}).join(',')});
				dispatch(this.setArtistIds(this.state.artistIds));

				dispatch(this.fetchSongsSuccess(res.items));
			}).catch(err => {
				dispatch(this.fetchSongsError(err));
			});
		}*/

		// const api = API.create('https://api.spotify.com/v1/me/tracks?limit=50')
		// api.setHeader('Authorization', 'Bearer ' + accessToken)
		// api.get('posts/1'}).then(result => console.log(result))

		/*take only token and save in token variable*/
		axios.get("https://api.spotify.com/v1/me/tracks?limit=50", { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				console.log("axios")
				console.log(res.data);

				// get all artist ids and remove duplicates
				console.log("calling fetchSongs - callback")
				let uniqArtistIds = uniqBy(res.data.items);
				console.log("uniqArtistIds ::: " + uniqArtistIds.length)
				this.setState({
					artistIds: uniqArtistIds.map(item => {
						return item.track.artists[0].id
					}).join(',')
				});
				console.log("artistIds (state)::" + this.state.artistIds)

				//dispatch(this.setArtistIds(this.state.artistIds));
				this.setArtistIds(this.state.artistIds)

				//dispatch(this.fetchSongsSuccess(res.items));
				this.fetchSongsSuccess(res.data.items)
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}

	searchSongsPending() {
		return {
			type: 'SEARCH_SONGS_PENDING'
		}
	}

	searchSongsSuccess(songList) {
		this.setState({ songs: songList })
		return {
			type: 'SEARCH_SONGS_SUCCESS',
			songList
		}
	}

	searchSongsError() {
		return {
			type: 'SEARCH_SONGS_ERROR'
		}
	}

	searchSongs(searchTerm, accessToken) {
		return dispatch => {
			const request = new Request(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track`, {
				headers: new Headers({
					'Authorization': 'Bearer ' + accessToken,
					'Accept': 'application/json'
				})
			});

			dispatch(this.searchSongsPending());

			fetch(request).then(res => {
				if (res.statusText === "Unauthorized") {
					window.location.href = './';
				}
				return res.json();
			}).then(res => {
				res.items = res.tracks.items.map(item => {
					return {
						track: item
					}
				});
				dispatch(this.searchSongsSuccess(res.items));
			}).catch(err => {
				dispatch(this.fetchSongsError(err));
			});
		}
	}

	fetchRecentlyPlayedPending() {
		return {
			type: 'FETCH_RECENTLY_PLAYED_PENDING'
		}
	}

	fetchRecentlyPlayedSuccess(songs) {
		this.setState({ songs: songs })
		return {
			type: 'FETCH_RECENTLY_PLAYED_SUCCESS',
			songs
		}
	}

	fetchRecentlyPlayedError() {
		return {
			type: 'FETCH_RECENTLY_PLAYED_ERROR'
		}
	}

	fetchRecentlyPlayed(accessToken) {
		return dispatch => {
			console.log("calling fetchRecentlyPlayed")
			const request = new Request(`https://api.spotify.com/v1/me/player/recently-played`, {
				headers: new Headers({
					'Authorization': 'Bearer ' + accessToken
				})
			});

			dispatch(this.fetchRecentlyPlayedPending());

			fetch(request).then(res => {
				return res.json();
			}).then(res => {
				//remove duplicates from recently played
				let uniqPlayed = uniqBy(res.items);
				res.items = uniqPlayed.map(item => {
					return item.track.id;
				});
				dispatch(this.fetchRecentlyPlayedSuccess(res.items));
			}).catch(err => {
				dispatch(this.fetchRecentlyPlayedError(err));
			});
		}
	}


	increaseSongTime(time) {
		this.setState({ timeElapsed: time })

	}

	updateViewType(inputView) {

		this.setState({ viewType: inputView })
	}

	/*albumAction*/
	fetchAlbumsPending() {
		return {
			type: 'FETCH_ALBUMS_PENDING'
		}
	}

	fetchAlbumsSuccess(albumList) {
		this.setState({ albums: albumList })
		this.setState({ lyrics: "" })
		return {
			type: 'FETCH_ALBUMS_SUCCESS',
			albumList
		}
	}

	fetchAlbumsError() {
		return {
			type: 'FETCH_ALBUMS_ERROR'
		}
	}

	fetchAlbums(accessToken) {
		return dispatch => {
			const request = new Request(`https://api.spotify.com/v1/me/albums`, {
				headers: new Headers({
					'Authorization': 'Bearer ' + accessToken
				})
			});

			dispatch(this.fetchAlbumsPending());

			fetch(request).then(res => {
				return res.json();
			}).then(res => {
				this.setState({lyrics:""})
				dispatch(this.fetchAlbumsSuccess(res.items));
			}).catch(err => {
				dispatch(this.fetchAlbumsError(err));
			});
		}
	}


	/*artistAction*/
	fetchArtistsPending() {
		this.setState({ fetchArtistsPending: true })
		return {
			type: 'FETCH_ARTISTS_PENDING'
		}
	}

	fetchArtistsSuccess(artists) {
		this.setState({ fetchArtistsSuccess: true })
		this.setState({ artists: artists })
		this.setState({ lyrics: "" })
		return {
			type: 'FETCH_ARTISTS_SUCCESS',

		}
	}

	fetchArtistsError() {
		this.setState({ fetchArtistsError: true })
		return {
			type: 'FETCH_ARTISTS_ERROR'
		}
	}

	fetchArtists(accessToken, artistIds) {
		console.log("calling fetchArtists ------------------------------")
		console.log("fetchArtists:::::" + accessToken)
		console.log("fetchArtists:::::" + artistIds)
		if (artistIds == null) {
			axios.get("https://api.spotify.com/v1/me/tracks?limit=50", { headers: { "Authorization": 'Bearer ' + accessToken } })
				.then(res => {
					let uniqArtistIds = uniqBy(res.data.items);
					this.setState({
						artistIds: uniqArtistIds.map(item => {
							return item.track.artists[0].id
						}).join(',')

						
					});

					// let arIds = uniqBy(this.state.artistIds);
					// 	this.setState({artistIds:arIds});

					let url = "https://api.spotify.com/v1/artists?ids=" + this.state.artistIds;
					axios.get(url, { headers: { "Authorization": 'Bearer ' + accessToken } })
						.then(res => {

							let uniqArtistIds = uniqBy(res.data.artists);
						
							this.fetchArtistsSuccess(uniqArtistIds)
						})
						.catch(function (error) {
							console.log(error.response);
						});
				})
				.catch(function (error) {
					console.log(error.response);
				});
		} else {
			let url = "https://api.spotify.com/v1/artists?ids=" + this.state.artistIds;
			axios.get(url, { headers: { "Authorization": 'Bearer ' + accessToken } })
				.then(res => {


					// get all artist ids and remove duplicates
					console.log("calling fetchArtis - callback")
					console.log("res" + res)


					//dispatch(this.fetchSongsSuccess(res.items));
					this.fetchArtistsSuccess(res.data.artists)
				})
				.catch(function (error) {
					console.log(error.response);
				});
		}


	}


	fetchArtistSongsPending() {
		return {
			type: 'FETCH_ARTIST_SONGS_PENDING'
		}
	}

	fetchArtistSongsSuccess(songList) {
		this.setState({ songs: songList })
		return {
			type: 'FETCH_ARTIST_SONGS_SUCCESS',
			songList
		}
	}

	fetchArtistSongsError() {
		return {
			type: 'FETCH_ARTIST_SONGS_ERROR'
		}
	}

	fetchArtistSongs(artistId, accessToken) {
		return dispatch => {
			const request = new Request(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`, {
				headers: new Headers({
					'Authorization': 'Bearer ' + accessToken
				})
			});

			dispatch(this.fetchArtistSongsPending());

			fetch(request).then(res => {
				if (res.statusText === "Unauthorized") {
					window.location.href = './';
				}
				return res.json();
			}).then(res => {
				// map the response to match that returned from get song request
				res.items = res.tracks.map(item => {
					return {
						track: item
					}
				});

				dispatch(this.fetchArtistSongsSuccess(res.items));
			}).catch(err => {
				dispatch(this.fetchArtistSongsError(err));
			});
		}
	}


	setArtistIds(inputArtistIds) {
		// return {
		// 	type: 'SET_ARTIST_IDS',
		// 	artistIds
		// }
		console.log("calling fetchSongs - setArtistIds")
		this.setState({ artistIds: inputArtistIds })
	}

	/*browserAction*/
	fetchCategoriesSuccess(categories) {
		this.setState({ categories: categories })
		return {
			type: 'FETCH_CATEGORIES_SUCCESS',
			categories
		}
	}

	fetchCategoriesError() {
		return {
			type: 'FETCH_CATEGORIES_ERROR'
		}
	}

	fetchCategories(accessToken) {

		axios.get("https://api.spotify.com/v1/browse/categories", { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				console.log("/**************fetchNewReleases*****************")

				this.fetchCategoriesSuccess(res.data.categories.items)

			})
			.catch(function (error) {
				console.log(error.response);
			});
	}

	fetchNewReleasesSuccess(newReleases) {
		this.setState({ newReleases: newReleases })
		return {
			type: 'FETCH_NEW_RELEASES_SUCCESS',
			newReleases
		}
	}

	fetchNewReleasesError() {
		return {
			type: 'FETCH_NEW_RELEASES_ERROR'
		}
	}

	fetchNewReleases(accessToken) {
		// return dispatch => {
		// 	const request = new Request(`https://api.spotify.com/v1/browse/new-releases`, {
		// 		headers: new Headers({
		// 			'Authorization': 'Bearer ' + accessToken
		// 		})
		// 	});
		// 	fetch(request).then(res => {
		// 		return res.json();
		// 	}).then(res => {
		// 		dispatch(this.fetchNewReleasesSuccess(res.albums));
		// 	}).catch(err => {
		// 		dispatch(this.fetchNewReleasesError(err));
		// 	});
		// }
		axios.get("https://api.spotify.com/v1/browse/new-releases", { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				console.log("/**************fetchNewReleases*****************")
				console.log(res.data.albums.item)
				console.log(accessToken)
				this.fetchNewReleasesSuccess(res.data.albums.items)

			})
			.catch(function (error) {
				console.log(error.response);
			});
	}

	fetchFeaturedSuccess(featured) {
		this.setState({ featured: featured })
	}

	fetchFeaturedError() {
		return {
			type: 'FETCH_FEATURED_ERROR'
		}
	}

	fetchFeatured(accessToken) {
		// return dispatch => {
		// 	const request = new Request(`https://api.spotify.com/v1/browse/featured-playlists`, {
		// 		headers: new Headers({
		// 			'Authorization': 'Bearer ' + accessToken
		// 		})
		// 	});
		// 	fetch(request).then(res => {
		// 		return res.json();
		// 	}).then(res => {
		// 		dispatch(this.fetchFeaturedSuccess(res.playlists));
		// 	}).catch(err => {
		// 		dispatch(this.fetchFeaturedError(err));
		// 	});
		// }

		axios.get("https://api.spotify.com/v1/browse/featured-playlists", { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				console.log("browse list")
				console.log(res.playlists)
				console.log(accessToken)
				this.fetchFeaturedSuccess(res.data.playlists.items)

			})
			.catch(function (error) {
				console.log(error.response);
			});
	}

	/*playlistAction*/

	fetchPlaylistMenuPending() {
		return {
			type: 'FETCH_PLAYLIST_MENU_PENDING'
		}
	}

	fetchPlaylistMenuSuccess(playlists) {
		this.setState({ playlists: playlists })
		return {
			type: 'FETCH_PLAYLIST_MENU_SUCCESS',
			playlists
		}
	}

	fetchPlaylistMenuError() {
		return {
			type: 'FETCH_PLAYLIST_MENU_ERROR'
		}
	}

	addPlaylistItem(playlist) {
		return {
			type: 'ADD_PLAYLIST_ITEM',
			playlist
		}
	}

	fetchPlaylistsMenu(userId, accessToken) {
		// return dispatch => {
		// 	const request = new Request(`https://api.spotify.com/v1/users/${userId}/playlists`, {
		// 		headers: new Headers({
		// 			'Authorization': 'Bearer ' + accessToken
		// 		})
		// 	});

		// 	dispatch(this.fetchPlaylistMenuPending());

		// 	fetch(request).then(res => {
		// 		if (res.statusText === "Unauthorized") {
		// 			window.location.href = './';
		// 		}
		// 		return res.json();
		// 	}).then(res => {
		// 		dispatch(this.fetchPlaylistMenuSuccess(res.items));
		// 	}).catch(err => {
		// 		dispatch(this.fetchPlaylistMenuError(err));
		// 	});
		// }
		let url = "https://api.spotify.com/v1/users/" + { userId } + "/playlists";
		axios.get(url, { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				console.log("/**************fetchNewReleases*****************")
				console.log(res.data.items)
				console.log(accessToken)
				this.fetchPlaylistMenuSuccess(res.data.items)

			})
			.catch(function (error) {
				console.log(error.response);
			});
	}


	fetchPlaylistSongsPending() {
		this.setState({ fetchPlaylistSongsPending: true })
		return {
			type: 'FETCH_PLAYLIST_SONGS_PENDING'
		}
	}

	fetchPlaylistSongsSuccess(songs) {
		this.setState({ fetchPlaylistSongsSuccess: true })
		this.setState({ songs: songs })
		return {
			type: 'FETCH_PLAYLIST_SONGS_SUCCESS',
			songs
		}
	}

	fetchPlaylistSongsError() {
		this.setState({ fetchPlaylistSongsError: true })
		return {
			type: 'FETCH_PLAYLIST_SONGS_ERROR'
		}
	}

	fetchPlaylistSongs(userId, playlistId, accessToken) {
		// return dispatch => {
		// 	const request = new Request(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
		// 		headers: new Headers({
		// 			'Authorization': 'Bearer ' + accessToken
		// 		})
		// 	});

		// 	dispatch(this.fetchPlaylistSongsPending());

		// 	fetch(request).then(res => {
		// 		return res.json();
		// 	}).then(res => {
		// 		//remove duplicate tracks

		// 		let uniqTrack = uniqBy(res.items)
		// 		res.items = uniqTrack.map(item => {
		// 			return item.track.id;
		// 		});
		// 		dispatch(this.fetchPlaylistSongsSuccess(res.items));
		// 	}).catch(err => {
		// 		dispatch(this.fetchPlaylistSongsError(err));
		// 	});
		// }
		let url = "https://api.spotify.com/v1/users/${userId}/playlists/" + { playlistId } + "/tracks";
		axios.get(url, { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {

				let uniqTrack = uniqBy(res.data.items)
				res.items = uniqTrack.map(item => {
					return item.track.id;
				});

				//dispatch(this.fetchSongsSuccess(res.items));
				this.fetchPlaylistSongsSuccess(res.items)
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}




	/*soundAction*/
	updateVolume(volume) {
		this.setState({ volume: volume })
		// return {
		// 	type: 'UPDATE_VOLUME',
		// 	volume
		// }
	}


	/*tokenAction*/

	setToken(access_token) {
		this.setState({ token: access_token })
		console.log(this.state.token)
	}

	/*userAction*/
	fetchUserSuccess(current_user) {
		this.setState({ user: current_user })
		return {
			type: 'FETCH_USER_SUCCESS',
			current_user
		}
	}

	fetchUserError() {
		return {
			type: 'FETCH_USER_ERROR'
		}
	}

	fetchUser(accessToken) {

		return dispatch => {
			const request = new Request('https://api.spotify.com/v1/me', {
				headers: new Headers({
					'Authorization': 'Bearer ' + accessToken
				})
			});

			fetch(request).then(res => {
				// send user back to homepage if no token
				if (res.statusText === "Unauthorized") {
					window.location.href = './';
				}
				return res.json();
			}).then(res => {
				dispatch(this.fetchUserSuccess(res));
			}).catch(err => {
				dispatch(this.fetchUserError(err));
			});
		}
	}

	addSongToLibrarySuccess(songId) {
		return {
			type: 'ADD_SONG_TO_LIBRARY_SUCCESS',
			songId
		}
	}

	addSongToLibraryError() {
		return {
			type: 'ADD_SONG_TO_LIBRARY_ERROR'
		}
	}

	addSongToLibrary(accessToken, id) {

		return dispatch => {

			const request = new Request(`https://api.spotify.com/v1/me/tracks?ids=${id}`, {
				method: 'PUT',
				headers: new Headers({
					'Authorization': 'Bearer ' + accessToken
				})
			});

			fetch(request).then(res => {
				if (res.ok) {
					dispatch(this.addSongToLibrarySuccess(id));
				}
			}).catch(err => {
				dispatch(this.addSongToLibraryError(err));
			});
		}
	}









	/**** Action:App */
	componentDidMount() {

		console.log("Calling componentDidMount")

		let hashParams = {}
		let e, r = /([^&;=]+)=?([^&;]*)/g,
			q = window.location.hash.substring(1);
		while (e = r.exec(q)) {
			hashParams[e[1]] = decodeURIComponent(e[2]);
		}
		console.log("hashParams.access_token::::: " + hashParams.access_token)
		if (!hashParams.access_token) {
			window.location.href = 'https://accounts.spotify.com/authorize?client_id=230be2f46909426b8b80cac36446b52a&scope=playlist-read-private%20playlist-read-collaborative%20playlist-modify-public%20user-read-recently-played%20playlist-modify-private%20ugc-image-upload%20user-follow-modify%20user-follow-read%20user-library-read%20user-library-modify%20user-read-private%20user-read-email%20user-top-read%20user-read-playback-state&response_type=token&redirect_uri=http://localhost:3000/callback';
		} else {
			this.setToken(hashParams.access_token);

		}
	}



	// componentWillReceiveProps(nextProps) {
	// 	if (nextProps.token) {
	// 		this.fetchUser(nextProps.token);
	// 	}

	// 	if (this.audio !== undefined) {
	// 		this.audio.volume = nextProps.volume / 100;
	// 	}

	// }

	componentWillReceiveProps(nextProps) {
		if (this.state.token) {
			this.fetchUser(this.state.token);
		}

		if (this.audio !== undefined) {
			this.audio.volume = this.state.volume / 100;
		}

	}

	stopSong() {
		if (this.audio) {
			//this.props.stopSong();
			this.setState({ stopSong: true })
			this.audio.pause();
		}
		this.setState({ songPlaying: false });
		this.setState({ songDetails: null });
		//this.setState({songPaused:true})
		this.setState({ timeElapsed: 0 });
		//this.setState({songPaused: true});
	}

	// pauseSong() {
	// 	// if (this.audio) {
	// 	// 	//this.props.pauseSong();

	// 	// 	this.audio.pause();
	// 	// }
	// 	//this.audio = new Audio(this.state.song.track.preview_url);
	//     this.audio.pause();
	// 	this.setState({pauseSong:true})
	// }

	// resumeSong() {
	// 	this.audio = new Audio(this.state.song.track.preview_url);
	//     this.audio.play();

	// 	// if (this.audio) {
	// 	// 	//this.props.resumeSong();
	// 	// 	//this.setState({resumeSong:true})
	// 	// 	this.audio.play();
	// 	// }
	// 	this.setState({pauseSong:false})
	// }



	/*play() {
		this.setState({
			play: true,
			pause: false
		});
		//this.setState({song:song});
		console.log(this.audio);
		this.audio.play();
	}

	pause() {
		this.setState({ play: false, pause: true });
		this.audio.pause();
	}*/
	playSong(song) {
		this.setState({ song: song });
		this.setState({ albumImage: song.album.images[0].url })
		// this.setState({isPlaySong:true});
		// this.setState({songPlaying:true});

		this.setState({ songPlaying: true });
		this.setState({ songDetails: song });
		this.setState({ songId: song.id });
		this.setState({ timeElapsed: 0 });
		this.setState({ songName: song.name });
		this.setState({ artistName: song.artists[0].name });
		this.getLyrics(song);
		//this.setState({songPaused: false});
		// return {
		// 	type: 'PLAY_SONG',
		// 	song
		// }
	}


	audioControl(song, audio, isnewAudio) {

		if (isnewAudio) {
			this.playSong(song.track);
			//audio = new Audio(song.track.preview_url);
			audio.src = song.track.preview_url;
			audio.play();



		} else {
			this.stopSong();
			audio.pause();
			this.playSong(song.track);
			audio.src = song.track.preview_url;
			audio.play();


		}
	}

	pauseSong(isPaused, audio) {

		console.log("------------------PAUSE------------------------")

		console.log("songId   ::" + this.state.songId)
		console.log("songPlaying :: " + this.state.songPlaying)
		console.log("songPaused :: " + this.state.songPaused)

		if (isPaused == 1) {
			//this.setState({ pauseSong: true })
			this.setState({ songPaused: true })
			audio.pause();
		}
		if (isPaused == 0) {
			//this.setState({ pauseSong: true })
			this.setState({ songPaused: false })
			audio.play();
		}


	}

	resumeSong(audio) {

		console.log("------------------RESUME------------------------")

		console.log("songId   ::" + this.state.songId)
		console.log("songPlaying :: " + this.state.songPlaying)
		console.log("songPaused :: " + this.state.songPaused)

		//if (audio) {
		//this.setState({ resumeSong: true })
		this.setState({ songPaused: false })

		this.audio.play();
		//}
	}



	/*sideMenu*/



	render() {
		let audio;
		return (
			<div className={styles.App}>
				<div className={styles.app_container}>

					<div className={styles.left_side_section}>
						<SideMenu
							token={this.state.token}
							title={this.state.title}
							artistIds={this.state.artistIds}
							viewType={this.state.viewType}
							artists={this.state.artists}

							updateHeaderTitle={this.updateHeaderTitle}
							updateViewType={this.updateViewType}
							fetchFeatured={this.fetchFeatured}
							handleBrowseClick={this.handleBrowseClick}
							fetchRecentlyPlayed={this.fetchRecentlyPlayed}
							fetchSongs={this.fetchSongs}
							fetchAlbums={this.fetchAlbums}
							fetchArtists={this.fetchArtists}


						/>
						{/* <UserPlaylists
							userId={this.state.userId}
							token={this.state.token}
							title={this.state.title}
							artistIds={this.state.artistIds}
							playlistMenu={this.state.playlistMenu}
							artists={this.state.artists}

							fetchPlaylistsMenu={this.fetchPlaylistsMenu}
							fetchPlaylistSongs={this.fetchPlaylistSongs}
							updateHeaderTitle={this.updateHeaderTitle}
						/> */}
						<ArtWork
							albumImage={this.state.albumImage} />
					</div>

					<div className={styles.main_section}>
						<Header />
						<div className={styles.main_section_container}>
							<MainHeader
								token={this.state.token}
								stopSong={this.stopSong}
								playSong={this.playSong}

								fetchCategories={this.fetchCategories}
								fetchNewReleases={this.fetchNewReleases}
								fetchFeatured={this.fetchFeatured}
								updateHeaderTitle={this.updateHeaderTitle}
								updateViewType={this.updateViewType}

								viewType={this.state.viewType}
								songPaused={this.state.songPaused}
								headerTitle={this.state.headerTitle}
								playlists={this.state.playlists}
								playlistMenu={this.state.playlistMenu}
								artists={this.state.artists}
								artistIds={this.state.artistIds}
								newReleases={this.state.newReleases}
								categories={this.state.categories}

							/>
							<MainView


								stopSong={this.stopSong}
								playSong={this.playSong}

								isPauseSong={this.state.pauseSong}
								isResumeSong={this.state.resumeSong}
								isSstopSong={this.state.stopSong}
								isPlaySong={this.state.playSong}

								pauseSong={this.pauseSong}
								resumeSong={this.resumeSong}


								audioControl={this.audioControl}
								title={this.state.title}
								artistIds={this.state.artistIds}
								artists={this.state.artists}

								viewType={this.state.viewType}
								token={this.state.token}
								fetchPlaylistSongs={this.fetchPlaylistSongs}
								updateHeaderTitle={this.updateHeaderTitle}
								addPlaylistItem={this.addPlaylistItem}

								fetchArtistSongs={this.fetchArtistSongs}
								fetchFeatured={this.fetchFeatured}


								fetchSongsPending={this.state.fetchSongsPending}
								fetchSongsSuccess={this.state.fetchSongsSuccess}
								fetchSongsError={this.state.fetchSongsError}

								fetchPlaylistSongsPending={this.state.fetchPlaylistSongsPending}


								songs={this.state.songs}
								songPaused={this.state.songPaused}
								songId={this.state.songId}
								songPlaying={this.state.songPlaying}
								songDetails={this.state.songDetails}
								timeElapsed={this.state.timeElapsed}

								songAddedId={this.state.songAddedId}
								headerTitle={this.state.headerTitle}

								lyrics={this.state.lyrics}
								getLyrics={this.getLyrics}

								addSongToLibrary={this.addSongToLibrary}

								featured={this.state.featured}

								newReleases={this.state.newReleases}
								categories={this.state.categories}



							/>
						</div>
					</div>
					<Lyrics
						lyrics={this.state.lyrics}
						song={this.state.song} />

					<Footer



						stopSong={this.stopSong}
						playSong={this.playSong}
						increaseSongTime={this.increaseSongTime}

						songName={this.state.songName}
						artistName={this.state.artistName}

						songs={this.state.songs}
						song={this.state.song}
						songPlaying={this.state.songPlaying}
						timeElapsed={this.state.timeElapsed}
						songPaused={this.state.songPaused}
						songDetails={this.state.songDetails}

						volume={this.state.volume}
						updateVolume={this.updateVolume}

						lyrics={this.state.lyrics}
						getLyrics={this.getLyrics}

						pauseSong={this.pauseSong}
						resumeSong={this.resumeSong}
						audioControl={this.audioControl}

					/>
				</div>
			</div>
		);
	}
}

export default hot(module)(App);
