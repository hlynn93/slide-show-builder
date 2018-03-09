import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'element-react';

import cx from 'classnames';
import '../EditorTools.scss'

class IconButton extends PureComponent {
  render() {
    const {
      item,
      onClick,
      isActive,
      ...props
    } = this.props
    const baseClass = "control"

    const button = (
      <div
        {...props}
        key={item.value}
        className={cx(
          baseClass,
          { [`${baseClass}--active`]: isActive }
        )}
        onMouseDown={(e) => {
          /* To prevent loss of focus on the editor */
          e.preventDefault();
          onClick(item.value);
        }}
        >
        { item.image ?
          <img src={process.env.PUBLIC_URL + `/images/icons/editor/${item.image}.png`} className="control_icon" />
          :
          item.label
        }
      </div>
    )

    if(!item.tooltip) return button;

    return (
      <Tooltip
        {...props}
        key={item.value}
        className="control_tooltip"
        effect="light"
        content={item.tooltip}
        placement="top-start"
        openDelay={1000}>
        {button}
      </Tooltip>
    )
  }
}

IconButton.propTypes = {
  onClick: PropTypes.func,
  item: PropTypes.object,
  isActive: PropTypes.bool,
};

IconButton.defaultProps = {
  item: {},
  isActive: false,
  onClick: () => {}
}

export default IconButton;
