import React, { PureComponent } from 'react';
import { Button, Select } from 'element-react';
import { RichUtils } from 'draft-js';
import PropTypes from 'prop-types';

import Panel from '../../../components/Panel';
import { textToolTypes, textEditorToolbarConfig, toolbarTypes } from '../../../constants/appConstants';


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
      [textToolTypes.INLINE_STYLE_BUTTONS]: RichUtils.toggleInlineStyle,
      [textToolTypes.BLOCK_TYPE_BUTTONS]: RichUtils.toggleBlockType,
      [textToolTypes.BLOCK_TYPE_DROPDOWN]: RichUtils.toggleBlockType,
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

    const controls = Object.values(textToolTypes).map(toolId => {
      const toolItem = textEditorToolbarConfig[toolId]
      switch (toolItem.type) {
        case toolbarTypes.BUTTON:
          return this.renderButtonGroup(toolId, toolItem.items)

        case toolbarTypes.SELECT:
          return this.renderDropdown(toolId, toolItem.items)

        default: console.error("Invalid toolbar type");
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
