import React, { PureComponent } from 'react';
import { CANVAS_MODE } from '../../../constants/builderConstants';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './ModeSwitch.scss';

class ScreenSwitcher extends PureComponent {
  render() {
    const { mode, onSelect } = this.props

    const modes = [CANVAS_MODE.DESKTOP, CANVAS_MODE.MOBILE]
    const switches = modes.map(m =>
      <span
        key={m}
        className={getClass(m, mode)}
        onClick={onSelect.bind(null, m)}>
        {m.toUpperCase()}
      </span>
    )

    return (
      <div className="switches">
          {switches}
      </div>
    );
  }
}

/**
 * Insert the class 'active' if the currentMode === mode
 */
const baseClass = 'switch_text'
const getClass = (mode, currentMode) => cx(
  baseClass,
  { [`${baseClass}--active`]: mode === currentMode }
)

ScreenSwitcher.propTypes = {
  onSelect: PropTypes.func,
  mode: PropTypes.string,
};

export default ScreenSwitcher;
