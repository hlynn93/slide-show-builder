import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Tooltip } from 'element-react';

import '../EditorTools.scss';

const ControlGroup = ({
  items,
  activeIds,
  onClick
}) => {

  const controls = items.map(item => {
    const baseClass = "control"
    const button = (
      <div
        key={item.value}
        className={cx(
          baseClass,
          { [`${baseClass}--active`]: activeIds[item.value] }
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
        className="item"
        effect="dark"
        content={item.tooltip}
        placement="top-start">
        {button}
      </Tooltip>
    )

  })


  return (
    <div className="control_group">
      {controls}
    </div>
  );
};

ControlGroup.propTypes = {
  items: PropTypes.array,
  activeIds: PropTypes.object,
  onClick: PropTypes.func,
};

ControlGroup.defaultProps = {
  items: [],
  activeIds: {},
  onClick: () => {}
};

export default ControlGroup;
