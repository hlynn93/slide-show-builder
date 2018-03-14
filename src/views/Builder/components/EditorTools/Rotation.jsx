import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Slider from '../../../../components/Form/Slider'

class Rotation extends PureComponent {

  render() {
      const { attr, item } = this.props;

      const value = attr[item.value] || 0
      return (
        <Slider
          {...this.props}
          value={value}
        />
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
