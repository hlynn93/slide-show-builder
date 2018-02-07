import React, { PureComponent } from 'react';
import SideTools from './components/SideTools';
import Canvas from './components/Canvas';
import ImageEditor from './components/ImageEditor';
import ImageUploader from './components/ImageUploader';
import BottomBar from './components/BottomBar';
import ModeSwitch from './components/ModeSwitch';
import html2canvas from 'html2canvas';
import { OBJECT_TYPES, CANVAS_MODE } from '../../constants/appConstants';
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

const DEFAULT_STATE = {
  objects: {},
  slides: [ NEW_SLIDE ],
  snapshots: {},
  currentObjectId: undefined,
  currentSlide: 0,
}

class Builder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      [CANVAS_MODE.MOBILE]: DEFAULT_STATE,
      [CANVAS_MODE.DESKTOP]: DEFAULT_STATE,
      mode: CANVAS_MODE.DESKTOP
    }
    this.updateSnapshot = this.updateSnapshot.bind(this)
    this.updateCurrentObject = this.updateCurrentObject.bind(this)
    this.updateAttr = this.updateAttr.bind(this)
    this.handleModeSwitch = this.handleModeSwitch.bind(this)
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
    const { mode } = this.state
    const newSlide = NEW_SLIDE
    const newSlides = this.state.slides.slice(0).splice(index, 0, newSlide)
    this.setState({
      [mode]: {
        ...this.state[mode],
        currentSlide: index,
        slides: newSlides
      }
    });
  }

  /**
   * Update the attributes such as width, height, x and y of an object
   */
  updateAttr(id, attr) {
    const { mode } = this.state
    const { objects } = this.state[mode]
    return this.setState({
      [mode]: {
        ...this.state[mode],
        objects: {
          ...objects,
          [id]: {
            ...objects[id],
            attr: { ...objects[id].attr, ...attr }
          }
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

      const { mode } = this.state
      const { slides, currentSlide } = this.state[mode]
      const newSlide = { ...slides[currentSlide], snapshot: base64image }
      const newSlides = slides.slice(0);
      newSlides[currentSlide] = newSlide;

      this.setState({
        [mode]: {
          ...this.state[mode],
          slides: newSlides
        }
      });
    });
  }

  /**
   * Set the current object as active
   * @param {String} id
   */
  updateCurrentObject(id) {
    const { mode } = this.state
    if(this.state[mode].currentObjectId === id)
      return

    this.setState({
      [mode]: {
        ...this.state[mode],
        currentObjectId: id
      }
    });
  }

  handleModeSwitch(mode) {
    this.setState({ mode });
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
      const { mode } = this.state
      const { objects, slides, currentSlide } = this.state[mode];

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
        [mode]: {
          ...this.state[mode],
          objects: {
            ...objects,
            [image.id]: image
          },
          slides: newSlides
        }
      });
    }

    if(file)
      reader.readAsDataURL(file)
  }

  render() {
    const { mode } = this.state
    const {
      objects,
      slides,
      currentObjectId,
      currentSlide,
    } = this.state[mode]

    console.warn(this.state);

    return (
      <div className="builder">
        <SideTools />
        <div style={{marginLeft: 60}}>
          <ImageUploader
            onImageChange={this.handleImageChange}
            />
          <ModeSwitch
            onSelect={this.handleModeSwitch}
            />
          <Canvas
            mode={mode}
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
