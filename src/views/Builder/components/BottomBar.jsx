import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './BottomBar.scss';

class BottomBar extends PureComponent {
  render() {
    const { slides } = this.props
    return (
      <div className="bottom-bar">
        {
          Object.keys(slides).map(key => (
            <img
              key={key}
              src={slides[key].snapshot}
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
  slides: PropTypes.object,
};

export default BottomBar;
