import React from 'react';
//import PropTypes from 'prop-types';
import styles from './style.scss';

import SongControls from '../SongControls/SongControls';
import VolumeControls from '../VolumeControls/VolumeControls';

/* eslint react/prop-types: 0 */
class Footer extends React.Component {

  render() {
    return (
      <div className={styles.footer}>
        <SongControls
          audioControl={this.props.audioControl}
          stopSong={this.props.stopSong}
          pauseSong={this.props.pauseSong}
          playSong={this.props.playSong}
          resumeSong={this.props.resumeSong}
          timeElapsed={this.props.timeElapsed}
          songName={this.props.songName}
          artistName={this.props.artistName}
          increaseSongTime={this.props.increaseSongTime}
          songs={this.props.songs}
          song={this.props.song}
          songPlaying={this.props.songPlaying}
          songPaused={this.props.songPaused}
          songDetails={this.props.songDetails}
          volume={this.props.volume}
          updateVolume={this.props.updateVolume}
          lyrics={this.props.lyrics}
          getLyrics={this.props.getLyrics}
        />
        <VolumeControls
          volume={this.props.volume}
          updateVolume={this.props.updateVolume}
          songName={this.props.songName}
          artistName={this.props.artistName}
        />
      </div>
    );
  }
}


export default Footer;
