/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import axios from 'axios';

class Lyrics extends React.Component {

  render() {
    console.log("Song ..... " + this.props.song)
    return (
      <div className={styles.lyric_header_container}>
        {
          this.props.lyrics != "" ?
            (<i>Lyrics&nbsp; ~~~ &nbsp;&nbsp;{this.props.lyrics}</i>) : ""
        }
      </div>
    )
  }
}

export default Lyrics;
