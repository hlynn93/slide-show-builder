import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DNRImage, DNRText } from '../../../components/DNR';
import { ASPECT_RATIO, OBJECT_TYPE } from '../../../constants/builderConstants';


import './Canvas.scss';

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
      isPreview,
    } = this.props

    return objectIds.map(id => {

      const object = objects[id]
      const resizeState = isPreview ? {
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
        disableDragging: isPreview,
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
              readOnly={isPreview}
              {...objectProps}
              enableResizing={resizeState}

            />
          )

        default: return null;
      }
    })
  }

  render() {
    const { mode, scale, onCanvasClick } = this.props

    const canvasStyle = {
      ...ASPECT_RATIO[mode],
      zoom: scale,
      transform: `scale(${scale})`
    }

    return (
      <div
        className="canvas_wrapper"
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
  isPreview: PropTypes.bool,
};

Canvas.defaultProps = {
  objectIds: [],
  objects: {},
  isPreview: false,
  onObjectClick: () => {},
  onTextChange: () => {},
  onCanvasClick: () => {},
  onDrag: () => {},
  onBlur: () => {},
  onFocus: () => {},
  onResize: () => {},
}

export default Canvas;
