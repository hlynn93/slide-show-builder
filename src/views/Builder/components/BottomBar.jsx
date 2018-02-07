import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './BottomBar.scss';

class BottomBar extends PureComponent {
  render() {
    const { slides } = this.props
    return (
      <div className="bottom-bar">
        {
          slides.map((slide, i) => (
            <img
              key={i}
              src={slide.snapshot}
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
  slides: PropTypes.array,
};

BottomBar.defaultProps = {
  currentSlide: 0,
  slides: [],
};

export default BottomBar;
