import React from 'react';
//import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './style.scss';


/* eslint react/prop-types: 0 */
class TrackSearch extends React.Component {
  updateSearchTerm(e) {
    this.setState({
      searchTerm: e.target.value
    });
  }

  render() {
    return (
      <div className={styles.track_search_container}>
        <form onSubmit={() => { this.props.searchSongs(this.state.searchTerm, this.props.token); }}>
          <input onChange={this.updateSearchTerm} type='text' placeholder='Search...' />
          <button onClick={(e) => { e.preventDefault(); this.props.searchSongs(this.state.searchTerm, this.props.token); }}>
            <i className="fa fa-search search" aria-hidden="true" />
          </button>
        </form>
      </div>
    );
  }
}


export default TrackSearch;
