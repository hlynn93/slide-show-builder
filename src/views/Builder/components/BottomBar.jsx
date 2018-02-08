import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MdAddBox from 'react-icons/lib/md/add-box';

import Panel from '../../../components/Panel';

import './BottomBar.scss';

class BottomBar extends PureComponent {
  render() {
    const { slides, onClick, onAdd } = this.props

    const slideSnapshot = slides.map((slide, i) => (
      <img
        key={i}
        src={slide.snapshot}
        className="slide_snapshot"
        onClick={onClick.bind(null, i)}
        />
    ))

    return (
      <Panel disableDragging className="bottom_bar">
        <div className="bottom_bar_inner">
          { slideSnapshot }
          <div className="new_slide">
            <MdAddBox
              className="new_slide_icon"
              onClick={onAdd.bind(null, slides.length)}
              />
          </div>
        </div>
      </Panel>
    );
  }
}

BottomBar.propTypes = {
  currentSlide: PropTypes.number,
  slides: PropTypes.array,
  onClick: PropTypes.func,
  onAdd: PropTypes.func,
};

BottomBar.defaultProps = {
  currentSlide: 0,
  slides: [],
  onClick: () => {},
  onAdd: () => {}
};

export default BottomBar;
