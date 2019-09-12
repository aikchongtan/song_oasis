import React from 'react';
//import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './style.scss';
import axios from 'axios';
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

/* eslint react/prop-types: 0 */
class SongList extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.token !== '' && !nextProps.fetchSongsError && nextProps.fetchSongsPending && nextProps.viewType === 'songs') {
      this.props.fetchSongs(nextProps.token);
    }
  }

  msToMinutesAndSeconds(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }
  audioControl(song) {
    if (this.audio === undefined) {
      this.audio = new Audio();
      this.props.audioControl(song, this.audio, 1)
    } else {
      this.props.audioControl(song, this.audio, 0)
    }
  }

  pauseSong() {
    this.props.pauseSong(1, this.audio);
  }

  resumeSong() {
    this.props.pauseSong(0, this.audio);
  }


  renderSongs() {

    return this.props.songs.map((song, i) => {
      const buttonClass = song.track.id === this.props.songId && !this.props.songPaused ? "fa fa-pause-circle-o play-btn" : "fa fa-play-circle-o play-btn";

      console.log("------------------------------------------")
      console.log(song.track.id)
      console.log(this.props.songId)
      console.log(this.props.songPlaying)
      console.log(this.props.songPaused)
      console.log("1-resume")
      console.log("(song.track.id === this.props.songId) && this.props.songPlaying && this.props.songPaused ")

      console.log((song.track.id === this.props.songId) && this.props.songPlaying && this.props.songPaused)

      console.log("2-pause")
      console.log("this.props.songPlaying && !this.props.songPaused && (song.track.id === this.props.songId) ")

      console.log(this.props.songPlaying && !this.props.songPaused && (song.track.id === this.props.songId))
      let className = ((song.track.id === this.props.songId) && !this.props.songPaused) ? styles.active_user_song_item : styles.user_song_item;

      return (

        <li className={className} key={i}>
          <div onClick={() => {
            (song.track.id === this.props.songId && this.props.songPlaying && this.props.songPaused) ? this.resumeSong() :
              (this.props.songPlaying && !this.props.songPaused && song.track.id === this.props.songId) ? this.pauseSong() :
                this.audioControl(song);
          }} className={styles.play_song}>
            <i className={buttonClass} aria-hidden="true" />
          </div>

          {
            this.props.viewType !== 'songs' ? (
              <p className={styles.add_song} onClick={() => { this.props.addSongToLibrary(this.props.token, song.track.id); }}>
                {this.props.songAddedId === song.track.id ?
                  (<i className="fa fa-check add_song" aria-hidden="true" />) :
                  (<i className="fa fa-plus add_song" aria-hidden="true" />)
                }
              </p>
            ) : (
                <p className={styles.add_song}>
                  <i className="fa fa-check" aria-hidden="true" />
                </p>
              )
          }

          < div className={styles.song_title}>
            <p>{song.track.name}</p>
          </div>

          <div className={styles.song_artist}>
            <p>{song.track.artists[0].name}</p>
          </div>

          <div className={styles.song_album}>
            <p>{song.track.album.name}</p>
          </div>

          <div className={styles.song_added}>
            <p>{moment(song.added_at).format('YYYY-MM-DD')}</p>
          </div>

          <div className={styles.song_length}>
            <p>{this.msToMinutesAndSeconds(song.track.duration_ms)}</p>
          </div>
        </li >
      );
    });
  }

  render() {
    console.log("calling SongList---------------------")
    console.log("this.props.songs  ::" + this.props.songs)
    console.log("this.props.fetchSongsPending  ::" + this.props.fetchSongsPending)
    console.log("this.props.fetchPlaylistSongsPending  ::" + this.props.fetchPlaylistSongsPending)

    return (
      <div>
        <div className={styles.song_header_container}>
          <div className={styles.song_title_header}>
            <p>Title</p>
          </div>
          <div className={styles.song_artist_header}>
            <p>Artist</p>
          </div>
          <div className={styles.song_album_header}>
            <p>Album</p>
          </div>
          <div className={styles.song_added_header}>
            <i className="fa fa-calendar-plus-o" aria-hidden="true" />
          </div>
          <div className={styles.song_length_header}>
            <p><i className="fa fa-clock-o" aria-hidden="true" /></p>
          </div>
        </div>
        {
          (this.props.songs
            && !this.props.fetchSongsPending
            && !this.props.fetchPlaylistSongsPending) ? this.renderSongs() : ""
        }

      </div>
    );
  }
}


export default SongList;
