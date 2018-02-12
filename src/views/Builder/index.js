import React, { PureComponent } from 'react';
import html2canvas from 'html2canvas';
import { cloneDeep, merge } from 'lodash';
import { EditorState, RichUtils } from 'draft-js';

import SideTools from './components/SideTools';
import Canvas from './components/Canvas';
import ImageEditor from './components/ImageEditor';
import ImageUploader from './components/ImageUploader';
import BottomBar from './components/BottomBar';
import ModeSwitch from './components/ModeSwitch';
import { OBJECT_TYPES, CANVAS_MODE } from '../../constants/appConstants';

const DEFAULT_ATTRIBUTE = {
  width: 100,
  height: undefined,
  x: 0,
  y: 0
}

const NEW_SLIDE = {
  modes: {
    [CANVAS_MODE.DESKTOP]: {
      objectIds: [],
      snapshot: undefined,
    },
    [CANVAS_MODE.MOBILE]: {
      objectIds: [],
      snapshot: undefined,
    },
  }
}

const DIALOG = {
  IMAGE_UPLOADER: 'imageUploader'
}

const DEFAULT_BUILDER_STATE = {
  objects: {},
  slides: [ cloneDeep(NEW_SLIDE) ],
  currentObjectId: undefined,
  currentSlide: 0,
  mode: CANVAS_MODE.DESKTOP,
  dialogs: {
    [DIALOG.IMAGE_UPLOADER]: false,
  },
  status: {
    isTakingSnapshot: false
  }
}

// HELPER FUNCTIONS START

/**
 * Generate a unique value to be used as an ID for objects
 */
const generateId = () => (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()

/**
 * Copy and insert the new element into the array
 */
const insertElementIntoArray = (array, index, ele) => {
  const newArray = array.slice(0)
  newArray.splice(index, 0, ele)
  return newArray
}

/**
 * Create an object data to be used in the canvas
 */
const createObjectData = (
  content,
  src,
  type,
  id=generateId(),
  attr=DEFAULT_ATTRIBUTE
  ) => ({
  content,
  src,
  type,
  id,
  attr,
})

// HELPER FUNCTIONS END

class Builder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = DEFAULT_BUILDER_STATE
    this.toggleDialog = this.toggleDialog.bind(this)
    this.addSlide = this.addSlide.bind(this)
    this.addObject = this.addObject.bind(this)
    this.changeCurrentObjectId = this.changeCurrentObjectId.bind(this)
    this.changeCurrentSlideId = this.changeCurrentSlideId.bind(this)
    this.updateSnapshot = this.updateSnapshot.bind(this)
    this.updateObject = this.updateObject.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleTextKeyCommand = this.handleTextKeyCommand.bind(this)
    this.handleModeSwitch = this.handleModeSwitch.bind(this)
    this.handleResizeEnd = this.handleResizeEnd.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleObjectClick = this.handleObjectClick.bind(this)

  }

  componentDidMount() {
    this.updateSnapshot();
  }

  toggleDialog(key) {
    this.setState({
      dialogs: {
        [key]: !this.state.dialogs[key]
      }
    });
  }

  /**
   * Create a new slide
   * @param {Number} index
   */
  addSlide(index = 0) {
    const { slides } = this.state
    const newSlide = cloneDeep(NEW_SLIDE)
    const newSlides = insertElementIntoArray(
      slides,
      index,
      newSlide
    )

    this.setState({
        currentSlide: index,
        slides: newSlides
    }, ()=> this.updateSnapshot());
  }

  /**
   * Add a new object to the current slide
   * @param {String} type
   * @param {Object} data
   */
  addObject(type, data) {
    let createObject;
    switch (type) {
      case OBJECT_TYPES.IMAGE:
        createObject = () => createObjectData(
          data.content,
          data.src,
          OBJECT_TYPES.IMAGE,
        )
        break;

      case OBJECT_TYPES.TEXT:
        createObject = () => createObjectData(
          EditorState.createEmpty(),
          '',
          OBJECT_TYPES.TEXT,
        )
        break;

      default:
        break;
    }

    /**
     * Create different objects for each screen mode
     * And add them to the object list
     * Then, add their IDs to the respective screen mode of the current slide
     */
    const { objects, slides, currentSlide } = this.state;
    const newObjects = { ...objects }
    const newSlides = slides.slice(0);
    const newSlide = { ...slides[currentSlide] }

    Object.values(CANVAS_MODE).map(mode => {
      const newImage = createObject()
      newObjects[newImage.id] = newImage;
      newSlide.modes[mode].objectIds.push(newImage.id)
    })
    newSlides[currentSlide] = newSlide

    /**
     * Update with the new slides and objects to the state
     * and update the snapshot of the slide
    */
    this.setState({
        objects: newObjects,
        slides: newSlides
    }, () => this.updateSnapshot());
  }

  /**
   * Update the attributes such as attr, content, src, etc.
   */
  updateObject(id, attr) {
    const newObject = merge(this.state.objects[id], attr)
    this.setState({
      objects: {
        ...this.state.objects,
        [id]: newObject
      }
    }, () => this.updateSnapshot());
  }


  // updateAttr(id, attr) {
  //   const { objects } = this.state
  //   const newObject = createObjectData(
  //     objects[id].content,
  //     objects[id].src,
  //     objects[id].type,
  //     id,
  //     { ...objects[id].attr, ...attr }
  //   )
  //   this.updateObject(id, newObject)
  // }

  changeCurrentSlideId(id) {
    this.setState({ currentSlide: id });
  }

  updateSnapshot() {
    const { slides, currentSlide, mode, status } = this.state

    const takeSnapshot = () => {

      const element = document.getElementById('canvas')

      if(status.isTakingSnapshot)
        return

      html2canvas(element, {
        scale: 0.2
      })
      .then(canvas => {
        // Export the canvas to its data URI representation
        const base64image = canvas.toDataURL("image/png");

        /**
         * Create a new slide object with the updated snapshot value
         */
        const newSlide = {
          ...slides[currentSlide],
          modes: {
            ...slides[currentSlide].modes,
            [mode]: {
              ...slides[currentSlide].modes[mode],
              snapshot: base64image
            }
          }
        }
        const newSlides = slides.slice(0);
        newSlides[currentSlide] = newSlide;

        this.setState({
          slides: newSlides,
          status: {
            ...status,
            isTakingSnapshot: false
          }
        });
      });
    }

    this.setState({
      status: {
        ...status,
        isTakingSnapshot: true
      }
    }, takeSnapshot());
  }

  /**
   * Set the current object as active
   * @param {String} id
   */
  changeCurrentObjectId(id) {
    if(this.state.currentObjectId === id)
      return

    this.setState({ currentObjectId: id });
  }
