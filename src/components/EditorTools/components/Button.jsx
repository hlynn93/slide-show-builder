import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'element-react';

import cx from 'classnames';
import '../EditorTools.scss'

const Button = ({
  item,
  onClick,
  isActive
}) => {
  const baseClass = "control"

  const button = (
    <div
      key={item.value}
      className={cx(
        baseClass,
        { [`${baseClass}--active`]: isActive }
      )}
      onClick={onClick.bind(null, item.value)}
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
        key={item.value}
        className="control_tooltip"
        effect="light"
        content={item.tooltip}
        placement="top-start"
        openDelay={1000}>
        {button}
      </Tooltip>
    )
};

Button.propTypes = {
  onClick: PropTypes.func,
  item: PropTypes.object,
  isActive: PropTypes.bool,
};

export default Button;
