import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DNRImage, DNRText } from '../../../components/DNR';
import { ASPECT_RATIO, OBJECT_TYPE } from '../../../constants/builderConstants';
import { isFirefox } from '../../../utils/commonUtils';
import Transition from '../../../components/Transition';

import './Canvas.scss';

const getMarginScale = (scale, mode) => (ASPECT_RATIO[mode].height * (scale - 1)) / 2

class Canvas extends Component {

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
      presenterMode,
      objectTransition,
      isTextFocused
    } = this.props

    return objectIds.map(id => {

      const object = objects[id]

      /* disable resizing if it's in presenter mode */
      const resizeState = presenterMode ? {
        top:false,
        right:false,
        bottom:false,
        left:false,
        topRight:false,
        bottomRight:false,
        bottomLeft:false,
        topLeft:false
      } : undefined

      /* attach transition props if the canvas is in presenter mode */
      const transitionObjIds = objectTransition.objectIds || []
      const transition = objectTransition.transition || {}
      const isAnimatable = transitionObjIds.indexOf(id) > -1 && (presenterMode)
      const transitionProp = {
        transition: isAnimatable ? transition : undefined
      }

      const objectProps = {
        onDrag: onDrag.bind(null, id),
        onResize: onResize.bind(null, id),
        isActive: id === activeId,
        onClick: onObjectClick.bind(null, id),
        object,
        key: id,
        id: `canvas_object--${id}`,
        className: `canvas_object canvas_object--${id}`,
        disableDragging: presenterMode || isTextFocused,
        enableResizing: resizeState,
        bounds: '.builder',
        ...transitionProp,
      }

      if(!object) return;

      switch (object.type) {
        case OBJECT_TYPE.IMAGE:
          return <DNRImage
            {...objectProps }
            />

        case OBJECT_TYPE.TEXT:
          return <DNRText
              {...objectProps}
              onTextChange={onTextChange.bind(null, id)}
              onBlur={onBlur}
              onFocus={onFocus}
              readOnly={presenterMode}
              />

        default: return null;
      }
    })
  }

  render() {
    const {
      mode,
      scale,
      onCanvasClick,
      presenterMode,
      style,
      slideTransition
    } = this.props

    /*  Firefox does not support `zoom` css property  */
    const scaleStyle = isFirefox ? {
      transform: `scale(${scale})`,
      marginTop: getMarginScale()
    } : { zoom: scale }

    const canvasStyle = {
      ...ASPECT_RATIO[mode],
      ...scaleStyle
    }

    return (
      <div
        className={`canvas_wrapper ${presenterMode ? 'canvas_wrapper--present' : ''}`}
        style={style}
        onClick={onCanvasClick}>
        <Transition {...slideTransition}>
          <div id="canvas" className="canvas" style={canvasStyle}>
              { this.renderObjects() }
          </div>
        </Transition>
      </div>
    );
  }
}

Canvas.propTypes = {
  style: PropTypes.object,
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
  presenterMode: PropTypes.bool,
  objectTransition: PropTypes.object,
  slideTransition: PropTypes.object,
  isTextFocused: PropTypes.bool,
};

Canvas.defaultProps = {
  style: {},
  objectIds: [],
  animatedIds: [],
  objects: {},
  presenterMode: false,
  objectTransition: {},
  slideTransition: {},
  onObjectClick: () => {},
  onTextChange: () => {},
  onCanvasClick: () => {},
  onDrag: () => {},
  onBlur: () => {},
  onFocus: () => {},
  onResize: () => {},
}

export default Canvas;
