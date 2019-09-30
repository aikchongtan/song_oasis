import React from 'react';
import styles from './style.scss';

class Lyrics extends React.Component {

	render() {
		return (
			<div className={styles.lyric_header_container}>
				{
					this.props.lyrics != "" ?
						((this.props.viewType != "Playlist" && this.props.viewType != 'Recently Played') ?
							<i><br /><br /><br /><br /><br /><p className={styles.lyric_header}>Lyrics&nbsp; ~~~ </p><br />{this.props.lyrics}</i>
							: <i><p className={styles.lyric_header}>Lyrics&nbsp; ~~~ </p><br />{this.props.lyrics}</i>
						)
						: ""
				}
			</div>
		)
	}
}

export default Lyrics;
