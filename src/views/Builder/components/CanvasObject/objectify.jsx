/**

/**
 * HOC to inject Drag and Resize property to the component
 */
import React from 'react';
import Rnd from 'react-rnd';
import cx from 'classnames';
import { isUndefined } from 'lodash';
import { IMAGE_TOOL_TYPE } from '../../../../constants/builderConstants';
import Transition from '../../../../components/Transition';
import CursorWrapper from './CursorWrapper';

/* eslint-disable */

export default (Component) => {
  return ({
    className,
    id,
    isActive,
    onDrag,
    onDragStart,
    onDragStop,
    onResize,
    onResizeStart,
    onResizeStop,
    bounds,
    disableDragging,
    enableResizing,
    object,
    style,
    inProp,
    onClick,
    transition,
    lockAspectRatio = false,
    ...props
  }) => {

    const { attr } = object;

    /* For image rotation */
    const componentStyle = !isUndefined(attr[IMAGE_TOOL_TYPE.ROTATION]) ? {
      transform: `rotate(${attr.rotation}deg)`
    } : {};

    const baseClass = "dnr_object"
    const classes = cx(
      baseClass,
      { [`${baseClass}--active`]: isActive }
    )

    return (
      <Rnd
        style={style}
        size={{
          width: attr.width,
          height: attr.height
        }}
        default={attr}
        position={{
          x: attr.x,
          y: attr.y,
        }}
        bounds={bounds || 'parent'}
        onResizeStart={onResizeStart}
        onResize={onResize}
        onResizeStop={onResizeStop}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragStop={onDragStop}
        enableResizing={enableResizing}
        disableDragging={disableDragging}
        className={classes}
        lockAspectRatio={lockAspectRatio}
        >
        <Transition {...transition}>
          <div
            className="dnr_inner"
            onClick={onClick}
            style={componentStyle}
            >
            <Component
              isActive={isActive}
              {...object}
              {...props} />
            {
              isActive &&
              <CursorWrapper />
            }
          </div>
        </Transition>
      </Rnd>
        )
  }
}
