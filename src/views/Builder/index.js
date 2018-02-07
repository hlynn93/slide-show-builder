import React, { PureComponent } from 'react';
import SideTools from './components/SideTools';
import Canvas from './components/Canvas';
import ImageEditor from './components/ImageEditor';
import ImageUploader from './components/ImageUploader';
import BottomBar from './components/BottomBar';
import html2canvas from 'html2canvas';
// import PropTypes from 'prop-types';

const generateId = () => (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()

const createObjectData = (content, url, type, id) => ({
  content,
  url,
  type,
  id,
  attr: { width: 100, height: 100, x: 0, y: 0}
})

const NEW_SLIDE = {
  objectIds: [],
  snapshot: undefined
}

class Builder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      objects: {},
      slides: [ NEW_SLIDE ],
      snapshots: {},
      currentObject: {},
      currentSlide: 0,
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

  createSlide(index = 0) {
    const newSlides = this.state.slides.slice(0)
    const newSlide = NEW_SLIDE
    newSlides.splice(index, 0, newSlide);
    this.setState({
      currentSlide: index,
      slides: newSlides
    });
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

      const { slides, currentSlide } = this.state
      const newSlide = { ...slides[currentSlide], snapshot: base64image }
      const newSlides = slides.slice(0);
      newSlides[currentSlide] = newSlide;

      this.setState({
        slides: newSlides
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
      const { objects, slides, currentSlide } = this.state;

      const image = createObjectData(file,
        reader.result,
        "image",
        generateId()
      )

      const newSlides = slides.slice(0);
      const newSlide = {
        ...slides[currentSlide],
        objectIds: slides[currentSlide].objectIds.concat(image.id)
      }
      newSlides[currentSlide] = newSlide

      this.setState({
        objects: {
          ...objects,
          [image.id]: image
        },
        slides: newSlides
      });
    }

    if(file)
      reader.readAsDataURL(file)
  }

  render() {
    const {
      objects,
      slides,
      currentObject,
      currentSlide,
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
            objectIds={slides[currentSlide].objectIds}
            onClick={this.handleClick}
            activeId={currentObject.id}
            />
          <ImageEditor />
          <BottomBar
            currentSlide={currentSlide}
            slides={slides}
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
