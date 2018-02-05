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
    const { imgIds, objects, onClick, onDragStop, activeId } = this.props
    return imgIds.map(id => (
      <DraggableImage
        onStop={onDragStop.bind(null, id)}
        isActive={id === activeId}
        onClick={onClick.bind(null, id)}
        key={id}
        bounds={"parent"}
        className={`canvas_image canvas_image--${id}`}
        src={objects[id].url} />
    ))
  }

  render() {
    const { imgIds, objects, onClick, activeId } = this.props
    return (
      <div className="canvas_wrapper">
        <div id="canvas" className="canvas canvas--desktop">
          { this.renderImages(imgIds, objects, activeId, onClick) }
        </div>
      </div>
    );
  }
}

Canvas.propTypes = {
  imgIds: PropTypes.array,
  objects: PropTypes.object,
  onClick: PropTypes.func,
  onDragStop: PropTypes.func,
  activeId: PropTypes.number,
};

export default Canvas;
