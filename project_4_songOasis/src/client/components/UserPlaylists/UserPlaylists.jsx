import React from 'react';
//import PropTypes from 'prop-types';
import styles from './style.scss';
import SideMenu from '../SideMenu/style.css';

/* eslint react/prop-types: 0 */
class UserPlaylists extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.userId !== '' && nextProps.token !== '') {
      this.props.fetchPlaylistsMenu(nextProps.userId, nextProps.token);
    }
  }

  renderPlaylists() {
    return this.props.playlistMenu.map(playlist => {
      const getPlaylistSongs = () => {
        this.props.fetchPlaylistSongs(playlist.owner.id, playlist.id, this.props.token);
        this.props.updateHeaderTitle(playlist.name);
      };

      return (
        <li onClick={getPlaylistSongs} className={this.props.title === playlist.name ? [styles.active, SideMenu.side_menu_item] : SideMenu.side_menu_item} key={playlist.id}>
          {playlist.name}
        </li>
      );
    });
  }

  render() {

    return (
      <div className={styles.user_playlist_container}>
        <h3 className={styles.user_playlist_header}>Playlists</h3>
        {
          this.props.playlistMenu && this.props.renderPlaylists()
        }
      </div>
    );
  }
}

export default UserPlaylists;
