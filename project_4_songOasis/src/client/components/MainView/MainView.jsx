import React from 'react';
//import PropTypes from 'prop-types';
//import styles from './style.scss';

/* eslint react/prop-types: 0 */

import AlbumList from '../AlbumList/AlbumList';
import ArtistList from '../ArtistList/ArtistList';
import BrowseView from '../BrowseView/BrowseView';
import SongList from '../SongList/SongList';
import Lyrics from '../Lyrics/Lyrics';
class MainView extends React.Component {

  render() {
    console.log("MainView - this.props.headerTitle  ::" + this.props.headerTitle);
    return (
      <div>
        <div>
          {
            this.props.headerTitle === 'Albums' ?
              (<AlbumList
                audioControl={this.props.audioControl}
                songs={this.props.songs}
              />) :
              this.props.headerTitle === 'Artists' ?
                (<ArtistList
                  artists={this.props.artists}
                  fetchArtistSongs={this.props.fetchArtistSongs}
                  updateHeaderTitle={this.props.updateHeaderTitle}
                  token={this.props.token}
                />) :
                (this.props.headerTitle === 'Browse') ?
                  (<BrowseView
                    featured={this.props.featured}
                    newReleases={this.props.newReleases}
                    categories={this.props.categories}
                    viewType={this.props.viewType}

                  />) :
                  //anything else show SongList
                  (<SongList
                    resumeSong={this.props.resumeSong}
                    pauseSong={this.props.pauseSong}
                    playSong={this.props.playSong}
                    stopSong={this.props.stopSong}
                    isPauseSong={this.props.pauseSong}
                    isResumeSong={this.props.resumeSong}
                    isSstopSong={this.props.stopSong}
                    isPlaySong={this.props.playSong}
                    songs={this.props.songs}
                    songId={this.props.songId}
                    songPaused={this.props.songPaused}
                    songPlaying={this.props.songPlaying}
                    songDetails={this.props.songDetails}
                    timeElapsed={this.props.timeElapsed}
                    audioControl={this.props.audioControl}
                    fetchSongsPending={this.props.fetchSongsPending}
                    fetchPlaylistSongsPending={this.props.fetchPlaylistSongsPending}
                    getLyrics={this.props.getLyrics}
                    lyrics={this.props.lyrics}

                    addSongToLibrary={this.props.addSongToLibrary}
                  />)

          }
        </div>
      </div>

    );


  }
}


export default MainView;
