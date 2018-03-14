import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'element-react'
import './Form.scss';

const Dropdown = ({
  items,
  activeId,
  onChange,
  placeholder
}) => {

  return (
    <Select
      value={activeId}
      placeholder={placeholder}
      className="control_group"
      onChange={onChange}>
      {
        items.map(el =>
          <Select.Option key={el.value} label={el.label} value={el.value} />
        )
      }
    </Select>
  );
};

Dropdown.propTypes = {
  items: PropTypes.array,
  activeId: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

Dropdown.defaultProps = {
  items: [],
  onChange: () => {}
}

export default Dropdown;
