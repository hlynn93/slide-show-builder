import { RichUtils, EditorState, Modifier } from 'draft-js';
import {
  toggleCustomInlineStyle,
  setBlockData
} from 'draftjs-utils';

export const OBJECT_TYPE = {
  IMAGE: 'image',
  TEXT: 'text',
  AUDIO: 'audio',
  VIDEO: 'video'
}

export const CANVAS_MODE = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
}

export const ASPECT_RATIO = {
  [CANVAS_MODE.DESKTOP]: {
    width: 960,
    height: 600,
  },
  [CANVAS_MODE.MOBILE]: {
    width: 300,
    height: 640
  }
}

export const TOOLBAR_TYPE = {
  BUTTON: 'button',
  SELECT: 'select',
  SLIDER: 'slider',
  TEXTFIELD: 'textfield',
  BUTTON_DROPDOWN: 'buttonDropdown'
}

export const EDITOR_TYPE = {
  OBJECT: 'OBJECT',
  IMAGE: 'IMAGE',
  TEXT: 'TEXT'
}

export const TEXT_TOOL_TYPE = {
  INLINE: 'inline',
  BLOCK_TYPE: 'blockType',
  LIST: 'list',
  FONT_SIZE: 'fontSize',
  FONT_FAMILY: 'fontFamily',
  TEXT_ALIGN: 'textAlign',
  LINK: 'link',
  // COLOR_PICKER: 'colorPicker',
  // EMOJI: 'emoji',
  // HISTORY: 'history',
}

export const IMAGE_TOOL_TYPE = {
  ROTATION: 'rotation',
}

export const TRANSITION = {
  FADE: 'fade',
  BOUNCE: 'bounce',
  ROLL: 'roll',
  SLIDE: 'slide',
  FLIP: 'flip',
  REVEAL: 'reveal',
  ROTATE: 'rotate',
  LIGHTSPEED: 'lightspeed',
  ZOOM: 'zoom'
}

export const EASING = {
  EASE_IN: 'ease-in',
}

