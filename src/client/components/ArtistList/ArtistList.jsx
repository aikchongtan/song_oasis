import React from 'react';
import styles from './style.scss';
class ArtistList extends React.Component {

	renderArtists() {
		return this.props.artists.map((artist, i) => {

			const artistSongsAction = (artist, token) => {
				this.props.fetchArtistSongs(artist.id, token);
				this.props.updateHeaderTitle(artist.name);
			};

			return (
				<li onClick={() => { artistSongsAction(artist, this.props.token); }} className={styles.artist_item} key={i}>
					<a>
						<div>
							<div className={styles.artist_image}>
								<img src={artist.images[0] ? artist.images[0].url : ''} />
							</div>
							<div className={styles.artist_details}>
								<p>{artist.name}</p>
							</div>
						</div>
					</a>
				</li>
			);
		});
	}
	render() {
		return (
			<ul className={styles.artist_view_container} >
				{
					(this.props.artists) ? this.renderArtists() : ""
				}
			</ul >
		);
	}
}

export default ArtistList;
