import React from 'react';
import PropTypes from 'prop-types';
import { default as RangeSlider } from 'react-rangeslider'
import { Input } from 'element-react'

import './Form.scss';

const Slider = ({
  item,
  value,
  onChange,
  onFocus,
  onBlur
}) => {

  const handleChange = value => {
    onChange({ [item.value] : value })
  }

  return (
    <div key={item.value} className="editor_slider_wrapper">
        <RangeSlider
          className="editor_slider"
          min={item.min}
          max={item.max}
          value={value}
          onChange={handleChange}
        />
        <Input
          className="editor_slider_input"
          value={value || undefined}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
  );
};

Slider.propTypes = {
  item: PropTypes.object,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.number,
}

export default Slider;
