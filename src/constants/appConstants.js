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

export const textToolTypes = {
  INLINE_STYLE_BUTTONS: 'INLINE_STYLE_BUTTONS',
  BLOCK_TYPE_DROPDOWN: 'BLOCK_TYPE_DROPDOWN',
  BLOCK_TYPE_BUTTONS: 'BLOCK_TYPE_BUTTONS'
}

export const toolbarTypes = {
  BUTTON: 'button',
  SELECT: 'select'
}

export const textEditorToolbarConfig = {
  display: Object.values(textToolTypes),
  [textToolTypes.INLINE_STYLE_BUTTONS]: {
    type: toolbarTypes.BUTTON,
    items: [
      {label: 'Bold', style: 'BOLD'},
      {label: 'Italic', style: 'ITALIC'},
      {label: 'Underline', style: 'UNDERLINE'}
    ]
  },
  [textToolTypes.BLOCK_TYPE_DROPDOWN]: {
    type: toolbarTypes.SELECT,
    items: [
      {label: 'Normal', style: 'unstyled'},
      {label: 'Heading Large', style: 'header-one'},
      {label: 'Heading Medium', style: 'header-two'},
      {label: 'Heading Small', style: 'header-three'}
    ]
  },
  [textToolTypes.BLOCK_TYPE_BUTTONS]: {
    type: toolbarTypes.BUTTON,
    items: [
      {label: 'UL', style: 'unordered-list-item'},
      {label: 'OL', style: 'ordered-list-item'}
    ]
  }
}
