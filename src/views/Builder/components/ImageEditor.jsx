import React, { PureComponent } from 'react';
import Slider from 'react-rangeslider'
import { Input } from 'element-react'
import PropTypes from 'prop-types';

import Panel from '../../../components/Panel';
import { IMAGE_TOOL_TYPES, EDITOR_TOOLBAR_CONFIG, TOOLBAR_TYPES } from '../../../constants/appConstants';

import 'react-rangeslider/lib/index.css'
import './ImageEditor.scss';

class ImageEditor extends PureComponent {
  constructor(props) {
    super(props);
    this.renderSlider = this.renderSlider.bind(this)
  }

  renderSlider(objectId, toolId, item) {
    const { attribute } = this.props;
    const value = attribute[toolId] || 0
    return (
      <div key={toolId} className="editor_slider_wrapper">
        <Slider
          className="editor_slider"
          min={item.min}
          max={item.max}
          value={value}
          onChange={value => this.props.onChange(objectId, { [toolId]: value })}
        />
        <Input
          className="editor_slider_input"
          value={value || undefined}
          onChange={value => this.props.onChange(objectId, { [toolId]: value })}
        />
      </div>
    )
  }

  render() {

    const { visible, onToggle, id } = this.props

    const controls = Object.values(IMAGE_TOOL_TYPES).map(toolId => {
      const toolItem = EDITOR_TOOLBAR_CONFIG[toolId]
      switch (toolItem.type) {
        case TOOLBAR_TYPES.SLIDER:
          return this.renderSlider(id, toolId, toolItem.item)

        default:
          break;
      }
    })
    return (
      <Panel
        position={{ x: 0, y: 100 }}
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

ImageEditor.propTypes = {
  visible: PropTypes.bool,
  onToggle: PropTypes.func,
  onChange: PropTypes.func,
  attribute: PropTypes.object,
  id: PropTypes.string,
};

ImageEditor.defaultProps = {
  visible: false,
  attribute: {},
  onToggle: () => {},
  onChange: () => {},
};

export default ImageEditor;
