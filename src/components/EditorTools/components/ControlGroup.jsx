import React from 'react';
import PropTypes from 'prop-types';

import IconButton from './IconButton';

import '../EditorTools.scss';

const ControlGroup = ({
  items,
  activeIds,
  onClick
}) => {

  const controls = items.map((item,id) => (
    <IconButton
      key={id}
      item={item}
      onClick={onClick}
      isActive={activeIds[item.value]} />
  ))

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
