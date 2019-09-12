import React from 'react';
//import PropTypes from 'prop-types';
import styles from './style.scss';
import moment from 'moment';
/* eslint react/prop-types: 0 */
class VolumeControls extends React.Component {


  updateVolume(e) {
    this.props.updateVolume(Math.ceil(e.target.value / 10) * 10);
  }


  render() {

    return (
      <div className={styles.volume_container}>
        <i className="fa fa-volume-up" aria-hidden="true" />&nbsp;
        <input className={styles.volume} type="range" min={0} max={100} value={this.props.volume} onChange={this.updateVolume} />
      </div>
    );

  }
}



export default VolumeControls;
