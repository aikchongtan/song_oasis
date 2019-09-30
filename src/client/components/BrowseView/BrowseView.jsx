import React from 'react';
import styles from './style.scss';
class BrowseView extends React.Component {

	render() {
		let browseView;

		if ((this.props.featured && this.props.viewType === 'Featured') ||
			(this.props.newReleases && this.props.viewType === 'New Releases') ||
			(this.props.categories && this.props.viewType === 'Genres')) {
			let displayList = this.props.viewType === 'Featured' ? this.props.featured :
				this.props.viewType === 'New Releases' ? this.props.newReleases : this.props.categories;
			browseView = displayList.map((item, i) => {

				const getPlaylistSongs = () => {
					this.props.viewType === 'Featured' ? this.props.fetchPlaylistSongs("", item.id, this.props.token)
						: this.props.viewType === 'Genres' ? this.props.fetchCategorySongs(item.id, this.props.token)
							: this.props.viewType === 'New Releases' ? this.props.fetchNewReleaseSongs(item, this.props.token)
								: "";
					this.props.updateHeaderTitle(item.name);
				};

				return (
					<li onClick={this.props.viewType === 'Featured' || this.props.viewType === 'New Releases' ? getPlaylistSongs : null} className={styles.category_item} key={i}>
						<div className={styles.category_image}>
							<img src={item.icons ? item.icons[0].url : item.images[0].url} />
							{this.props.viewType === 'Genres' && (
								<p className={styles.category_name}>{item.name}</p>
							)}
						</div>
					</li>
				);
			});
		}

		return (
			<ul className={styles.browse_view_container}>
				{browseView}
			</ul>
		);
	}
}

export default BrowseView;
