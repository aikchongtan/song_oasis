import React from 'react';
//import PropTypes from 'prop-types';
import styles from './style.scss';
/* eslint react/prop-types: 0 */
class AlbumList extends React.Component {

  renderAlbums() {
   
    return this.props.songs.map((song, i) => {
      return (

        <li
          onClick={() => { this.props.audioControl(song); }}
          className={styles.album_item}
          key={i} >
          <div>
              <div className={styles.album_image}>
              <img src={song.track.album.images[0].url} />
              <div className={styles.play_song}>
                <i className="fa fa-play-circle-o play-btn" aria-hidden="true" />
              </div>
            </div>
        
            <div className={styles.album_details}>
              <p className={styles.album_name}>{song.track.album.name}</p>
              <p className={styles.artist_name}>{song.track.album.artists[0].name}</p>
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
