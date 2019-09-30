import React from 'react';
import styles from './style.css';

class SideMenu extends React.Component {

	handleClick(name) {
		this.props.updateHeaderTitle(name);
		this.props.updateViewType(name);
	}

	getAction(event) {
		console.log("call get action")
		let menu_name = event.target.innerText;
		console.log("menu_name  :" + menu_name)
		if (menu_name == 'Recently Played') {
			this.props.fetchRecentlyPlayed(this.props.token);
		}
		if (menu_name == 'Playlist') {
			this.props.fetchSongs(this.props.token);
		}
		if (menu_name == 'Albums') {
			this.props.fetchAlbums(this.props.token);
		}
		if (menu_name == 'Artists') {
			this.props.fetchArtists(this.props.token, this.props.artistIds)
		}
		this.handleClick(menu_name);
	}

	renderSideMenu() {
		let menu = [];
		menu = [
			{
				name: 'Playlist',
				action: this.props.fetchSongs
			},
			{
				name: 'Albums',
				action: this.props.fetchAlbums
			},
			{
				name: 'Artists',
				action: this.props.fetchArtists,
				getArtists: true
			},
			{
				name: 'Recently Played',
				action: this.props.fetchRecentlyPlayed
			}
		];
		return menu.map(item => {
			return (
				<li key={item.name}
					className={this.props.title === item.name ? styles.side_menu_item_active : styles.side_menu_item}
					onClick={(e) => { this.getAction(e) }}>
					{item.name}
				</li>
			);
		});
	}
	
	render() {
		return (
			<ul className={styles.side_menu_container}>
				<li onClick={this.props.handleBrowseClick} className={this.props.title === 'Browse' ? styles.side_menu_item_active : styles.side_menu_item}>Browse</li>
				{
					this.renderSideMenu()
				}
			</ul>
		);
	}
}

export default SideMenu;
