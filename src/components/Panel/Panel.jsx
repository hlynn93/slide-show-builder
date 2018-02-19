import React from 'react';
import Rnd from 'react-rnd';
import PropTypes from 'prop-types';

import './Panel.scss';

const Panel = ({
  position,
  onDrag,
  onDragStart,
  onDragStop,
  disableDragging,
  disableMinimize,
  onToggle,
  minimize,
  children,
  ...props,
}) => {
  return (
    <Rnd
      default={position}
      bounds={'.builder'}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      disableDragging={disableDragging}
      enableResizing={false}
      dragHandleClassName={".panel_header"}
      {...props}
      >
      {
        !disableMinimize &&
        <div className="panel_header">
          <div
            className="panel_header_controls"
            onClick={onToggle}>
            {minimize ? "+" : "-"}
          </div>
        </div>
      }

      <div
        className="panel_body"
        style={minimize ? { display: 'none'} : {}}
        >
        {children}
      </div>
    </Rnd>
  );
};

Panel.propTypes = {
  onDrag: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragStop: PropTypes.func,
  disableDragging: PropTypes.bool,
  onToggle: PropTypes.func,
  minimize: PropTypes.bool,
  disableMinimize: PropTypes.bool,
  position: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
};

Panel.defaultProps = {
  disableDragging: false,
}

export default Panel;
