import React, { PureComponent } from 'react';
import Slider from 'react-rangeslider'
import { Input, Button, Select } from 'element-react'
import PropTypes from 'prop-types';
import Link from '../../../components/EditorTools/Link';
import { Inline } from '../../../components/EditorTools';

import { EDITOR_TOOLBAR_CONFIG, TEXT_TOOL_TYPE } from '../../../constants/builderConstants';

import 'react-rangeslider/lib/index.css'
import './Editor.scss';

const mapIdToComponent = {
  [TEXT_TOOL_TYPE.INLINE]: props => <Inline {...props}/>,
}

class Editor extends PureComponent {
  constructor(props) {
    super(props);
    this.renderSlider = this.renderSlider.bind(this)
    this.renderButtonGroup = this.renderButtonGroup.bind(this)
    this.renderDropdown = this.renderDropdown.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(newState) {
    const { id, onChange } = this.props
    if(!id)
      return

    // If the value is one of the text-align values
    if(['left', 'right', 'justify', 'center'].indexOf(newState) > -1) {
      return onChange(id, newState, 'textAlign')
    }

    return onChange(id, newState)
  }

  renderCustom(toolId, tool) {
    const { onFocus, onBlur, editorState } = this.props;
    const { format } = tool
    switch (toolId) {
      case TEXT_TOOL_TYPE.LINK:
        return (
          <Link
            editorState={editorState}
            onFocus={onFocus}
            onBlur={onBlur}
            key={toolId}
            tool={tool}
            toolId={toolId}
            onChange={this.handleChange.bind(null, format)}
            />
        )

      default:
    }
  }

  renderSlider(toolId, tool) {
    const { attribute, onFocus, onBlur } = this.props;
    const { item, format } = tool
    const value = attribute[toolId] || 0
    return (
      <div key={toolId} className="editor_slider_wrapper">
        <Slider
          className="editor_slider"
          min={item.min}
          max={item.max}
          value={value}
          onChange={this.handleChange.bind(null, format)}
        />
        <Input
          className="editor_slider_input"
          value={value || undefined}
          onChange={this.handleChange.bind(null, format)}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
    )
  }

  renderButtonGroup(toolId, tool) {
    const { items, format } = tool
    return (
      <Button.Group
        key={toolId}
        className="button_group"
        >
        {
          items.map(el => (
            <Button
              key={el.label}
              className="button_icon"
              onClick={this.handleChange.bind(null, format, el.value)}
              >{el.label}</Button>
          ))
        }
      </Button.Group>
    )
  }

  renderDropdown(toolId, tool) {
    const { items, format } = tool
    const placeholder = (items && items.length > 0)
      ? items[0].label : "";
    return (
      <Select
        className="button_group"
        key={toolId}
        onChange={this.handleChange.bind(null, format)}
        placeholder={placeholder}>
        {
          items.map(el =>
            <Select.Option key={el.value} label={el.label} value={el.value} />
          )
        }
      </Select>
    )
  }

  render() {

    const {
      toolTypes,
      editorState,
      onBlur,
      onFocus
    } = this.props

    const controls = Object.values(toolTypes).map(toolId => {
      const toolItem = EDITOR_TOOLBAR_CONFIG[toolId]
      return mapIdToComponent[toolId]({
        ...toolItem,
        key: toolId,
        editorState: editorState,
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
  attribute: PropTypes.object,
  id: PropTypes.string,
  toolTypes: PropTypes.object,
  editorState: PropTypes.object,
};

Editor.defaultProps = {
  attribute: {},
  onChange: () => {},
  toolTypes: {}
};

export default Editor;
