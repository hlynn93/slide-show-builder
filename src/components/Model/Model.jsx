import React from 'react';
import PropTypes from 'prop-types';

// Work in progress
const Model = ({
  onClose,
  onOpen,
  isVisible,
  children,
  ...props
}) => {
  return (
    <div
      onClose={onClose}
      onOpen={onOpen}
      isVisible={isVisible}
      {...props}>
      {children}
    </div>
  );
};

Model.propTypes = {
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  isVisible: PropTypes.bool,
  children: PropTypes.oneOf([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default Model;
