import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DNRImage } from '../../../components/DNR';
import { ASPECT_RATIO } from '../../../constants/appConstants';

import './Canvas.scss';

class Canvas extends PureComponent {

  constructor(props) {
    super(props);
    this.renderImages = this.renderImages.bind(this)
  }

  renderImages() {
    const { objectIds, objects, onClick, onDragStop, onResizeStop, activeId } = this.props
    return objectIds.map(id => (
      <DNRImage
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
    const { objectIds, objects, onClick, activeId, mode } = this.props

    const style = ASPECT_RATIO[mode]

    return (
      <div className="canvas_wrapper">
        <div id="canvas" className="canvas" style={style}>
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
  mode: PropTypes.string,
};

export default Canvas;
