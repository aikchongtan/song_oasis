import React from 'react';
import { hot } from 'react-hot-loader';
import axios from 'axios';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import uniqBy from 'lodash/uniqBy';
import styles from './styles/style.scss';
import Lyrics from './components/Lyrics/Lyrics';
import SideMenu from './components/SideMenu/SideMenu';
import Header from './components/Header/Header';
import MainHeader from './components/MainHeader/MainHeader';
import MainView from './components/MainView/MainView';
import Footer from './components/Footer/Footer';

import '../public/canvas.js';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			volume: 0.5,
			lyrics: "",
			token: null,
			viewtype: null,
			songPaused: true,
			songPlaying: false,
			songDetails: null,
			headerTitle: "",
			playlists: [],
			artists: [],
			songs: null,
			song: null,
			categories: null,
			newReleases: null,
			featured: null,
			user: null,
			songId: 0,
			timeElapsed: 0,
			songName: "",
			artistName: "",
			albums: [],
			artistIds: null,
		}

		this.fetchFeatured = this.fetchFeatured.bind(this)
		this.fetchRecentlyPlayed = this.fetchRecentlyPlayed.bind(this)
		this.fetchSongs = this.fetchSongs.bind(this)
		this.fetchAlbums = this.fetchAlbums.bind(this)
		this.fetchArtists = this.fetchArtists.bind(this)
		this.fetchCategories = this.fetchCategories.bind(this)
		this.fetchNewReleases = this.fetchNewReleases.bind(this)
		this.fetchPlaylistsMenu = this.fetchPlaylistsMenu.bind(this)
		this.fetchPlaylistSongs = this.fetchPlaylistSongs.bind(this)
		this.fetchCategorySongs = this.fetchCategorySongs.bind(this)
		this.fetchNewReleaseSongs = this.fetchNewReleaseSongs.bind(this)
		this.fetchArtistSongs = this.fetchArtistSongs.bind(this)
		
		this.audioControl = this.audioControl.bind(this)
		this.pauseSong = this.pauseSong.bind(this)
		this.getLyrics = this.getLyrics.bind(this)
		this.updateVolume = this.updateVolume.bind(this)
		this.increaseSongTime = this.increaseSongTime.bind(this)
		this.updateHeaderTitle = this.updateHeaderTitle.bind(this)
		this.updateSongList = this.updateSongList.bind(this)
		this.updateViewType = this.updateViewType.bind(this)
		this.handleBrowseClick = this.handleBrowseClick.bind(this)
	}

	/******************   API Call  ******************** */
	getLyrics(song) {
		axios.get("https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.search?q_track=" + song.name + "&page_size=10&page=1&s_track_rating=desc&apikey=" + "0bd2d42337eee91e9a126ec59be1aadf")
			.then(res => {
				let track_id = res.data.message.body.track_list[0].track.track_id;
				axios.get("https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=" + track_id + "&apikey=" + "0bd2d42337eee91e9a126ec59be1aadf")
					.then(res => {
						let lyric = res.data.message.body.lyrics.lyrics_body;
						this.setState({ lyrics: lyric })
					})
					.catch(function (error) {
						console.log(error.response);
					});
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}

	fetchSong(id, accessToken) {
		axios.get("https://api.spotify.com/v1/me/tracks?ids=" + id, { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				this.fetchSongSuccess(res.data)
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}
	fetchSongSuccess(song) {
		this.setState({ song: song });
	}

	fetchSongs(accessToken) {
		axios.get("https://api.spotify.com/v1/me/tracks?limit=50", { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				this.fetchSongsSuccess(res.data.items)
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}
	fetchSongsSuccess(songs) {
		this.setState({ songs: songs });
	} 

	searchSongs(searchTerm, accessToken) {
		axios.get("https://api.spotify.com/v1/search?q=" + searchTerm + "&type=track", { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				res.items = res.data.tracks.items.map(item => {
					return {
						track: item
					}
				});
				this.searchSongsSuccess(res.items);
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}
	searchSongsSuccess(songs) {
		this.setState({ songs: songs })
	}
	
	fetchRecentlyPlayed(accessToken) {
		axios.get("https://api.spotify.com/v1/me/player/recently-played", { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				this.fetchRecentlyPlayedSuccess(res.data.items);
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}
	fetchRecentlyPlayedSuccess(songs) {
		this.setState({ songs: songs })
	}

	fetchAlbums(accessToken) {
		axios.get("https://api.spotify.com/v1/me/albums", { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				this.fetchAlbumsSuccess(res.data.items)
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}
	fetchAlbumsSuccess(albums) {
		this.setState({ albums: albums })
	}

	fetchArtists(accessToken) {
		axios.get("https://api.spotify.com/v1/me/tracks?limit=50", { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				this.setState({
					artistIds: res.data.items.map(item => {
						return item.track.artists[0].id
					}).join(',')
				});

				let arrIds = this.state.artistIds.split(",");
				this.setState({ artistIds: uniqBy(arrIds) });

				axios.get("https://api.spotify.com/v1/artists?ids=" + this.state.artistIds, { headers: { "Authorization": 'Bearer ' + accessToken } })
					.then(res => {
						this.fetchArtistsSuccess(res.data.artists)
						})
					.catch(function (error) {
						console.log(error.response);
					});
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}
	fetchArtistsSuccess(artists) {
		this.setState({ artists: artists })
		this.setState({ lyrics: "" })
	}

	fetchArtistSongs(artistId, accessToken) {
		axios.get("https://api.spotify.com/v1/artists/" + artistId + "/top-tracks?country=US", { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				if (res.statusText != "Unauthorized") {
					res.items = res.data.tracks.map(item => {
						return {
							track: item
						}
					});
					this.fetchArtistSongsSuccess(res.items)
				}
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}
	fetchArtistSongsSuccess(songs) {
		this.setState({ songs: songs })
	}

	fetchCategories(accessToken) {
		axios.get("https://api.spotify.com/v1/browse/categories", { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				this.fetchCategoriesSuccess(res.data.categories.items)
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}
	fetchCategoriesSuccess(categories) {
		this.setState({ categories: categories })
	}

	fetchCategorySongs(category_id, accessToken) {
		let url = "https://api.spotify.com/v1/browse/categories/" + category_id + "/playlists";
		axios.get(url, { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				let url2 = "https://api.spotify.com/v1/playlists/" + res.data.playlists.items[0].id + "/tracks?limit=50"
                axios.get(url2 , { headers: { "Authorization": 'Bearer ' + accessToken } })
                .then(res => {
	                this.setState({viewType: "Featured"})
                    this.fetchCategorySongsSuccess(res.data.playlists.items)
                })
                .catch(function (error) {
                    console.log(error.response);
                });
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}
	fetchCategorySongsSuccess(featured) {
		this.setState({ featured: featured })
	}

	fetchNewReleases(accessToken) {
		axios.get("https://api.spotify.com/v1/browse/new-releases", { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				this.fetchNewReleasesSuccess(res.data.albums.items)
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}
	fetchNewReleasesSuccess(newReleases) {
		this.setState({ newReleases: newReleases })
	}
	
	fetchNewReleaseSongs(album, accessToken){
		let url =  "https://api.spotify.com/v1/albums/" + album.id + "/tracks?offset=0&limit=2";
		axios.get(url, { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				res.items = res.data.items.map(item => {
					return {...item, album:album};
				});
				res.items = res.items.map(item => {
					return {track: item}
				});
				this.fetchNewReleaseSongsSuccess(res.items )
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}
	fetchNewReleaseSongsSuccess(songs){
		this.setState({ songs: songs })
	}

	fetchFeatured(accessToken) {
		axios.get("https://api.spotify.com/v1/browse/featured-playlists", { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				this.fetchFeaturedSuccess(res.data.playlists.items)
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}
	fetchFeaturedSuccess(featured) {
		this.setState({ featured: featured })
	}

	fetchPlaylistSongs(userId, playlistId, accessToken) {
		let url = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";
		axios.get(url, { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				let uniqTrack = uniqBy(res.data.items)
				res.items = uniqTrack.map(item => {
					return item;
				});
				this.fetchPlaylistSongsSuccess(res.items)
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}
	fetchPlaylistSongsSuccess(songs) {
		this.setState({ songs: songs })
	}

	fetchPlaylistsMenu(userId, accessToken) {
		axios.get("https://api.spotify.com/v1/users/" + { userId } + "/playlists", { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				this.fetchPlaylistMenuSuccess(res.data.items)
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}
	fetchPlaylistMenuSuccess(playlists) {
		this.setState({ playlists: playlists })
	}

	fetchUser(accessToken) {
		axios.get("https://https://api.spotify.com/v1/me", { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				this.fetchUserSuccess(res.data)
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}
	fetchUserSuccess(current_user) {
		this.setState({ user: current_user })
	}

	addSongToLibrary(accessToken, id) {
		axios.get("https://api.spotify.com/v1/me/tracks?ids=" + id, { headers: { "Authorization": 'Bearer ' + accessToken } })
			.then(res => {
				this.addSongToLibrarySuccess(id)
			})
			.catch(function (error) {
				console.log(error.response);
			});
	}
	addSongToLibrarySuccess(songId) {
		return {
			songId
		}
	}

	/******************   Functions  ******************** */
	handleBrowseClick(token) {
		this.setState({ lyrics: "" })
		this.updateHeaderTitle('Browse');
		this.updateViewType('Featured');
		this.fetchFeatured(this.state.token == null ? token: '');
	}

	updateHeaderTitle(inputTitle) {
		this.setState({ headerTitle: inputTitle })
	}

	updateSongList(songs){
		this.setState({ songs: songs })
	}

	increaseSongTime(time) {
		this.setState({ timeElapsed: time })
	}

	updateViewType(inputView) {
		this.setState({ viewType: inputView })
	}

	updateVolume(volume) {
		let audioVolume = volume.target.value;
		this.setState({ volume: audioVolume })
		if (this.audio != undefined)  {
			this.audio.volume = audioVolume;
		}
	}

	setToken(access_token) {
		this.setState({ token: access_token })
	}

	/******************   Action:app  ******************** */
	componentDidMount() {
		let hashParams = {}
		let e, r = /([^&;=]+)=?([^&;]*)/g,
			q = window.location.hash.substring(1);
		while (e = r.exec(q)) {
			hashParams[e[1]] = decodeURIComponent(e[2]);
		}
		console.log("hashParams.access_token::::: " + hashParams.access_token)
		if (!hashParams.access_token) {
			// window.location.href = 'https://accounts.spotify.com/authorize?client_id=230be2f46909426b8b80cac36446b52a&scope=playlist-read-private%20playlist-read-collaborative%20playlist-modify-public%20user-read-recently-played%20playlist-modify-private%20ugc-image-upload%20user-follow-modify%20user-follow-read%20user-library-read%20user-library-modify%20user-read-private%20user-read-email%20user-top-read%20user-read-playback-state&response_type=token&redirect_uri=http://localhost:3000/callback';
			window.location.href = 'https://accounts.spotify.com/authorize?client_id=230be2f46909426b8b80cac36446b52a&scope=playlist-read-private%20playlist-read-collaborative%20playlist-modify-public%20user-read-recently-played%20playlist-modify-private%20ugc-image-upload%20user-follow-modify%20user-follow-read%20user-library-read%20user-library-modify%20user-read-private%20user-read-email%20user-top-read%20user-read-playback-state&response_type=token&redirect_uri=https://songoasis.herokuapp.com/callback';
		} else {
			this.setToken(hashParams.access_token);
			this.props.viewType == undefined ? this.handleBrowseClick(hashParams.access_token) : '';
		}
	}

	componentWillReceiveProps() {
		if (this.state.token) {
			this.fetchUser(this.state.token);
		}
	}

	/******************   Audio Control  ******************** */
	audioPlay(song, isnewAudio) {
		if (isnewAudio || isnewAudio == undefined) 
		{
			this.playSong(song.track);
			this.audio.src = song.track.preview_url;
			this.audio.play();
		} else {
			this.stopSong();
			this.audio.pause();
			this.playSong(song.track);
			this.audio.src = song.track.preview_url;
			this.audio.play();
		}
	}
	audioControl(song) {
		if (this.audio === undefined) {
		  	this.audio = new Audio();
		  	this.audioPlay(song, 1)
		} else {
		  	this.audioPlay(song, 0)
		}
	}
	playSong(song) {
		this.setState({ song: song });
		this.setState({ albumImage:song.album == undefined ? song.oneAlbum.images[0].url : song.album.images[0].url})
		this.setState({ songPlaying: true });
		this.setState({ songPaused: false });
		this.setState({ songDetails: song });
		this.setState({ songId: song.id });
		this.setState({ timeElapsed: 0 });
		this.setState({ songName: song.name });
		this.setState({ artistName: song.artists == undefined ? song.album.artists[0].name : song.artists[0].name});
		this.getLyrics(song);
	}
	stopSong() {
		if (this.audio) 
		{
			this.setState({ stopSong: true })
			this.audio.pause();
		}
		this.setState({ songPlaying: false });
		this.setState({ songDetails: null });
		this.setState({ timeElapsed: 0 });
	}
	pauseSong(isPaused) {
		if (isPaused == 1) {
			this.setState({ songPaused: true })
			this.audio.pause();
		}
		if (isPaused == 0) {
			this.setState({ songPaused: false })
			this.audio.play();
		}
	}

	render() {
		return (
			
			<div className={styles.App}> 
				<div className={styles.app_container}>
					<div className={styles.left_side_section}>
						<SideMenu
							token={this.state.token}
							headerTitle={this.state.headerTitle}
							artistIds={this.state.artistIds}
							viewType={this.state.viewType}

							updateHeaderTitle={this.updateHeaderTitle}
							updateViewType={this.updateViewType}
							handleBrowseClick={this.handleBrowseClick}
							fetchRecentlyPlayed={this.fetchRecentlyPlayed}
							fetchSongs={this.fetchSongs}
							fetchAlbums={this.fetchAlbums}
							fetchArtists={this.fetchArtists}
						/>
					</div>

					<div className={styles.main_section}>
						<Header />
						<div className={styles.main_section_container}>
							<MainHeader
								token={this.state.token}
								viewType={this.state.viewType}
								headerTitle={this.state.headerTitle}
								playlists={this.state.playlists}
								artists={this.state.artists}
								artistIds={this.state.artistIds}
								newReleases={this.state.newReleases}
								categories={this.state.categories}
								albums={this.state.albums}
								featured={this.state.featured}

								fetchCategories={this.fetchCategories}
								fetchNewReleases={this.fetchNewReleases}
								fetchFeatured={this.fetchFeatured}
								updateHeaderTitle={this.updateHeaderTitle}
								updateViewType={this.updateViewType}
							/>
							<MainView
								token={this.state.token}
								artists={this.state.artists}
								viewType={this.state.viewType}
								songPaused={this.state.songPaused}
								songId={this.state.songId}
								songPlaying={this.state.songPlaying}
								songDetails={this.state.songDetails}
								timeElapsed={this.state.timeElapsed}
								songs={this.state.songs}
								headerTitle={this.state.headerTitle}
								lyrics={this.state.lyrics}
								newReleases={this.state.newReleases}
								categories={this.state.categories}
								albums={this.state.albums}
								featured={this.state.featured}
								
								audioControl={this.audioControl}
								pauseSong={this.pauseSong}
								updateHeaderTitle={this.updateHeaderTitle}
								updateSongList={this.updateSongList}
								fetchArtistSongs={this.fetchArtistSongs}
								fetchFeatured={this.fetchFeatured}
								fetchPlaylistSongs={this.fetchPlaylistSongs}
								fetchCategorySongs={this.fetchCategorySongs}
								fetchNewReleaseSongs={this.fetchNewReleaseSongs}
								addSongToLibrary={this.addSongToLibrary}
							/>
						</div>
					</div>
					<div className={styles.lyrics_container}>
						<Lyrics
							lyrics={this.state.lyrics}
							song={this.state.song} 
							viewType={this.state.viewType}
						/>
					</div>
					<Footer
						songName={this.state.songName}
						artistName={this.state.artistName}
						songs={this.state.songs}
						song={this.state.song}
						songPlaying={this.state.songPlaying}
						timeElapsed={this.state.timeElapsed}
						songPaused={this.state.songPaused}
						songDetails={this.state.songDetails}
						volume={this.state.volume}
						albumImage={this.state.albumImage}

						audioControl={this.audioControl}
						pauseSong={this.pauseSong}
						increaseSongTime={this.increaseSongTime}
						updateVolume={this.updateVolume}
					/>
				</div>
			</div>
		);
	}
}

export default hot(module)(App);
