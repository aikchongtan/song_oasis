import React from 'react';
import styles from './style.scss';

class VolumeControls extends React.Component {

	render() {

		return (
			<div className={styles.volume_container}>
				<i className="fa fa-volume-up" aria-hidden="true" />&nbsp;
        		<input className={styles.volume} type="range" min={0} max={1} step={0.01} value={this.props.volume} onChange={this.props.updateVolume} />
			</div>
		);
	}
}

export default VolumeControls;
