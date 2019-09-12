import React from 'react';
//import PropTypes from 'prop-types';
import styles from './style.scss';
/* eslint react/prop-types: 0 */
class BrowseView extends React.Component {

  render(){
  let browseView;
  
  console.log("calling browser view >>>>>>>>>>>>>>>")
 // console.log(this.props.featured.length)

  if((this.props.featured && this.props.viewType === 'Featured' ) || 
     (this.props.newReleases && this.props.viewType === 'New Releases' )  || 
     (this.props.categories && this.props.viewType === 'Genres')) {
     let displayList = this.props.viewType === 'Featured' ?  this.props.featured : 
     this.props.viewType === 'New Releases' ?  this.props.newReleases :  this.props.categories;
    browseView = displayList.map((item, i) => {
      
      const getPlaylistSongs = () => {
        this.props.addPlaylistItem(item);
        this.props.fetchPlaylistSongs(item.owner.id, item.id, this.props.token);
        this.props.updateHeaderTitle(item.name);
      };

      return(
        <li onClick={this.props.viewType === 'Featured' ? getPlaylistSongs : null} className={styles.category_item} key={ i }>
          <div className={styles.category_image}>
            <img src={ item.icons ? item.icons[0].url : item.images[0].url} />
            {this.props.viewType === 'Genres' && (
              <p className={styles.category_name}>{ item.name }</p>
            )}
          </div>
        </li>
      );
    });
  }

  return (
    <ul className={styles.browse_view_container}>
      { browseView }
    </ul>
  );
  }
}


  export default BrowseView;
