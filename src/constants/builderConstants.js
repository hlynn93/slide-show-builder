import { RichUtils } from 'draft-js';

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
}

export const EDITOR_TYPE = {
  OBJECT: 'OBJECT',
  IMAGE: 'IMAGE',
  TEXT: 'TEXT'
}

export const TEXT_TOOL_TYPE = {
  INLINE_STYLE_BUTTONS: 'INLINE_STYLE_BUTTONS',
  BLOCK_TYPE_DROPDOWN: 'BLOCK_TYPE_DROPDOWN',
  BLOCK_TYPE_BUTTONS: 'BLOCK_TYPE_BUTTONS'
}

export const IMAGE_TOOL_TYPE = {
  ROTATION: 'rotation',
}

export const TRANSITION = {
  FADE_LEFT: 'fadeLeft',
  SLIDE_LEFT: 'slideLeft'
}

export const EASING = {
  EASE_IN: 'ease-in',
}

export const EDITOR_TOOLBAR_CONFIG = {
  [IMAGE_TOOL_TYPE.ROTATION]: {
    type: TOOLBAR_TYPE.SLIDER,
    item: {
      min: 0,
      max: 360,
    },
    format: value => ({ [IMAGE_TOOL_TYPE.ROTATION]: value })
  },
  [TEXT_TOOL_TYPE.INLINE_STYLE_BUTTONS]: {
    type: TOOLBAR_TYPE.BUTTON,
    items: [
      {label: 'Bold', value: 'BOLD'},
      {label: 'Italic', value: 'ITALIC'},
      {label: 'Underline', value: 'UNDERLINE'}
    ],
    format: (style, state) => RichUtils.toggleInlineStyle(state, style)
  },
  [TEXT_TOOL_TYPE.BLOCK_TYPE_DROPDOWN]: {
    type: TOOLBAR_TYPE.SELECT,
    items: [
      {label: 'Normal', value: 'unstyled'},
      {label: 'Heading Large', value: 'header-one'},
      {label: 'Heading Medium', value: 'header-two'},
      {label: 'Heading Small', value: 'header-three'}
    ],
    format: (style, state) => RichUtils.toggleBlockType(state, style)
  },
  [TEXT_TOOL_TYPE.BLOCK_TYPE_BUTTONS]: {
    type: TOOLBAR_TYPE.BUTTON,
    items: [
      {label: 'UL', value: 'unordered-list-item'},
      {label: 'OL', value: 'ordered-list-item'}
    ],
    format: (style, state) => RichUtils.toggleBlockType(state, style)
  }
}
