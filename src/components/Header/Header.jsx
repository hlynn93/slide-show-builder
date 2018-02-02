import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './Header.scss';

class Header extends PureComponent {
  render() {

    const { children, className } = this.props;

    const classes = cx(
      'header',
      className
    );

    return (
      <nav className={classes}>
        {children}
      </nav>
    );
  }
}

Header.propTypes = {
  className: PropTypes.string,
  children: PropTypes.object,
};

export default Header;
