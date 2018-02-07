import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import './Sidebar.scss';

const Sidebar = ({
  className,
  ...props
}) => {

  const classes = cx(
    'sidebar',
    className
  )

  return (
    <div className={classes} {...props}>

    </div>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
};

export default Sidebar;
