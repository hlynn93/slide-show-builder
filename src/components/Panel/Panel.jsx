import React from 'react';
import Rnd from 'react-rnd';
import PropTypes from 'prop-types';

const Panel = ({
  onDrag,
  onDragStart,
  onDragStop,
  disableDragging,
  children,
  ...props,
}) => {
  return (
    <Rnd
      bounds={'.builder'}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      disableDragging={disableDragging}
      enableResizing={false}
      {...props}
      >
      {children}
    </Rnd>
  );
};

Panel.propTypes = {
  onDrag: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragStop: PropTypes.func,
  disableDragging: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
};

Panel.defaultProps = {
  disableDragging: false,
}

export default Panel;
