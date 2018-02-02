import React, { PureComponent } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import './Sidebar.scss';

class Sidebar extends PureComponent {
  render() {

    const { className } = this.props;

    const classes = cx(
      'sidebar',
      className
    )

    return (
      <div className={classes}>

      </div>
    );
  }
}

Sidebar.propTypes = {
  className: PropTypes.string,
};

export default Sidebar;
