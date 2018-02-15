import React, { PureComponent } from 'react';
import { Slider } from 'element-react';
import PropTypes from 'prop-types';

import Panel from '../../../components/Panel';
import { imageToolTypes, imageEditorToolbarConfig, toolbarTypes } from '../../../constants/appConstants';

import './ImageEditor.scss';

class ImageEditor extends PureComponent {
  constructor(props) {
    super(props);
    this.renderSlider = this.renderSlider.bind(this)
  }

  renderSlider(id, item) {
    return (
      <Slider
        className="editor_slider"
        key={id}
        min={item.min}
        max={item.max}
        value={this.props.attribute.rotate || 0}
        showInput={true}
        showInputControls={false}
        onChange={value => this.props.onChange(this.props.id, { rotation: value })}
      />
    )
  }

  render() {

    const { visible, onToggle } = this.props

    const controls = Object.values(imageToolTypes).map(toolId => {
      const toolItem = imageEditorToolbarConfig[toolId]
      switch (toolItem.type) {
        case toolbarTypes.SLIDER:
          return this.renderSlider(toolId, toolItem.item)

        default:
          break;
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
