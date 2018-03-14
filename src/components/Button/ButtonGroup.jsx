import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import IconButton from './IconButton';

import './Button.scss';

const ButtonGroup = ({
  items,
  activeIds,
  onClick,
  children
}) => {

  if(isEmpty(items))
    return (
      <div className="button_group">
        {children}
      </div>
    )

  const controls = items.map((item,id) => (
    <IconButton
      key={id}
      item={item}
      onClick={onClick}
      isActive={activeIds[item.value]} />
  ))

  return (
    <div className="button_group">
      {controls}
    </div>
  );
};

ButtonGroup.propTypes = {
  items: PropTypes.array,
  activeIds: PropTypes.object,
  onClick: PropTypes.func,
  children: PropTypes.any
};

ButtonGroup.defaultProps = {
  items: [],
  activeIds: {},
  onClick: () => {}
};

export default ButtonGroup;
