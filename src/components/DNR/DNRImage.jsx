/**
 * Draggable and Resizable Image
 */
import React from 'react';
import withDNR from './withDNR';
import cx from 'classnames';
import PropTypes from 'prop-types';

const Image = ({
  className,
  isActive,
  ...props
}) => {
  const classes = cx(
    className,
    { 'active': isActive }
  )
  return <img
    {...props}
    className={classes}
    draggable={false}
    />
}

Image.propTypes = {
  isActive: PropTypes.bool,
  className: PropTypes.string,
}

export default withDNR(Image)
