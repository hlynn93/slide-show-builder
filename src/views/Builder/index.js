import React, { PureComponent } from 'react';
import SideTools from './components/SideTools';
import Canvas from './components/Canvas';
import ImageEditor from './components/ImageEditor';
import ImageUploader from './components/ImageUploader';
import BottomBar from './components/BottomBar';
import html2canvas from 'html2canvas';
import { OBJECT_TYPES } from '../../constants/appConstants';
// import PropTypes from 'prop-types';

const generateId = () => (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()

const createObjectData = (content, url, type, id, attr={
  width: 100,
  height: 100,
  x: 0,
  y: 0
}) => ({
  content,
  url,
  type,
  id,
  attr
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
      currentObjectId: undefined,
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

  /**
   * Create a new slide
   * @param {Number} index
   */
  createSlide(index = 0) {
    const newSlide = NEW_SLIDE
    const newSlides = this.state.slides.slice(0).splice(index, 0, newSlide)
    this.setState({
      currentSlide: index,
      slides: newSlides
    });
  }

  /**
   * Update the attributes such as width, height, x and y of an object
   */
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

  /**
   * Set the current object as active
   * @param {String} id
   */
  updateCurrentObject(id) {
    if(this.state.currentObjectId === id)
      return

    this.setState({
      currentObjectId: id
    });
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

  handleClick(id) {
    this.updateCurrentObject(id)
  }

  /**
   * Add a new image
   * @param {Object} e
   */
  handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      const { objects, slides, currentSlide } = this.state;

      /**
       * Create an image object
       */
      const image = createObjectData(file,
        reader.result,
        OBJECT_TYPES.IMAGE,
        generateId()
      )

      /**
       * Add the new image id into the current slide's object list
       */
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
      currentObjectId,
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
            activeId={currentObjectId}
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
