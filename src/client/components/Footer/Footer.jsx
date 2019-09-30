import React from 'react';
import styles from './style.scss';
import SongControls from '../SongControls/SongControls';
import VolumeControls from '../VolumeControls/VolumeControls';
import  bgImage  from '../../../public/footerbanner.png'

class Footer extends React.Component {

	render() {
		var bgStyle = {
            backgroundImage: 'url(' + bgImage + ') ',
            backgroundRepeat  : 'repeat-y',
            backgroundPosition: 'center top',
            backgroundColor: '#000',
		};
		
		return (
			<div className={styles.footer} style={bgStyle}>
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
					albumImage={this.props.albumImage}
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
