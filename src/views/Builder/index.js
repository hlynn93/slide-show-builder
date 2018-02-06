import React, { PureComponent } from 'react';
import SideTools from './components/SideTools';
import Canvas from './components/Canvas';
import ImageEditor from './components/ImageEditor';
import ImageUploader from './components/ImageUploader';
import BottomBar from './components/BottomBar';
import html2canvas from 'html2canvas';
// import PropTypes from 'prop-types';


const formatObjectData = (content, url, type, id) => ({
  content,
  url,
  type,
  id,
  attr: { width: 100, height: 100, x: 110, y: 110}
})

class Builder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
      objects: {},
      imgIds: [],
      currentObject: {},
      snapshots: {},
    }
    this.updateSnapshot = this.updateSnapshot.bind(this)
    this.updateCurrentObject = this.updateCurrentObject.bind(this)
    this.updateAttr = this.updateAttr.bind(this)
    this.handleResizeEnd = this.handleResizeEnd.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleImageChange = this.handleImageChange.bind(this)
  }

  handleResizeEnd(id, event, direction, ref, delta, position) {
      return this.updateAttr(id, {
        width: ref.offsetWidth,
        height: ref.offsetHeight,
        x: position.x,
        y: position.y
      })
  }

  handleDragEnd(id, e, d) {
    this.updateAttr(id, {
      x: d.x,
      y: d.y
    })
  }

  updateAttr(id, attr) {
    const { objects } = this.state
    return this.setState({
      objects: {
        ...objects,
        [id]: {
          ...objects[id],
          attr: { ...objects[id].attr, ...attr }
        }
      }
    }, () => this.updateSnapshot());
  }

  updateSnapshot() {
    const element = document.getElementById('canvas')
    html2canvas(element)
    .then(canvas => {
      // Export the canvas to its data URI representation
      const base64image = canvas.toDataURL("image/png");
      this.setState({
        snapshots: {
          [this.state.currentSlide]: base64image
        }
      });
    });
  }

  updateCurrentObject(id) {
    this.setState({
      currentObject: { ...this.state.objects[id] }
    });
  }

  handleClick(id) {
    this.updateCurrentObject(id)
  }

  handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      const { objects, imgIds } = this.state;

      const image = formatObjectData(file,
        reader.result,
        "image",
        Object.keys(objects).length
      )

      this.setState({
        objects: {
          ...objects,
          [image.id]: image
        },
        imgIds: imgIds.concat(image.id)
      });
    }

    if(file)
      reader.readAsDataURL(file)
  }

  render() {
    const {
      objects,
      imgIds,
      currentObject,
      currentSlide,
      snapshots
    } = this.state

    console.warn(this.state);

    return (
      <div className="builder">
        <SideTools />
        <div style={{marginLeft: 60}}>
          <ImageUploader
            onImageChange={this.handleImageChange}
            />
          <Canvas
            onResizeStop={this.handleResizeEnd}
            onDragStop={this.handleDragEnd}
            objects={objects}
            imgIds={imgIds}
            onClick={this.handleClick}
            activeId={currentObject.id}
            />
          <ImageEditor />
          <BottomBar
            currentSlide={currentSlide}
            snapshots={snapshots}
            />
        </div>
      </div>
    );
  }
}

Builder.propTypes = {

};

Builder.defaultProps = {

};

export default Builder;
