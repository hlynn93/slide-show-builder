/**
 * Draggable and Resizable Image
 */
import React from 'react';
import objectify from './objectify';
import PropTypes from 'prop-types';
import './CanvasObject.scss';

/* eslint-disable */
const Image = ({
  isActive,
  ...props
}) => (
  <img
    {...props}
    className={"canvas_image"}
    draggable={false}
    />
)

Image.propTypes = {
  isActive: PropTypes.bool,
  className: PropTypes.string,
}

export default objectify(Image)
