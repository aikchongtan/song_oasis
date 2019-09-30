import React from 'react';
import styles from './style.scss';
import moment from 'moment';
class SongControls extends React.Component {

	constructor() {
		super();
		this.state = {
			intervalId: 0
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.songPlaying) {
			clearInterval(this.state.intervalId);
		}
		if (nextProps.songPlaying && nextProps.timeElapsed === 0) {
			clearInterval(this.state.intervalId);
			this.calculateTime();
		}
		this.setState({
			timeElapsed: nextProps.timeElapsed
		});
	}

	calculateTime() {
		const intervalId = setInterval(() => {
			if (this.props.timeElapsed === 30) {
				clearInterval(this.state.intervalId);
				this.props.stopSong();
			} else if (!this.props.songPaused) {
				this.props.increaseSongTime(this.props.timeElapsed + 1);
			}
		}, 1000);

		this.setState({
			intervalId: intervalId
		});
	}

	getSongIndex() {

		if (this.props.songs) {
			const currentIndex = this.props.songs.map((song, index) => {
				if (song.track === this.props.songDetails) {
					return index;
				}
			}).filter(item => {
				return item !== undefined;
			})[0];

			return currentIndex;
		}

	}

	nextSong() {
		if (this.props.song) {
			let currentIndex = this.getSongIndex();
			currentIndex === this.props.songs.length - 1 ? this.props.audioControl(this.props.songs[0]) : this.props.audioControl(this.props.songs[currentIndex + 1]);
		}
	}

	pauseSong() {
		if (this.audio === undefined) {
			this.audio = new Audio();
			this.audio.src = this.props.song.preview_url;
		}
		this.props.pauseSong(1, this.audio);
	}

	resumeSong() {
		if (this.audio === undefined) {
			this.audio = new Audio();
		}
		this.props.pauseSong(0, this.audio);
	}

	prevSong() {
		if (this.props.song) {
			let currentIndex = this.getSongIndex();
			currentIndex === 0 ? this.props.audioControl(this.props.songs[this.props.songs.length - 1]) : this.props.audioControl(this.props.songs[currentIndex - 1]);
		}
	}

	render() {

		const showPlay = this.props.songPaused ? 'fa fa-play-circle-o play_btn' : 'fa fa-pause-circle-o pause_btn';

		return (
			<div className={styles.song_player_container}>
				<div className={styles.album_artwork_container}>
					<img className={styles.album_artwork} src={this.props.albumImage} />
				</div>

				<div className={styles.song_details}>
					<p className={styles.song_name}>{this.props.songName}</p>
					<p className={styles.artist_name}>{this.props.artistName}</p>
				</div>

				<div className={styles.song_controls}>
					<div onClick={this.prevSong.bind(this)} className={styles.reverse_song}>
						<i className="fa fa-step-backward reverse" aria-hidden="true" />&nbsp;&nbsp;
          			</div>

					<div className={styles.play_btn}>
						<i onClick={!this.props.songPaused ? this.pauseSong.bind(this) : this.resumeSong.bind(this)} className={"fa play_btn" + showPlay} aria-hidden="true" />
					</div>

					<div onClick={this.nextSong.bind(this)} className={styles.next_song}>
						&nbsp;&nbsp;<i className="fa fa-step-forward forward" aria-hidden="true" />
					</div>
				</div>

				<div className={styles.song_progress_container}>
					<p className={styles.timer_start}>{moment().minutes(0).second(this.props.timeElapsed).format('m:ss')}</p>
					<div className={styles.song_progress}>
						<div style={{ width: this.props.timeElapsed * 16.5 }} className={styles.song_expired} />
					</div>
					<p className={styles.timer_end}>{moment().minutes(0).second(30 - this.props.timeElapsed).format('m:ss')}</p>
				</div>

			</div>
		);
	}
}

export default SongControls;
