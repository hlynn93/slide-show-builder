import React, { PureComponent } from 'react';
import html2canvas from 'html2canvas';
import { cloneDeep, merge, mapValues } from 'lodash';
import { EditorState } from 'draft-js';

import SideTools from './components/SideTools';
import Canvas from './components/Canvas';
import ImageEditor from './components/ImageEditor';
import TextEditor from './components/TextEditor';
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
  IMAGE_UPLOADER: 'imageUploader',
  TEXT_EDITOR: 'textEditor',
  IMAGE_EDITOR: 'imageEditor',

}

const PANEL = {
  SIDE_TOOLS: 'sideTools'
}

const DEFAULT_BUILDER_STATE = {
  objects: {},
  slides: [ cloneDeep(NEW_SLIDE) ],
  activeObjectId: undefined,
  currentSlide: 0,
  mode: CANVAS_MODE.DESKTOP,
  dialogs: {
    [DIALOG.IMAGE_UPLOADER]: false,
    [DIALOG.TEXT_EDITOR]: false,
    [DIALOG.IMAGE_EDITOR]: false,
  },
  panels: {
    [PANEL.SIDE_TOOLS]: true
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
    this.togglePanel = this.togglePanel.bind(this)
    this.showOneDialog = this.showOneDialog.bind(this)
    this.hideAllDialogs = this.hideAllDialogs.bind(this)
    this.addSlide = this.addSlide.bind(this)
    this.addObject = this.addObject.bind(this)
    this.updateActiveObjectId = this.updateActiveObjectId.bind(this)
    this.changeCurrentSlideId = this.changeCurrentSlideId.bind(this)
    this.updateSnapshot = this.updateSnapshot.bind(this)
    this.updateObject = this.updateObject.bind(this)
    this.handleCanvasClick = this.handleCanvasClick.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleModeSwitch = this.handleModeSwitch.bind(this)
    this.handleResizeEnd = this.handleResizeEnd.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleObjectChange = this.handleObjectChange.bind(this)
    this.handleObjectClick = this.handleObjectClick.bind(this)

  }

  componentDidMount() {
    this.updateSnapshot();
  }

  toggleDialog(key, e) {
    e.preventDefault();
    this.setState({
      dialogs: {
        ...this.state.dialogs,
        [key]: !this.state.dialogs[key]
      }
    });
  }

  togglePanel(key, e) {
    e.preventDefault();
    this.setState({
      panels: {
        ...this.state.panels,
        [key]: !this.state.panels[key]
      }
    });
  }

  /**
   * Show only the particular dialog and hide everything else
   * @param {string} key
   */
  showOneDialog(key) {
    const newDialogState = mapValues({ ...this.state.dialogs },  () => false )
    this.setState({
      dialogs: {
        ...newDialogState,
        [key]: true
      }
    });
  }

  /**
   * Show only the particular dialog and hide everything else
   * @param {string} key
   */
  hideAllDialogs() {
    // Change all values to false
    const newDialogState = mapValues({ ...this.state.dialogs },  () => false )
    this.setState({
      dialogs: newDialogState
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
      const newObject = createObject()
      newObjects[newObject.id] = newObject;
      newSlide.modes[mode].objectIds.push(newObject.id)
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
  updateObject(id, attr, options = {
    updateSnapshot: true // updateSnapshot by default
  }) {
    this.setState({
      objects: {
        ...this.state.objects,
        [id]: merge({}, this.state.objects[id], attr)
      }
    }, () => options.updateSnapshot ? this.updateSnapshot() : null);
  }

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
  updateActiveObjectId(id) {
    const { activeObjectId, objects } = this.state

    if(activeObjectId === id)
      return

    this.setState({ activeObjectId: id }, () => {

      // If the current object is undefined
      if(!objects[id])
        return this.hideAllDialogs();

      if(objects[id].type === OBJECT_TYPES.TEXT)
        return this.showOneDialog(DIALOG.TEXT_EDITOR)
      else
        return this.hideAllDialogs()

    });
  }

  handleModeSwitch(mode) {
    this.setState({ mode });
  }

  handleTextChange(id, editorState) {
    this.updateObject(id, {
      content: editorState
    });
  }

  handleCanvasClick() {
    this.updateActiveObjectId()
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

  handleObjectChange(id, attr) {
    if(this.state.objects[id])
      this.updateObject(id, { attr }, { updateSnapshot: false })
  }

  handleDragEnd(id, e, d) {

    /**
     * To avoid getting trigger upon clicking without dragging
     */
    const objectAttr = this.state.objects[id].attr
    if(objectAttr.x === d.x && objectAttr.y === d.y)
      return

    this.updateObject(id, {
      attr: {
        x: d.x,
        y: d.y
      }
    })
  }

  handleObjectClick(id, e) {
    e.stopPropagation();
    this.updateActiveObjectId(id)
  }

  render() {
    const {
      mode,
      objects,
      slides,
      activeObjectId,
      currentSlide,
      dialogs,
      panels
    } = this.state

    return (
      <div className="builder">
        <SideTools
          visible={panels[PANEL.SIDE_TOOLS]}
          onClick={this.toggleDialog.bind(null, DIALOG.IMAGE_UPLOADER)}
          onToggle={this.togglePanel.bind(null, PANEL.SIDE_TOOLS)}
          onTextClick={this.addObject.bind(null, OBJECT_TYPES.TEXT)}
        />
        <div style={{marginLeft: 60}}>
          <ImageUploader
            visible={dialogs[DIALOG.IMAGE_UPLOADER]}
            onCancel={this.toggleDialog.bind(null, DIALOG.IMAGE_UPLOADER)}
            onImageChange={this.addObject}
            />
          <ModeSwitch
            onSelect={this.handleModeSwitch}
            mode={mode}
            />
          <Canvas
            mode={mode}
            onCanvasClick={this.handleCanvasClick}
            onResizeStop={this.handleResizeEnd}
            onDragStop={this.handleDragEnd}
            objects={objects}
            objectIds={slides[currentSlide].modes[mode].objectIds}
            onObjectClick={this.handleObjectClick}
            onTextChange={this.handleTextChange}
            activeId={activeObjectId}
            />
          <ImageEditor
            visible={dialogs[DIALOG.IMAGE_EDITOR]}
            onToggle={this.toggleDialog.bind(null, DIALOG.IMAGE_EDITOR)}
            onChange={this.handleObjectChange}
            id={activeObjectId}
            attribute={objects[activeObjectId] ?
              objects[activeObjectId].attr : {}
            }
          />
          <TextEditor
            visible={dialogs[DIALOG.TEXT_EDITOR]}
            onToggle={this.toggleDialog.bind(null, DIALOG.TEXT_EDITOR)}
            id={
              // Pass undefined if no object is selected or currently selected object is not text type
              (objects[activeObjectId] && objects[activeObjectId].type === OBJECT_TYPES.TEXT)
              ? activeObjectId : undefined
            }
            editorState={objects[activeObjectId] ? objects[activeObjectId].content : undefined}
            onClick={this.handleTextChange}
            />
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
