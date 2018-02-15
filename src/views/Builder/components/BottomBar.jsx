/**
 * Bottom bar that displays snapshots of the slides
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MdAddBox from 'react-icons/lib/md/add-box';
import { ASPECT_RATIO } from '../../../constants/appConstants';
import cx from 'classnames';

import Panel from '../../../components/Panel';

import './BottomBar.scss';

const calculateWidth = ( mode ) => (ASPECT_RATIO[mode].width / ASPECT_RATIO[mode].height) * 88;

class BottomBar extends PureComponent {
  render() {
    const {
      slides,
      onClick,
      onAdd,
      mode,
      currentSlide
    } = this.props

    const baseClass = 'slide_snapshot'

    /**
     * Create a snapshot image if the value exists
     * Otherwise, create a div placeholder
     */
    const slideSnapshots = slides.map((slide, i) =>
    React.createElement(
      slide.modes[mode].snapshot ? 'img' : 'div',
      {
        key: i,
        src: slide.modes[mode].snapshot,
        className: cx(
          baseClass,
          { [`${baseClass}--active`]:  i === currentSlide }
        ),
        onClick: onClick.bind(null, i),
        style: slide.modes[mode].snapshot ? undefined : { width: calculateWidth(mode) }
      }
    ))

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
  currentSlide: PropTypes.number,
  slides: PropTypes.array,
  onClick: PropTypes.func,
  onAdd: PropTypes.func,
  mode: PropTypes.string,
};

BottomBar.defaultProps = {
  currentSlide: 0,
  slides: [],
  onClick: () => {},
  onAdd: () => {},
};

export default BottomBar;
