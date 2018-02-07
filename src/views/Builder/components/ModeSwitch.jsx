import React, { PureComponent } from 'react';
import { CANVAS_MODE } from '../../../constants/appConstants';
import PropTypes from 'prop-types';

class ScreenSwitcher extends PureComponent {
  render() {
    return (
      <div>
        <span onClick={this.props.onSelect.bind(null, CANVAS_MODE.DESKTOP)}> Desktop </span> |
        <span onClick={this.props.onSelect.bind(null, CANVAS_MODE.MOBILE)}> Mobile </span>
      </div>
    );
  }
}

ScreenSwitcher.propTypes = {
  onSelect: PropTypes.func,
};

export default ScreenSwitcher;
