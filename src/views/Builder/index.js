import React, { PureComponent } from 'react';
import html2canvas from 'html2canvas';
import { EditorState } from 'draft-js';
import {
  cloneDeep,
  merge,
  mapValues
} from 'lodash';

import SideTools from './components/SideTools';
import Canvas from './components/Canvas';
// import ImageEditor from './components/ImageEditor';
import EditorPanel from './components/EditorPanel';
import Editor from './components/Editor';
// import TextEditor from './components/TextEditor';
import ImageUploader from './components/ImageUploader';
import BottomBar from './components/BottomBar';
import ModeSwitch from './components/ModeSwitch';

import {
  generateId,
  removeSlide,
  addSlide,
  addObject,
  removeObject,
} from '../../utils/builderUtils';
import {
  OBJECT_TYPE,
  CANVAS_MODE,
  IMAGE_TOOL_TYPE,
  TEXT_TOOL_TYPE
} from '../../constants/builderConstants';

const DIALOG = {
  IMAGE_UPLOADER: 'imageUploader',
  EDITOR_PANEL: 'editorPanel',
}

const PANEL = {
  SIDE_TOOLS: 'sideTools'
}

const STATUS = {
  IS_TAKING_SNAPSHOT: 'isTakingSnapshot',
  IS_EDITING_TEXT: 'isEditingText',
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

const DEFAULT_ATTRIBUTE = {
  width: 100,
  height: undefined,
  x: 0,
  y: 0
}

const DEFAULT_BUILDER_STATE = {
  objects: {},
  slides: [ cloneDeep(NEW_SLIDE) ],
  activeObjectId: undefined,
  currentSlide: 0,
  mode: CANVAS_MODE.DESKTOP,
  dialogs: {
    [DIALOG.IMAGE_UPLOADER]: false,
    [DIALOG.EDITOR_PANEL]: false,
  },
  panels: {
    [PANEL.SIDE_TOOLS]: true
  },
  status: {
    [STATUS.IS_TAKING_SNAPSHOT]: false,
    [STATUS.IS_EDITING_TEXT]: false,
  }
}

class Builder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = DEFAULT_BUILDER_STATE
    this.toggleDialog = this.toggleDialog.bind(this)
    this.togglePanel = this.togglePanel.bind(this)
    this.showOneDialog = this.showOneDialog.bind(this)
    this.hideAllDialogs = this.hideAllDialogs.bind(this)
    this.addSlide = this.addSlide.bind(this)
    this.removeSlide = this.removeSlide.bind(this)
    this.addObject = this.addObject.bind(this)
    this.removeObject = this.removeObject.bind(this)
    this.updateActiveObjectId = this.updateActiveObjectId.bind(this)
    this.changeCurrentSlideId = this.changeCurrentSlideId.bind(this)
    this.updateStatus = this.updateStatus.bind(this)
    this.updateSnapshot = this.updateSnapshot.bind(this)
    this.updateObject = this.updateObject.bind(this)
    this.handleCanvasClick = this.handleCanvasClick.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleModeSwitch = this.handleModeSwitch.bind(this)
    this.handleResizeEnd = this.handleResizeEnd.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleObjectChange = this.handleObjectChange.bind(this)
    this.handleObjectClick = this.handleObjectClick.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this);
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
    const newSlides = addSlide(slides, NEW_SLIDE, index)

    this.setState({
        currentSlide: index,
        slides: newSlides
    }, ()=> this.updateSnapshot());
  }

  removeSlide(index) {
    const { slides, objects, currentSlide } = this.state
    const result = removeSlide(objects, slides, index);

    this.setState({
      objects: result.objects,
      slides: result.slides,
      currentSlide: index > currentSlide ? currentSlide : currentSlide - 1
    });
  }

  /**
   * Add a new object to the current slide
   * @param {String} type
   * @param {Object} data
   */
  addObject(type, data) {

    let newObject = {
      id: generateId(),
      type,
      attr: DEFAULT_ATTRIBUTE
    };

    switch (type) {
      case OBJECT_TYPE.IMAGE:
        newObject = {
          ...newObject,
          content: data.content,
          src: data.src,
        }
        break;

      case OBJECT_TYPE.TEXT:
        newObject = {
          ...newObject,
          content: EditorState.createEmpty(),
        };
      break;

      default:
        break;
    }

    const { objects, slides, currentSlide } = this.state;
    const result = addObject(objects, slides, currentSlide, newObject)

    this.setState({
        objects: result.objects,
        slides: result.slides
    }, () => this.updateSnapshot());
  }

  removeObject(id) {
    const { slides, objects, currentSlide } = this.state

    const result = removeObject(objects, slides, id, currentSlide)

    this.setState({
      activeObjectId: undefined,
      objects: result.objects,
      slides: result.slides
    }, () => this.updateSnapshot());
  }

  updateStatus(key, status) {
    this.setState({
      status: {
        ...this.state.status,
        [key]: status
      }
    });
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

      if(status[STATUS.IS_TAKING_SNAPSHOT])
        return

      html2canvas(element, {
        scale: 0.2,
        logging: false,
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
            [STATUS.IS_TAKING_SNAPSHOT]: false
          }
        });
      });
    }

    if(this.snapshotTimer) {
      clearTimeout(this.snapshotTimer);
      this.snapshotTimer = undefined;
    }

    this.snapshotTimer = setTimeout(() => {
      this.setState({
        status: {
          ...status,
          [STATUS.IS_TAKING_SNAPSHOT]: true
        }
      }, takeSnapshot());
    }, 2000);
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

      /**
       * Handle hide and show editor panel
       * once an object is focused
       */

      /* If the current object is undefined */
      if(!objects[id])
        return this.hideAllDialogs();

      else
        return this.showOneDialog(DIALOG.EDITOR_PANEL)
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
      this.updateObject(id, { attr })
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

  handleKeyDown(e) {
    const { status, activeObjectId } = this.state
    /* Check whether the text is being edited or an object is selected */
    if(status[STATUS.IS_EDITING_TEXT] || !activeObjectId)
      return

    switch (e.keyCode) {
      case 8: // DELETE
        this.removeObject(activeObjectId)
        break;

      default:
    }
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

    const objectType = (objects[activeObjectId] && objects[activeObjectId].type) ?
      objects[activeObjectId].type : undefined


    /**
     *  Construct editor configuration based on the object type
     */
    let editorConfig = {
      id: activeObjectId,

      attribute: objects[activeObjectId] ?
        objects[activeObjectId].attr : {},

      editorState: objects[activeObjectId] ?
        objects[activeObjectId].content : undefined,
    }

    switch (objectType) {
      case OBJECT_TYPE.IMAGE:
        editorConfig = {
          ...editorConfig,
          toolTypes: IMAGE_TOOL_TYPE,
          onChange: this.handleObjectChange
        }
        break;

      case OBJECT_TYPE.TEXT:
        editorConfig = {
          ...editorConfig,
          toolTypes: TEXT_TOOL_TYPE,
          onChange: this.handleTextChange
        }
        break;

      default:
    }

    // console.warn(this.state);

    return (
      <div className="builder">
        <SideTools
          visible={panels[PANEL.SIDE_TOOLS]}
          onClick={this.toggleDialog.bind(null, DIALOG.IMAGE_UPLOADER)}
          onToggle={this.togglePanel.bind(null, PANEL.SIDE_TOOLS)}
          onTextClick={this.addObject.bind(null, OBJECT_TYPE.TEXT)}
        />
        <div className="builder_content">
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
            onKeyDown={this.handleKeyDown}
            onBlur={this.updateStatus.bind(null, STATUS.IS_EDITING_TEXT, false)}
            onFocus={this.updateStatus.bind(null, STATUS.IS_EDITING_TEXT, true)}
            objects={objects}
            objectIds={slides[currentSlide].modes[mode].objectIds}
            onObjectClick={this.handleObjectClick}
            onTextChange={this.handleTextChange}
            activeId={activeObjectId}
            />
          <EditorPanel
            visible={dialogs[DIALOG.EDITOR_PANEL]}
            onToggle={this.toggleDialog.bind(null, DIALOG.EDITOR_PANEL)}
            >
            <Editor
              {...editorConfig}
              onBlur={this.updateStatus.bind(null, STATUS.IS_EDITING_TEXT, false)}
              onFocus={this.updateStatus.bind(null, STATUS.IS_EDITING_TEXT, true)}
              />
          </EditorPanel>
          <BottomBar
            mode={mode}
            currentSlide={currentSlide}
            onClick={this.changeCurrentSlideId}
            onDelete={this.removeSlide}
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