onKeyCommand
  handleModeSwitch(mode) {
    this.setState({ mode });
  }

  handleTextChange(id, editorState) {
    this.updateObject(id, {
      content: editorState
    });
  }

  handleTextKeyCommand(id, command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.handleTextChange(id, newState);
      return 'handled';
    }
    return 'not-handled';
  }

  handleResizeEnd(id, event, direction, ref, delta, position) {
    this.updateObject(id, {
      attr: {
        width: ref.offsetWidth,
        height: ref.offsetHeight,
        x: position.x,
        y: position.y
      }
    })
  }

  handleDragEnd(id, e, d) {
    this.updateObject(id, {
      attr: {
        x: d.x,
        y: d.y
      }
    })
  }

  handleObjectClick(id) {
    this.changeCurrentObjectId(id)
  }

  render() {
    const {
      mode,
      objects,
      slides,
      currentObjectId,
      currentSlide,
    } = this.state

    console.warn(this.state);

    return (
      <div className="builder">
        <SideTools
          onClick={this.toggleDialog.bind(null, DIALOG.IMAGE_UPLOADER)}
          onTextClick={this.addObject.bind(null, OBJECT_TYPES.TEXT)}
        />
        <div style={{marginLeft: 60}}>
          <ImageUploader
            visible={this.state.dialogs[DIALOG.IMAGE_UPLOADER]}
            onCancel={this.toggleDialog.bind(null, DIALOG.IMAGE_UPLOADER)}
            onImageChange={this.addObject}
            />
          <ModeSwitch
            onSelect={this.handleModeSwitch}
            mode={mode}
            />
          <Canvas
            mode={mode}
            onResizeStop={this.handleResizeEnd}
            onDragStop={this.handleDragEnd}
            objects={objects}
            objectIds={slides[currentSlide].modes[mode].objectIds}
            onObjectClick={this.handleObjectClick}
            onTextChange={this.handleTextChange}
            onTextKeyCommand={this.handleTextKeyCommand}
            activeId={currentObjectId}
            />
          <ImageEditor />
          <BottomBar
            mode={mode}
            currentSlide={currentSlide}
            onClick={this.changeCurrentSlideId}
            onAdd={this.addSlide}
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
