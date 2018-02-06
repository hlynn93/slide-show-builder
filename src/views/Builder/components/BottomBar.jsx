import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './BottomBar.scss';

class BottomBar extends PureComponent {
  render() {
    const { snapshots } = this.props
    return (
      <div className="bottom-bar">
        {
          Object.keys(snapshots).map(key => (
            <img
              key={key}
              src={snapshots[key]}
              width="100" height="100"
              className="slide_snapshot"
              />
          ))
        }
      </div>
    );
  }
}

BottomBar.propTypes = {
  currentSlide: PropTypes.number,
  snapshots: PropTypes.object,
};

export default BottomBar;
