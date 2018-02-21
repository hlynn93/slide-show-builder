import React from 'react';
import PropTypes from 'prop-types';
import { ASPECT_RATIO } from '../../../constants/appConstants';
import cx from 'classnames';

import './Slide.scss'

const calculateWidth = ( mode ) => (ASPECT_RATIO[mode].width / ASPECT_RATIO[mode].height) * 88;

const Slide = ({
  src,
  onClick,
  onDelete,
  mode,
  isActive,
}) => {

  const baseClass = "snapshot"
  const classes = cx(
    baseClass,
    { [`${baseClass}--active`]: isActive }
  )

  return (
    <div
      className={classes}
      style={src ? undefined : { width: calculateWidth(mode) }}
      >
      {
        src &&
        <img
          src={src}
          className='snapshot_image'
          onClick={onClick}
          />
      }
      <span
        onClick={onDelete}
        className='snapshot_delete'
        >x</span>
    </div>
  );
};

Slide.propTypes = {
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  mode: PropTypes.string,
  isActive: PropTypes.bool,
  src: PropTypes.any,
};

export default Slide;
