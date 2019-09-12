import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
/* eslint react/prop-types: 0 */
class ArtWork extends React.Component {


  render() {

    return (
      <div className={styles.album_artwork_container}>
        <img className={styles.album_artwork} src={this.props.albumImage} />
      </div>
    );
  }
}

ArtWork.propTypes = {
  albumArtwork: PropTypes.string
};

export default ArtWork;
