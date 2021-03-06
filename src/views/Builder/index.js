import React, { PureComponent } from 'react';
import html2canvas from 'html2canvas';
import { EditorState } from 'draft-js';
import {
  cloneDeep,
  merge,
  mapValues,
  isEmpty
} from 'lodash';
import { Alert } from 'element-react';

import SideTools from './components/SideTools';
import Canvas from './components/Canvas';
import EditorPanel from './components/EditorPanel';
import Editor from './components/Editor';
import Preview from './components/Preview';
// import ImageUploader from './components/ImageUploader';
import BottomBar from './components/BottomBar';
import ModeSwitch from './components/ModeSwitch';
import Gallery from './components/Gallery';

import { getDecorators } from "./components/EditorTools/decorators";
import './Builder.scss';

/* To test data persistence.
  Remove this once the backend has bee integrated */
import data from '../../data/test.json';

import {
  generateId,
  removeSlide,
  addSlide,
  addObject,
  removeObject,
  prepareImport,
  prepareExport,
  formatState,
  addStateToHistory,
  shiftHistoryState
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
  history: {
    states: [],
    cursor: 0
  },
  scale: 1,
  alert: ''
}

class Builder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = isEmpty(data) ? DEFAULT_BUILDER_STATE : prepareImport(data)
    this.toggleDialog = this.toggleDialog.bind(this)
    this.togglePanel = this.togglePanel.bind(this)
    this.showOneDialog = this.showOneDialog.bind(this)
    this.showAlert = this.showAlert.bind(this)
    this.hideAllDialogs = this.hideAllDialogs.bind(this)
    this.addSlide = this.addSlide.bind(this)
    this.removeSlide = this.removeSlide.bind(this)
    this.addObject = this.addObject.bind(this)
    this.removeObject = this.removeObject.bind(this)
    this.addHistoryState = this.addHistoryState.bind(this)
    this.updateActiveObjectId = this.updateActiveObjectId.bind(this)
    this.changecurSlideIndexId = this.changecurSlideIndexId.bind(this)
    this.updateStatus = this.updateStatus.bind(this)
    this.updateSnapshot = this.updateSnapshot.bind(this)
    this.updateObject = this.updateObject.bind(this)
    this.updateHistory = this.updateHistory.bind(this)
    this.handleRedoClick = this.handleRedoClick.bind(this)
    this.handleUndoClick = this.handleUndoClick.bind(this)
    this.handleCanvasClick = this.handleCanvasClick.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
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

  showAlert(msg, duration=3000) {
    this.setState({ alert: msg });
    setTimeout(() => {
      this.setState({ alert: '' });
    }, duration);
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
      attr: DEFAULT_ATTRIBUTE,
    };

    switch (type) {
      case OBJECT_TYPE.IMAGE:
        newObject = merge(newObject, data, {
          id: `${newObject.id}--${data.id}`
        });
        break;

      case OBJECT_TYPE.TEXT:

       /*
        * For persisting editor state from the backend
        * Use convertFromRaw/convertToRaw APIs to convert between raw data and state
       */
        newObject = merge(newObject, {
          editorState: EditorState.createEmpty(getDecorators()),
          textAlign: 'left',
        });
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

  /**
   * Update the snapshot after 1 second of inactivity
   * to display at the bottom bar
  */
  updateSnapshot() {
    const { slides, curSlideIndex, mode } = this.state
    const slideIndex = curSlideIndex;

    const takeSnapshot = () => {
      this.addHistoryState();
      const element = document.getElementById('canvas')

      html2canvas(element, {
        scale: 0.2,
        logging: false,
        useCORS: true,
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
    }, 500);
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

  updateHistory(history) {
    this.setState({ history });
  }

  addHistoryState() {
    const state = formatState(this.state)
    this.updateHistory(addStateToHistory(this.state.history, state))
  }

  handleRedoClick() {
    const newHistory = shiftHistoryState(this.state.history, -1);
    this.setState({
      ...this.state,
      ...cloneDeep(newHistory.states[newHistory.cursor])
    }, () => this.updateHistory(newHistory));
  }

  handleUndoClick() {
    const newHistory = shiftHistoryState(this.state.history, +1);
    this.setState({
      ...this.state,
      ...cloneDeep(newHistory.states[newHistory.cursor])
    }, () => this.updateHistory(newHistory));
  }

  /*
  * (This is to test the state persistence)
  * Save and download the whole app state in a file
  * Copy and paste the resultant json in /data/test.json file
  */
  handleSave() {

    const save = (text, name, type) => {
      var a = document.createElement("a");
      var file = new Blob([text], {type: type});
      a.href = URL.createObjectURL(file);
      a.download = name;
      a.click();
    }
    const raw = prepareExport(this.state);
    save(JSON.stringify(raw), 'test.txt', 'text/plain');
    this.showAlert('The file has successfully been saved!')
  }

  handleModeSwitch(mode) {
    this.setState({ mode });
  }

  handleTextChange(id, editorState) {
    /*
      This is to handle cases such as text-alignment
      which are not part of editor state.
    */
   const key = editorState.objectKey
   if(key) {
    return this.updateObject(id, {
      [key]: editorState.value
    })
   }

    return this.updateObject(id, {
      editorState
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

  /* Change the attr of the object */
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

    /*
    * General key controls)
    */

    /* Cmd/Ctrl + Shift + Z */
    if (e.keyCode == 90 && e.shiftKey && (e.ctrlKey || e.metaKey)) {
      return this.handleRedoClick();
    }

    /* Cmd/Ctrl + Z */
    if (e.keyCode == 90 && (e.ctrlKey || e.metaKey)) {
      return this.handleUndoClick();
    }

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
      panels,
      alert,
      status
    } = this.state

    const objectType = (objects[activeObjectId] && objects[activeObjectId].type) ?
      objects[activeObjectId].type : undefined

    /**
     *  Construct editor configuration based on the object type
     */
    let editorConfig = {
      id: activeObjectId,
      object: objects[activeObjectId]
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
        {
          alert &&
          <Alert
            className="builder_alert"
            title="success alert"
            type="success"
            showIcon={true} />
        }
        <SideTools
          minimize={panels[PANEL.SIDE_TOOLS]}
          onImageClick={this.toggleDialog.bind(null, DIALOG.IMAGE_UPLOADER)}
          onToggle={this.togglePanel.bind(null, PANEL.SIDE_TOOLS)}
          onTextClick={this.addObject.bind(null, OBJECT_TYPE.TEXT)}
          onPreviewClick={this.toggleDialog.bind(null, DIALOG.PREVIEW)}
          onSaveClick={this.handleSave}
          onUndoClick={this.handleUndoClick}
          onRedoClick={this.handleRedoClick}
        />
        <div className="builder_content">
          <Gallery
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
            isTextFocused={status[STATUS.IS_EDITING_TEXT]}
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
{/* <ImageUploader
            visible={dialogs[DIALOG.IMAGE_UPLOADER]}
            onCancel={this.toggleDialog.bind(null, DIALOG.IMAGE_UPLOADER)}
            onImageChange={this.addObject}
            /> */}
