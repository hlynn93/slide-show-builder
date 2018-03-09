import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Inline,
  Block,
  List,
  FontSize,
  FontFamily,
  LineHeight,
  TextAlign,
  Link,
  Rotation
} from '../../../components/EditorTools';

import { EDITOR_TOOLBAR_CONFIG, TEXT_TOOL_TYPE, IMAGE_TOOL_TYPE } from '../../../constants/builderConstants';

import 'react-rangeslider/lib/index.css'
import './Editor.scss';

const mapIdToComponent = {
  [TEXT_TOOL_TYPE.INLINE]: props => <Inline {...props}/>,
  [TEXT_TOOL_TYPE.BLOCK_TYPE]: props => <Block {...props}/>,
  [TEXT_TOOL_TYPE.LIST]: props => <List {...props}/>,
  [TEXT_TOOL_TYPE.FONT_SIZE]: props => <FontSize {...props}/>,
  [TEXT_TOOL_TYPE.FONT_FAMILY]: props => <FontFamily {...props}/>,
  [TEXT_TOOL_TYPE.LINE_HEIGHT]: props => <LineHeight {...props}/>,
  [TEXT_TOOL_TYPE.TEXT_ALIGN]: props => <TextAlign {...props}/>,
  [TEXT_TOOL_TYPE.LINK]: props => <Link {...props}/>,

  [IMAGE_TOOL_TYPE.ROTATION]: props => <Rotation {...props}/>,
}

class Editor extends PureComponent {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
  }

  /*
    newState can either be
    an editorState object ({ ...editorState }),
    text-align value ('center') or
    an object's attr ({ rotation: '34' })
  */
  handleChange(newState) {
    const { id, onChange } = this.props
    if(!id)
      return

    // If the value is one of the text-align values
    if(['left', 'right', 'justify', 'center'].indexOf(newState) > -1) {
      return onChange(id, {
        objectKey: 'textAlign',
        value: newState,
      })
    }

    return onChange(id, newState)
  }

  render() {

    const {
      toolTypes,
      onBlur,
      onFocus,
      object
    } = this.props

    const controls = Object.values(toolTypes).map(toolId => {
      const toolItem = EDITOR_TOOLBAR_CONFIG[toolId]

      return mapIdToComponent[toolId]({
        ...toolItem,
        ...object,
        key: toolId,
        onBlur: onBlur,
        onFocus: onFocus,
        onChange: this.handleChange
      })
    })

    return (
      <div className="editor">
        { controls }
      </div>
    );
  }
}

Editor.propTypes = {
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  object: PropTypes.object,
  id: PropTypes.string,
  toolTypes: PropTypes.object,
  editorState: PropTypes.object,
  textAlign: PropTypes.string,
};

Editor.defaultProps = {
  object: {},
  onChange: () => {},
  toolTypes: {}
};

export default Editor;
