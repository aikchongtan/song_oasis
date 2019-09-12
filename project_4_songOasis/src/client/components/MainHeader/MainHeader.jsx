import React from 'react';
//import PropTypes from 'prop-types';
import styles from './style.scss';
import SongList from '../SongList/style.scss';
/* eslint react/prop-types: 0 */
class MainHeader extends React.Component {

  render() {

    let currentArtist = [];
    let currentPlaylist = [];

    //this.loadMainHeader();
    console.log("calling MainHeader-----------------")
    console.log("this.props.viewType ::" + this.props.viewType)
    console.log("this.props.artists ::" + this.props.artists)
    console.log("this.props.artists.length ::" + this.props.artists.length)
    console.log("this.props.headerTitle ::" + this.props.headerTitle)

    if (this.props.viewType === 'playlist') {

      currentPlaylist = this.props.playlists.filter(playlist => {
        return playlist.name === this.props.headerTitle;
      })[0];
      //this.setState({currentPlaylist: playlists})
    }

    if (this.props.viewType === 'Artists' && this.props.artists) {
      console.log("this.props.viewType === 'Artists' && this.props.artists.length > 0")

      currentArtist = this.props.artists.filter(artist => {
        return artist.name === this.props.headerTitle;
      })[0];
      // currentArtist = this.props.artists;
      console.log("currentArtist  >>>>>>>>>>>" + currentArtist)
      //this.setState({currentArtist: artists})
    }

    let display =
      this.props.viewType === 'playlist' ?
        <div className={styles.playlist_title_container}>
          playlist_main header
        <div className={styles.playlist_image_container}>
            <img className={styles.playlist_image} src={currentPlaylist.images[0] ? currentPlaylist.images[0].url : null} />
          </div>
          <div className={styles.playlist_info_container}>
            <p className={styles.playlist_text}>PLAYLIST</p>
            <h3 className={styles.header_title}>{this.props.headerTitle}</h3>
            <p className={styles.created_by}>Created By: <span className={styles.lighter_text}>{currentPlaylist.owner.display_name}</span> - {currentPlaylist.tracks.total} songs</p>
            {/* <button
              onClick={!this.props.songPaused ? this.props.pauseSong : this.props.resumeSong}
              className={SongList.main_pause_play_btn}>
              {this.props.songPaused ? 'PLAY' : 'PAUSE'}
            </button> */}

          </div>
        </div>
        : (this.props.viewType === 'Artists' && typeof (currentArtist) !== 'undefined') ?
          (<div>
            <div className={styles.current_artist_header_container}>
              Artist-main header
<img className={styles.current_artist_image} src={typeof (currentArtist.images) !== 'undefined' ? currentArtist.images[0].url : ""} />
              <div className={styles.current_artist_info}>
                <p>Artist from your library</p>
                <h3>{currentArtist.name}</h3>
              </div>
            </div>
            {/* <button
              onClick={!this.props.songPaused ? this.props.pauseSong : this.props.resumeSong}
              className={[SongList.main_pause_play_btn, styles.artist_button]}>
              {this.props.songPaused ? 'PLAY' : 'PAUSE'}
            </button> */}
          </div>)
          :


          this.props.headerTitle === 'Songs' ||
            this.props.headerTitle === 'Recently Played' ||
            this.props.headerTitle === 'Albums' ||
            this.props.headerTitle === 'Artists' ?

            <div>

              <h3 className={styles.header_title}>{this.props.headerTitle}</h3>
              {/* {this.props.headerTitle !== 'Artists' && (
                <button
                  onClick={!this.props.songPaused ? this.props.pauseSong : this.props.resumeSong}
                  className={SongList.main_pause_play_btn}>
                  {this.props.songPaused ? 'PLAY' : 'PAUSE'}
                </button>
              )} */}

            </div>
            :
            this.props.headerTitle === 'Browse' ?
              <div>
                <h3 className={styles.header_title}>{this.props.headerTitle}</h3>
                <div className={styles.browse_headers}>
                  <p className={this.props.viewType === 'Genres' ? styles.active : ''} onClick={() => { this.props.fetchCategories(this.props.token); this.props.updateViewType('Genres'); this.props.updateHeaderTitle('Browse'); }}>Genres</p>
                  <p className={this.props.viewType === 'New Releases' ? styles.active : ''} onClick={() => { this.props.fetchNewReleases(this.props.token); this.props.updateViewType('New Releases'); this.props.updateHeaderTitle('Browse'); }}>New Releases</p>
                  <p className={this.props.viewType === 'Featured' ? styles.active : ''} onClick={() => { this.props.fetchFeatured(this.props.token); this.props.updateViewType('Featured'); this.props.updateHeaderTitle('Browse'); }}>Featured</p>
                </div>
              </div>
              : "";



    return (

      <div>
        {display}
      </div>
    )
  }
}


export default MainHeader;
