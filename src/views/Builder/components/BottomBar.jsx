/**
 * Bottom bar that displays snapshots of the slides
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MdAddBox from 'react-icons/lib/md/add-box';
import Slide from './Slide';

import Panel from '../../../components/Panel';

import './BottomBar.scss';


class BottomBar extends PureComponent {
  render() {
    const {
      slides,
      onClick,
      onAdd,
      onDelete,
      mode,
      curSlideIndex
    } = this.props

    const slideSnapshots = slides.map((slide, i) =>
      <Slide
        key={i}
        src={slide.modes[mode].snapshot}
        onClick={onClick.bind(null, i)}
        onDelete={onDelete.bind(null, i)}
        mode={mode}
        isActive={i === curSlideIndex}
        />
    )

    return (
      <Panel disableDragging disableMinimize className="bottom_bar">
        <div className="bottom_bar_inner">
          { slideSnapshots }
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
  curSlideIndex: PropTypes.number,
  slides: PropTypes.array,
  onClick: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  mode: PropTypes.string,
};

BottomBar.defaultProps = {
  curSlideIndex: 0,
  slides: [],
  onClick: () => {},
  onAdd: () => {},
  onDelete: () => {}
};

export default BottomBar;
