import React, { PureComponent } from 'react';
import Slider from 'react-rangeslider'
import PropTypes from 'prop-types';

import Panel from '../../../components/Panel';
import { imageToolTypes, imageEditorToolbarConfig, toolbarTypes } from '../../../constants/appConstants';

import 'react-rangeslider/lib/index.css'
import './ImageEditor.scss';

class ImageEditor extends PureComponent {
  constructor(props) {
    super(props);
    this.renderSlider = this.renderSlider.bind(this)
  }

  renderSlider(objectId, toolId, item) {
    const { attribute } = this.props;
    return (
      <Slider
        key={toolId}
        className="editor_slider"
        min={item.min}
        max={item.max}
        value={attribute[toolId] || 0}
        onChange={value => this.props.onChange(objectId, { [toolId]: value })}
      />
    )
  }

  render() {

    const { visible, onToggle, id } = this.props

    const controls = Object.values(imageToolTypes).map(toolId => {
      const toolItem = imageEditorToolbarConfig[toolId]
      switch (toolItem.type) {
        case toolbarTypes.SLIDER:
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
