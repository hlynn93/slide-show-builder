import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link } from 'react-router-dom'

import './Header.scss';

class Header extends PureComponent {
  render() {

    const { className } = this.props;

    const classes = cx(
      'header',
      className
    );

    return (
      <nav className={classes}>
        <Link to="/builder">Builder</Link>
      </nav>
    );
  }
}

Header.propTypes = {
  className: PropTypes.string,
  children: PropTypes.object,
};

export default Header;
