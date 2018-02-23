/**
 * Draggable and Resizable Image
 */
import React from 'react';
import withDNR from './withDNR';
import PropTypes from 'prop-types';
import './DNR.scss';

const Image = ({
  ...props
}) => {

  return <img
    {...props}
    className={"canvas_image"}
    draggable={false}
    />
}

Image.propTypes = {
  isActive: PropTypes.bool,
  className: PropTypes.string,
}

export default withDNR(Image)