/**
 * TOOLBAR CONFIGURATIONS
*/
export const EDITOR_TOOLBAR_CONFIG = {
  [IMAGE_TOOL_TYPE.ROTATION]: {
    type: TOOLBAR_TYPE.SLIDER,
    item: {
      min: 0,
      max: 360,
    },
    format: value => ({ [IMAGE_TOOL_TYPE.ROTATION]: value })
  },

  [TEXT_TOOL_TYPE.INLINE]: {
    type: TOOLBAR_TYPE.BUTTON,
    items: [
      {label: 'Bold', value: 'BOLD'},
      {label: 'Italic', value: 'ITALIC'},
      {label: 'Underline', value: 'UNDERLINE'},
      {label: 'Strikethrough', value: 'STRIKETHROUGH'},
      {label: 'Monospace', value: 'CODE'},
      {label: 'Superscript', value: 'SUPERSCRIPT'},
      {label: 'Subscript', value: 'SUBSCRIPT'},
    ],
    format: (style, state) => {
      let newState = RichUtils.toggleInlineStyle(state, style)

      // Remove the initial subscript or superscript style from state
      if (style === 'SUBSCRIPT' || style === 'SUPERSCRIPT') {
        const removeStyle = style === 'SUBSCRIPT' ? 'SUPERSCRIPT' : 'SUBSCRIPT';
        const contentState = Modifier.removeInlineStyle(
          newState.getCurrentContent(),
          newState.getSelection(),
          removeStyle,
        );
        newState = EditorState.push(newState, contentState, 'change-inline-style');
      }

      return newState;
    }
  },
  [TEXT_TOOL_TYPE.BLOCK_TYPE]: {
    type: TOOLBAR_TYPE.SELECT,
    items: [
      { label: 'Normal', value: 'unstyled' },
      { label: 'H1', value: 'header-one' },
      { label: 'H2', value: 'header-two' },
      { label: 'H3', value: 'header-three' },
      { label: 'H4', value: 'header-four' },
      { label: 'H5', value: 'header-five' },
      { label: 'H6', value: 'header-six' },
      { label: 'Blockquote', value: 'blockquote' },
      { label: 'Code', value: 'code-block' },
    ],
    format: (style, state) => RichUtils.toggleBlockType(state, style)
  },
  [TEXT_TOOL_TYPE.LIST]: {
    type: TOOLBAR_TYPE.BUTTON,
    items: [
      {label: 'UL', value: 'unordered-list-item'},
      {label: 'OL', value: 'ordered-list-item'}
    ],
    format: (style, state) => RichUtils.toggleBlockType(state, style)
  },
  [TEXT_TOOL_TYPE.FONT_SIZE]: {
    type: TOOLBAR_TYPE.SELECT,
    items: [
      {label: '10', value: 10},
      {label: '14', value: 14},
      {label: '18', value: 18},
      {label: '24', value: 24}
    ],
    format: (fontSize, state) => toggleCustomInlineStyle(state, TEXT_TOOL_TYPE.FONT_SIZE, fontSize)
  },
  [TEXT_TOOL_TYPE.FONT_FAMILY]: {
    type: TOOLBAR_TYPE.SELECT,
    items: [
      {label: 'Arial', value: 'Arial'},
      {label: 'Georgia', value: 'Georgia'},
      {label: 'Impact', value: 'Impact'},
      {label: 'Tahoma', value: 'Tahoma'},
      {label: 'Times New Roman', value: 'Times New Roman'},
      {label: 'Verdana', value: 'Verdana'}
    ],
    format: (fontFamily, state) => toggleCustomInlineStyle(state, TEXT_TOOL_TYPE.FONT_FAMILY, fontFamily)
  },
  [TEXT_TOOL_TYPE.TEXT_ALIGN]: {
    type: TOOLBAR_TYPE.BUTTON,
    items: [
      {label: 'Left', value: 'left'},
      {label: 'Center', value: 'center'},
      {label: 'Right', value: 'right'},
      {label: 'Justify', value: 'justify'}
    ],
    format: (textAlign, state) => setBlockData(state, { 'text-align': textAlign })
  },
  [TEXT_TOOL_TYPE.TEXT_ALIGN]: {
    type: TOOLBAR_TYPE.BUTTON,
    items: [
      {label: 'Left', value: 'left'},
      {label: 'Center', value: 'center'},
      {label: 'Right', value: 'right'},
      {label: 'Justify', value: 'justify'}
    ],
    format: (textAlign, state) => setBlockData(state, { 'text-align': textAlign })
  },
  [TEXT_TOOL_TYPE.LINK]: {
    type: TOOLBAR_TYPE.BUTTON_DROPDOWN,
    item: { label: 'Link', value: 'link' },

    format: newState => newState
  },
}

  // let selection = state.getSelection();
  // const entityKey = state
  // .getCurrentContent()
  // .createEntity('LINK', 'MUTABLE', { url: data.target, targetOption: data.newTab })
  // .getLastCreatedEntityKey();

  // let contentState = Modifier.replaceText(
  //   state.getCurrentContent(),
  //   selection,
  //   `${data.title}`,
  //   state.getCurrentInlineStyle(),
  //   entityKey,
  // );

  // let newEditorState = EditorState.push(state, contentState, 'insert-characters');
  // selection = newEditorState.getSelection().merge({
  //   anchorOffset: selection.get('anchorOffset') + data.title.length,
  //   focusOffset: selection.get('anchorOffset') + data.title.length,
  // });
  // newEditorState = EditorState.acceptSelection(newEditorState, selection);
  // contentState = Modifier.insertText(
  //   newEditorState.getCurrentContent(),
  //   selection,
  //   ' ',
  //   newEditorState.getCurrentInlineStyle(),
  //   undefined,
  // );
  // return newEditorState
  // }
