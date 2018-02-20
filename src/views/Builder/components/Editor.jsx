import React, { PureComponent } from 'react';
import Slider from 'react-rangeslider'
import { Input, Button, Select } from 'element-react'
import PropTypes from 'prop-types';

import { EDITOR_TOOLBAR_CONFIG, TOOLBAR_TYPES } from '../../../constants/appConstants';

import 'react-rangeslider/lib/index.css'
import './Editor.scss';

class Editor extends PureComponent {
  constructor(props) {
    super(props);
    this.renderSlider = this.renderSlider.bind(this)
    this.renderButtonGroup = this.renderButtonGroup.bind(this)
    this.renderDropdown = this.renderDropdown.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(format, value) {
    const { id, onChange, editorState } = this.props
    console.warn(format, value);
    if(!id)
      return

    onChange(id, format(value, editorState))
  }

  renderSlider(toolId, tool) {
    const { attribute } = this.props;
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

    const { toolTypes } = this.props

    const controls = Object.values(toolTypes).map(toolId => {
      const toolItem = EDITOR_TOOLBAR_CONFIG[toolId]
      switch (toolItem.type) {
        case TOOLBAR_TYPES.SLIDER:
          return this.renderSlider(toolId, toolItem)

        case TOOLBAR_TYPES.BUTTON:
          return this.renderButtonGroup(toolId, toolItem)

        case TOOLBAR_TYPES.SELECT:
          return this.renderDropdown(toolId, toolItem)

        default:
          break;
      }
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
