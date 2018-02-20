import React, { PureComponent } from 'react';
import { Button, Select } from 'element-react';
import { RichUtils } from 'draft-js';
import PropTypes from 'prop-types';

import Panel from '../../../components/Panel';
import { TEXT_TOOL_TYPES, EDITOR_TOOLBAR_CONFIG, TOOLBAR_TYPES } from '../../../constants/appConstants';


import './TextEditor.scss'

class TextEditor extends PureComponent {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this)
  }


  onClick(type, style) {
    const { onClick, editorState, id } = this.props

    if(!id)
      return

    const typeMapping = {
      [TEXT_TOOL_TYPES.INLINE_STYLE_BUTTONS]: RichUtils.toggleInlineStyle,
      [TEXT_TOOL_TYPES.BLOCK_TYPE_BUTTONS]: RichUtils.toggleBlockType,
      [TEXT_TOOL_TYPES.BLOCK_TYPE_DROPDOWN]: RichUtils.toggleBlockType,
    }

    onClick(
      id,
      typeMapping[type](
        editorState, style
      )
    )
  }

  renderButtonGroup(id, items) {
    return (
      <Button.Group
        key={id}
        className="button_group"
        >
        {
          items.map(el => (
            <Button
              key={el.label}
              className="button_icon"
              onClick={this.onClick.bind(null, id, el.style)}
              >{el.label}</Button>
          ))
        }
      </Button.Group>
    )
  }

  renderDropdown(id, items) {
    const placeholder = (items && items.length > 0)
      ? items[0].label : "";
    return (
      <Select
        className="button_group"
        key={id}
        onChange={this.onClick.bind(null, id)}
        placeholder={placeholder}>
        {
          items.map(el =>
            <Select.Option key={el.style} label={el.label} value={el.style} />
          )
        }
      </Select>
    )
  }

  render() {

    const { visible, onToggle } = this.props

    const controls = Object.values(TEXT_TOOL_TYPES).map(toolId => {
      const toolItem = EDITOR_TOOLBAR_CONFIG[toolId]
      switch (toolItem.type) {
        case TOOLBAR_TYPES.BUTTON:
          return this.renderButtonGroup(toolId, toolItem.items)

        case TOOLBAR_TYPES.SELECT:
          return this.renderDropdown(toolId, toolItem.items)

        default: throw "Invalid toolbar type";
      }
    })

    return (
      <Panel
        className="text_editor"
        minimize={!visible}
        onToggle={onToggle}
        >
        <div className="text_editor_inner">
          { controls }
        </div>
      </Panel>
    );
  }
}

TextEditor.propTypes = {
  onClick: PropTypes.func,
  editorState: PropTypes.object,
  onToggle: PropTypes.func,
  id: PropTypes.string,
  visible: PropTypes.bool,
};

export default TextEditor;
