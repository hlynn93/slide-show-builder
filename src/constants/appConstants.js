import { RichUtils } from 'draft-js';

export const LANGUAGES = {
  English: 'en',
  Espanol: 'es'
}

export const OBJECT_TYPES = {
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

export const TOOLBAR_TYPES = {
  BUTTON: 'button',
  SELECT: 'select',
  SLIDER: 'slider',
  TEXTFIELD: 'textfield',
}

export const EDITOR_TYPES = {
  OBJECT: 'OBJECT',
  IMAGE: 'IMAGE',
  TEXT: 'TEXT'
}

export const TEXT_TOOL_TYPES = {
  INLINE_STYLE_BUTTONS: 'INLINE_STYLE_BUTTONS',
  BLOCK_TYPE_DROPDOWN: 'BLOCK_TYPE_DROPDOWN',
  BLOCK_TYPE_BUTTONS: 'BLOCK_TYPE_BUTTONS'
}

export const IMAGE_TOOL_TYPES = {
  ROTATION: 'rotation',
}

export const EDITOR_TOOLBAR_CONFIG = {
  [IMAGE_TOOL_TYPES.ROTATION]: {
    type: TOOLBAR_TYPES.SLIDER,
    item: {
      min: 0,
      max: 360,
    },
    format: value => ({ [IMAGE_TOOL_TYPES.ROTATION]: value })
  },
  [TEXT_TOOL_TYPES.INLINE_STYLE_BUTTONS]: {
    type: TOOLBAR_TYPES.BUTTON,
    items: [
      {label: 'Bold', value: 'BOLD'},
      {label: 'Italic', value: 'ITALIC'},
      {label: 'Underline', value: 'UNDERLINE'}
    ],
    format: (style, state) => RichUtils.toggleInlineStyle(state, style)
  },
  [TEXT_TOOL_TYPES.BLOCK_TYPE_DROPDOWN]: {
    type: TOOLBAR_TYPES.SELECT,
    items: [
      {label: 'Normal', value: 'unstyled'},
      {label: 'Heading Large', value: 'header-one'},
      {label: 'Heading Medium', value: 'header-two'},
      {label: 'Heading Small', value: 'header-three'}
    ],
    format: (style, state) => RichUtils.toggleBlockType(state, style)
  },
  [TEXT_TOOL_TYPES.BLOCK_TYPE_BUTTONS]: {
    type: TOOLBAR_TYPES.BUTTON,
    items: [
      {label: 'UL', value: 'unordered-list-item'},
      {label: 'OL', value: 'ordered-list-item'}
    ],
    format: (style, state) => RichUtils.toggleBlockType(state, style)
  }
}
