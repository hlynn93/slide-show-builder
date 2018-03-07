import { toggleCustomInlineStyle } from '../utils/rtfUtils';

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
  CUSTOM: 'custom'
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
  // FONT_SIZE: 'fontSize',
  // FONT_FAMILY: 'fontFamily',
  // LINE_HEIGHT: 'lineHeight',
  // TEXT_ALIGN: 'textAlign',
  // LINK: 'link',

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
    items: [
      {
        value: 'BOLD',
        image: 'bold'
      },
      {
        image: 'italic',
        value: 'ITALIC'
      },
      {
        image: 'underline',
        value: 'UNDERLINE'
      },
      {
        image: 'strikethrough',
        value: 'STRIKETHROUGH'
      },
      {
        image: 'code',
        value: 'CODE'
      },
      {
        image: 'superscript',
        value: 'SUPERSCRIPT'
      },
      {
        image: 'subscript',
        value: 'SUBSCRIPT'
      },
    ],
  },
  [TEXT_TOOL_TYPE.BLOCK_TYPE]: {
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
  },
  [TEXT_TOOL_TYPE.LIST]: {
    items: [
      {
        image: 'unordered-list',
        value: 'unordered-list-item'
      },
      {
        image: 'ordered-list',
        value: 'ordered-list-item'
      },
      {
        image: 'right-indent',
        value: 'right-indent'
      },
      {
        image: 'left-indent',
        value: 'left-indent'
      },
    ]
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
  [TEXT_TOOL_TYPE.LINE_HEIGHT]: {
    type: TOOLBAR_TYPE.SELECT,
    items: [
      {label: '10', value: '10'},
      {label: '20', value: '20'},
    ],
    format: (toggledColor, editorState) => {
      return toggleCustomInlineStyle(editorState, 'lineHeight', toggledColor)
    }
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
    format: (textAlign, state) => toggleCustomInlineStyle(state, TEXT_TOOL_TYPE.TEXT_ALIGN, textAlign)
  },
  [TEXT_TOOL_TYPE.LINK]: {
    type: TOOLBAR_TYPE.CUSTOM,
    link: { label: 'Link', value: 'link' },
    unlink: { label: 'Unlink', value: 'link' },
    format: newState => newState
  },
}
