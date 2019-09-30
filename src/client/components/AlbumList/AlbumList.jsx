import React from 'react';
import styles from './style.scss';
class AlbumList extends React.Component {

	bindSongList(album)
	{
		let songs = album.tracks.items.map(item => {
			item.oneAlbum = album
			return {
				track: item
			}
		});
		this.props.updateSongList(songs);
		this.props.updateHeaderTitle(album.name);
	}

	renderAlbums() {
		return this.props.albums.map((item, i) => {
			return (

				<li
					onClick={() => { this.bindSongList(item.album); }}
					className={styles.album_item}
					key={i} >
					<div>
						<div className={styles.album_image}>
							<img src={item.album.images[0].url} />
							<div className={styles.play_song}>
								<i className="fa fa-play-circle-o play-btn" aria-hidden="true" />
							</div>
						</div>

						<div className={styles.album_details}>
							<p className={styles.album_name}>{item.album.name}</p>
							<p className={styles.artist_name}>{item.album.artists[0].name}</p>
						</div>
					</div>
				</li>
			);
		});
	}

	render() {
		return (
			<ul className={styles.album_view_container} >{this.renderAlbums()}</ul>
		);
	}
}

export default AlbumList;
