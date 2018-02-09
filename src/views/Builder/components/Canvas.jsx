import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DNRImage, DNRText } from '../../../components/DNR';
import { ASPECT_RATIO, OBJECT_TYPES } from '../../../constants/appConstants';
import { EditorState } from 'draft-js';

import './Canvas.scss';

class Canvas extends PureComponent {

  constructor(props) {
    super(props);
    this.renderObjects = this.renderObjects.bind(this)
    this.state = {
      editorState: EditorState.createEmpty()}
  }

  renderObjects() {
    const { objectIds, objects, onClick, onDragStop, onResizeStop, activeId } = this.props
    console.warn(objectIds);
    return objectIds.map(id => {
      console.warn("first: ", id);
      const object = objects[id]
      const props = {
        onDragStop: onDragStop.bind(null, id),
        onResizeStop: onResizeStop.bind(null, id),
        isActive: id === activeId,
        onClick: onClick.bind(null, id),
        object,
        key: id,
        className: `canvas_object canvas_object--${id}`
      }
      switch (object.type) {
        case OBJECT_TYPES.IMAGE:
          return (
            <DNRImage {...props }/>
          )

        case OBJECT_TYPES.TEXT:
          return (
            <DNRText
              onChange={ editorState => this.setState({ editorState }) }
              editorState={this.state.editorState}
              {...props}
            />
          )

        default: return null;
      }
    })
  }

  render() {
    const { objectIds, objects, onClick, activeId, mode } = this.props

    const style = ASPECT_RATIO[mode]

    return (
      <div className="canvas_wrapper">
        <div id="canvas" className="canvas" style={style}>
          { this.renderObjects(objectIds, objects, activeId, onClick) }
        </div>
      </div>
    );
  }
}

Canvas.propTypes = {
  objectIds: PropTypes.array,
  objects: PropTypes.object,
  onClick: PropTypes.func,
  onDragStop: PropTypes.func,
  onResizeStop: PropTypes.func,
  activeId: PropTypes.string,
  mode: PropTypes.string,
};

export default Canvas;
