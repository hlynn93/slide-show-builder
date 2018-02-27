import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DNRImage, DNRText } from '../../../components/DNR';
import { ASPECT_RATIO, OBJECT_TYPE } from '../../../constants/builderConstants';
import { isFirefox } from '../../../utils/commonUtils';


import './Canvas.scss';

const getMarginScale = (scale, mode) => (ASPECT_RATIO[mode].height * (scale - 1)) / 2

class Canvas extends PureComponent {

  constructor(props) {
    super(props);
    this.renderObjects = this.renderObjects.bind(this)
  }

  renderObjects() {
    const {
      objectIds,
      objects,
      onObjectClick,
      onTextChange,
      onDrag,
      onResize,
      onBlur,
      onFocus,
      activeId,
      fullScreen,
    } = this.props

    return objectIds.map(id => {

      const object = objects[id]
      const resizeState = fullScreen ? {
        top:false,
        right:false,
        bottom:false,
        left:false,
        topRight:false,
        bottomRight:false,
        bottomLeft:false,
        topLeft:false
      } : undefined
      const objectProps = {
        onDrag: onDrag.bind(null, id),
        onResize: onResize.bind(null, id),
        isActive: id === activeId,
        onClick: onObjectClick.bind(null, id),
        object,
        key: id,
        id: `canvas_object--${id}`,
        className: `canvas_object canvas_object--${id}`,
        disableDragging: fullScreen,
        enableResizing: resizeState
      }

      switch (object.type) {
        case OBJECT_TYPE.IMAGE:
          return (
            <DNRImage
              {...objectProps }
              />
          )

        case OBJECT_TYPE.TEXT:
          return (
            <DNRText
              onTextChange={onTextChange.bind(null, id)}
              onBlur={onBlur}
              onFocus={onFocus}
              readOnly={fullScreen}
              {...objectProps}
              enableResizing={resizeState}

            />
          )

        default: return null;
      }
    })
  }

  render() {
    const { mode, scale, onCanvasClick, fullScreen } = this.props

    /*  Firefox does not support `zoom` css property  */
    const scaleStyle = isFirefox ? {
      transform: `scale(${scale})`,
      marginTop: getMarginScale()
    } : { zoom: scale }

    const canvasStyle = {
      ...ASPECT_RATIO[mode],
      ...scaleStyle
    }

    console.warn(scale, getMarginScale(scale, mode));

    return (
      <div
        className={`canvas_wrapper ${fullScreen ? 'canvas_wrapper--fullscreen' : ''}`}
        onClick={onCanvasClick}>
        <div id="canvas" className="canvas" style={canvasStyle}>
          { this.renderObjects() }
        </div>
      </div>
    );
  }
}

Canvas.propTypes = {
  objectIds: PropTypes.array,
  objects: PropTypes.object,
  onObjectClick: PropTypes.func,
  onTextChange: PropTypes.func,
  onCanvasClick: PropTypes.func,
  onDrag: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onResize: PropTypes.func,
  activeId: PropTypes.string,
  mode: PropTypes.string,
  scale: PropTypes.number,
  fullScreen: PropTypes.bool,
};

Canvas.defaultProps = {
  objectIds: [],
  objects: {},
  fullScreen: false,
  onObjectClick: () => {},
  onTextChange: () => {},
  onCanvasClick: () => {},
  onDrag: () => {},
  onBlur: () => {},
  onFocus: () => {},
  onResize: () => {},
}

export default Canvas;
