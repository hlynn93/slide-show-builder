import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DraggableImage } from '../../../components/Draggables';

import './Canvas.scss';

const renderImages = (ids, objects, onClick) =>
  ids.map(id => (
    <DraggableImage
      onClick={() => onClick(id)}
      key={id}
      bounds={"parent"}
      className={"canvas_image"}
      src={objects[id].url} />
  ))


class Canvas extends PureComponent {



  render() {
    const { imgIds, objects, onClick } = this.props
    return (
      <div className="canvas_wrapper">
        <div className="canvas canvas--desktop">
          { renderImages(imgIds, objects, onClick) }
        </div>
      </div>
    );
  }
}

Canvas.propTypes = {
  imgIds: PropTypes.array,
  objects: PropTypes.object,
  onClick: PropTypes.func,
};

export default Canvas;
