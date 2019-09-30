import React from 'react';
import AlbumList from '../AlbumList/AlbumList';
import ArtistList from '../ArtistList/ArtistList';
import BrowseView from '../BrowseView/BrowseView';
import SongList from '../SongList/SongList';

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
								albums={this.props.albums}
								songs={this.props.songs}
								updateHeaderTitle={this.props.updateHeaderTitle}
								updateSongList={this.props.updateSongList}
							/>) 

						: this.props.headerTitle === 'Artists' ?
							(<ArtistList
								artists={this.props.artists}
								fetchArtistSongs={this.props.fetchArtistSongs}
								updateHeaderTitle={this.props.updateHeaderTitle}
								token={this.props.token}
							/>) 

						: (this.props.headerTitle === 'Browse') ?
							(<BrowseView
								featured={this.props.featured}
								newReleases={this.props.newReleases}
								categories={this.props.categories}
								viewType={this.props.viewType}
								token={this.props.token}
								fetchPlaylistSongs={this.props.fetchPlaylistSongs}
								fetchCategorySongs={this.props.fetchCategorySongs}
								fetchNewReleaseSongs={this.props.fetchNewReleaseSongs}
								updateHeaderTitle={this.props.updateHeaderTitle}
							/>) 
						: 
							(<SongList
								resumeSong={this.props.resumeSong}
								pauseSong={this.props.pauseSong}
								playSong={this.props.playSong}
								stopSong={this.props.stopSong}
								songs={this.props.songs}
								songId={this.props.songId}
								songPaused={this.props.songPaused}
								songPlaying={this.props.songPlaying}
								songDetails={this.props.songDetails}
								timeElapsed={this.props.timeElapsed}
								audioControl={this.props.audioControl}
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
