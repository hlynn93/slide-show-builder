import React from 'react';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';

const DraggableImage = ({
  onStart,
  onDrag,
  onStop,
  grid,
  defaultPosition,
  bounds,
  ...props
}) => {
  return (
    <Draggable
      defaultPosition={defaultPosition}
      grid={grid}
      bounds={bounds}
      onStart={onStart}
      onDrag={onDrag}
      onStop={onStop}>
      <img {...props} draggable={false} />
    </Draggable>
  );
};

DraggableImage.propTypes = {
  onClick: PropTypes.func,
  onStart: PropTypes.func,
  onDrag: PropTypes.func,
  onStop: PropTypes.func,
  grid: PropTypes.array,
  defaultPosition: PropTypes.object,
  bounds: PropTypes.string,
};

DraggableImage.defaultProps = {
  defaultPosition: {x: 0, y: 0},
  position: null
};

export default DraggableImage;
