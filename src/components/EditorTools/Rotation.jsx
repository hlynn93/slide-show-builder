import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-rangeslider'
import { Input } from 'element-react'

import './EditorTools.scss';

class Rotation extends PureComponent {

  handleChange(value) {
    const { item, onChange } = this.props
    onChange({ [item.value]: value })
  }

  render() {
      const {
        attr,
        onFocus,
        onBlur,
        item
      } = this.props;

      const value = attr[item.value] || 0
      return (
        <div key={item.value} className="editor_slider_wrapper">
          <Slider
            className="editor_slider"
            min={item.min}
            max={item.max}
            value={value}
            onChange={this.handleChange.bind(this)}
          />
          <Input
            className="editor_slider_input"
            value={value || undefined}
            onChange={this.handleChange.bind(this)}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      )
  }
}

Rotation.propTypes = {
  item: PropTypes.object,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  attr: PropTypes.object,
};


Rotation.defaultProps = {
  attr: {},
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
  toolTypes: {}
};

export default Rotation;
