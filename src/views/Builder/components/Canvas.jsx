import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DraggableImage } from '../../../components/Draggables';

import './Canvas.scss';

class Canvas extends PureComponent {

  constructor(props) {
    super(props);
    this.renderImages = this.renderImages.bind(this)
  }

  renderImages() {
    const { objectIds, objects, onClick, onDragStop, onResizeStop, activeId } = this.props
    return objectIds.map(id => (
      <DraggableImage
        onDragStop={onDragStop.bind(null, id)}
        onResizeStop={onResizeStop.bind(null, id)}
        isActive={id === activeId}
        onClick={onClick.bind(null, id)}
        object={objects[id]}
        key={id}
        bounds={"parent"}
        className={`canvas_image canvas_image--${id}`}/>
    ))
  }

  render() {
    const { objectIds, objects, onClick, activeId } = this.props
    return (
      <div className="canvas_wrapper">
        <div id="canvas" className="canvas canvas--desktop">
          { this.renderImages(objectIds, objects, activeId, onClick) }
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
};

export default Canvas;
