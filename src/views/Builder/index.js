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
import EditorPanel from './components/EditorPanel';
import Editor from './components/Editor';
import Preview from './components/Preview';
import ImageUploader from './components/ImageUploader';
import BottomBar from './components/BottomBar';
import ModeSwitch from './components/ModeSwitch';
import './Builder.scss';

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
  TEXT_TOOL_TYPE,
  TRANSITION,
  EASING
} from '../../constants/builderConstants';

const DIALOG = {
  IMAGE_UPLOADER: 'imageUploader',
  PREVIEW: 'preview',
  EDITOR_PANEL: 'editorPanel',
}

const PANEL = {
  SIDE_TOOLS: 'sideTools'
}

const STATUS = {
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
  },
  transition: {
    type: TRANSITION.FADE_LEFT,
    easing: EASING.EASE_IN
  }
}

const DEFAULT_ATTRIBUTE = {
  width: 200,
  height: undefined,
  x: 0,
  y: 0
}

const DEFAULT_BUILDER_STATE = {
  objects: {},
  slides: [ cloneDeep(NEW_SLIDE) ],
  activeObjectId: undefined,
  curSlideIndex: 0,
  mode: CANVAS_MODE.DESKTOP,
  dialogs: {
    [DIALOG.IMAGE_UPLOADER]: false,
    [DIALOG.EDITOR_PANEL]: false,
    [DIALOG.PREVIEW]: false
  },
  panels: {
    [PANEL.SIDE_TOOLS]: true
  },
  status: {
    [STATUS.IS_EDITING_TEXT]: false,
  },
  scale: 1,
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
    this.changecurSlideIndexId = this.changecurSlideIndexId.bind(this)
    this.updateStatus = this.updateStatus.bind(this)
    this.updateSnapshot = this.updateSnapshot.bind(this)
    this.updateObject = this.updateObject.bind(this)
    this.handleCanvasClick = this.handleCanvasClick.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleModeSwitch = this.handleModeSwitch.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.handleObjectChange = this.handleObjectChange.bind(this)
    this.handleObjectClick = this.handleObjectClick.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  componentDidMount() {
    this.updateSnapshot();
    document.addEventListener("keydown", this.handleKeyDown);
  }

  toggleDialog(key, e) {
    if(e) e.preventDefault();

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
        curSlideIndex: index,
        slides: newSlides
    }, ()=> this.updateSnapshot());
  }

  removeSlide(index, e) {
    if(e)
      e.stopPropagation();

    const { slides, objects, curSlideIndex } = this.state
    const result = removeSlide(objects, slides, index);

    this.setState({
      objects: result.objects,
      slides: result.slides,
      curSlideIndex: index > curSlideIndex ? curSlideIndex : Math.max(0, curSlideIndex - 1)
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

    const { objects, slides, curSlideIndex } = this.state;
    const result = addObject(objects, slides, curSlideIndex, newObject)

    this.setState({
        objects: result.objects,
        slides: result.slides
    }, () => this.updateSnapshot());
  }

  removeObject(id) {
    const { slides, objects, curSlideIndex } = this.state

    const result = removeObject(objects, slides, id, curSlideIndex)

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

  changecurSlideIndexId(id) {
    this.setState({ curSlideIndex: id });
  }

  updateSnapshot() {
    const { slides, curSlideIndex, mode } = this.state
    const slideIndex = curSlideIndex;

    const takeSnapshot = () => {
      const element = document.getElementById('canvas')

      html2canvas(element, {
        scale: 0.2,
        logging: false,
      })
      .then(canvas => {
        /* Export the canvas to its data URI representation */
        const base64image = canvas.toDataURL("image/png");

        /* Check if the slide still exists in the deck */
        if(slideIndex !== this.state.curSlideIndex) {
          return;
        }

        /** Create a new slide object with the updated snapshot value */
        const newSlide = {
          ...slides[slideIndex],
          modes: {
            ...slides[slideIndex].modes,
            [mode]: {
              ...slides[slideIndex].modes[mode],
              snapshot: base64image
            }
          }
        }
        const newSlides = slides.slice(0);
        newSlides[slideIndex] = newSlide;

        this.setState({
          slides: newSlides,
        });
      });
    }

    if(this.snapshotTimer) {
      clearTimeout(this.snapshotTimer);
      this.snapshotTimer = undefined;
    }

    this.snapshotTimer = setTimeout(() => {
      takeSnapshot();
    }, 1000);
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

  handleResize(id, event, direction, ref, delta, position) {
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

  handleDrag(id, e, d) {

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
    const { status, activeObjectId, curSlideIndex, slides, objects } = this.state
    /* Check whether the text is being edited or an object is selected */
    if(status[STATUS.IS_EDITING_TEXT])
      return

    if(objects[activeObjectId]) {
      switch (e.keyCode) {
        case 8: // DELETE
          if (activeObjectId)
            this.removeObject(activeObjectId)
          break;

        case 37: { // Left arrow
          const objectAttr = this.state.objects[activeObjectId].attr
          this.updateObject(activeObjectId, {
            attr: {
              x: objectAttr.x - 1,
            }
          })
          break;
        }

        case 38: { // Down arrow
          const objectAttr = this.state.objects[activeObjectId].attr
          this.updateObject(activeObjectId, {
            attr: {
              y: objectAttr.y - 1,
            }
          })
          break;
        }

        case 39: { // Right arrow
          const objectAttr = this.state.objects[activeObjectId].attr
          this.updateObject(activeObjectId, {
            attr: {
              x: objectAttr.x + 1,
            }
          })
          break;
        }

        case 40: { // Up arrow
          const objectAttr = this.state.objects[activeObjectId].attr
          this.updateObject(activeObjectId, {
            attr: {
              y: objectAttr.y + 1,
            }
          })
          break;
        }

        default:
      }
    }
    else if(slides[curSlideIndex]) {
      switch (e.keyCode) {
        case 8: // DELETE
          this.removeSlide(curSlideIndex)
          break;

        case 39: // Right arrow
          this.setState({
            curSlideIndex: Math.min(slides.length - 1, curSlideIndex + 1)
          });
          break;

        case 37: // Left arrow
          this.setState({
            curSlideIndex: Math.max(0, curSlideIndex - 1)
          });
          break;

        default:
      }
    }
  }

  render() {
    const {
      mode,
      objects,
      slides,
      activeObjectId,
      curSlideIndex,
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

    const previewScale = 0.7
    const objectIds = slides[curSlideIndex] ? slides[curSlideIndex].modes[mode].objectIds : []

    return (
      <div className="builder">
        <SideTools
          minimize={panels[PANEL.SIDE_TOOLS]}
          onClick={this.toggleDialog.bind(null, DIALOG.IMAGE_UPLOADER)}
          onToggle={this.togglePanel.bind(null, PANEL.SIDE_TOOLS)}
          onTextClick={this.addObject.bind(null, OBJECT_TYPE.TEXT)}
          onPreview={this.toggleDialog.bind(null, DIALOG.PREVIEW)}
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
            onResize={this.handleResize}
            onDrag={this.handleDrag}
            onBlur={this.updateStatus.bind(null, STATUS.IS_EDITING_TEXT, false)}
            onFocus={this.updateStatus.bind(null, STATUS.IS_EDITING_TEXT, true)}
            objects={objects}
            objectIds={objectIds}
            onObjectClick={this.handleObjectClick}
            onTextChange={this.handleTextChange}
            activeId={activeObjectId}
            />
          <EditorPanel
            hide={!activeObjectId}
            minimize={dialogs[DIALOG.EDITOR_PANEL]}
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
            curSlideIndex={curSlideIndex}
            onClick={this.changecurSlideIndexId}
            onDelete={this.removeSlide}
            onAdd={this.addSlide}
            slides={slides}
            />
          <Preview
            visible={dialogs[DIALOG.PREVIEW]}
            onCancel={this.toggleDialog.bind(null, DIALOG.PREVIEW)}
            mode={mode}
            scale={previewScale}
            objects={objects}
            curSlideIndex={curSlideIndex}
            objectIds={objectIds}
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
