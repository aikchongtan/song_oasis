import React from 'react';
import styles from './style.scss';
class MainHeader extends React.Component {
	render() {

		let currentArtist = [];
		let currentAlbum = [];
		let currentPlaylist = [];
		let currentFeature = [];
		let currentRelease;

		if (this.props.viewType === 'playlist') {
			currentPlaylist = this.props.playlists.filter(playlist => {
				return playlist.name === this.props.headerTitle;
			})[0];
		}

		if (this.props.viewType === 'Artists' && this.props.artists) {
			currentArtist = this.props.artists.filter(artist => {
				return artist.name === this.props.headerTitle;
			})[0];
		}

		if (this.props.viewType === 'Albums' && this.props.albums) {
			currentAlbum = this.props.albums.filter(item => {
				return item.album.name === this.props.headerTitle;
			})[0];
		}

		if (this.props.viewType === 'Featured' && this.props.featured) {
			currentFeature = this.props.featured.filter(item => {
				return item.name === this.props.headerTitle;
			})[0];
		}

		if (this.props.viewType === 'New Releases' && this.props.newReleases) {
			currentRelease = this.props.newReleases.filter(item => {
				return item.name === this.props.headerTitle;
			})[0];
		}
		
		let display =
			this.props.viewType === 'playlist' ?
			<div className={styles.playlist_title_container}>
        		<div className={styles.playlist_image_container}>
					<img className={styles.playlist_image} src={currentPlaylist.images[0] ? currentPlaylist.images[0].url : null} />
				</div>
				<div className={styles.playlist_info_container}>
					<p className={styles.playlist_text}>PLAYLIST</p>
					<h3 className={styles.header_title}>{this.props.headerTitle}</h3>
					<p className={styles.created_by}>Created By: <span className={styles.lighter_text}>{currentPlaylist.owner.display_name}</span> - {currentPlaylist.tracks.total} songs</p>
				</div>
			</div>

			: (this.props.viewType === 'Artists' && typeof (currentArtist) !== 'undefined') ? 
			(<div>
				<div className={styles.current_artist_header_container}>
					<img className={styles.current_artist_image} src={typeof (currentArtist.images) !== 'undefined' ? currentArtist.images[0].url : ""} />
					<div className={styles.current_artist_info}>
						<h3>{currentArtist.name}</h3>
					</div>
				</div>
			</div>)

			: (this.props.viewType === 'Featured' && typeof (currentFeature) !== 'undefined' && currentFeature.length != 0) ? 
			(<div>
				<div className={styles.current_artist_header_container}>
					<img className={styles.current_artist_image} src={typeof (currentFeature.images) !== 'undefined' ? currentFeature.images[0].url : ""} />
					<div className={styles.current_artist_info}>
						<h3>{currentFeature.name}</h3>
					</div>
				</div>
			</div>)
			
			: (this.props.viewType === 'Albums' && typeof (currentAlbum) !== 'undefined') ? 
			(<div>
				<div className={styles.current_artist_header_container}>
					<img className={styles.current_artist_image} src={typeof (currentAlbum.album.images) !== 'undefined' ? currentAlbum.album.images[0].url : ""} />
					<div className={styles.current_artist_info}>
						<h3>{currentAlbum.album.name}</h3>
					</div>
				</div>
			</div>)

			: (this.props.viewType === 'New Releases' && typeof (currentRelease) !== 'undefined') ? 
			(<div>
				<div className={styles.current_artist_header_container}>
					<img className={styles.current_artist_image} src={typeof (currentRelease) !== 'undefined' ? currentRelease.images[0].url : ""} />
					<div className={styles.current_artist_info}>
						<h3>{currentRelease.name}</h3>
					</div>
				</div>
			</div>)
			
			:	

			this.props.headerTitle === 'Playlist' ||
			this.props.headerTitle === 'Recently Played' ||
			this.props.headerTitle === 'Albums' ||
			this.props.headerTitle === 'Artists' ?
				<div>
					<div className={styles.browse_headers}>
						<p className={styles.active} >{this.props.headerTitle}</p>
					</div>
				</div>
							
			:this.props.headerTitle === 'Browse' ?
				<div>
					<div className={styles.browse_headers}>
						<p className={this.props.viewType === 'Featured' ? styles.active : ''} onClick={() => { this.props.fetchFeatured(this.props.token); this.props.updateViewType('Featured'); this.props.updateHeaderTitle('Browse'); }}>Featured</p>
						<p className={this.props.viewType === 'New Releases' ? styles.active : ''} onClick={() => { this.props.fetchNewReleases(this.props.token); this.props.updateViewType('New Releases'); this.props.updateHeaderTitle('Browse'); }}>New Releases</p>
						<p className={this.props.viewType === 'Genres' ? styles.active : ''} onClick={() => { this.props.fetchCategories(this.props.token); this.props.updateViewType('Genres'); this.props.updateHeaderTitle('Browse'); }}>Genres</p>
					</div>
				</div>
			
			: "";

		return (

			<div>
				{display}
			</div>
		)
	}
}


export default MainHeader;
