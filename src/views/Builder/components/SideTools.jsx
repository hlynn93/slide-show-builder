import React, { PureComponent } from 'react';
import FaBeer from 'react-icons/lib/fa/beer';
// import PropTypes from 'prop-types';

import './SideTools.scss'

class SideTools extends PureComponent {
  render() {
    return (
      <div className="side-tools">
        <FaBeer className="side-tools-icon" />
      </div>
    );
  }
}

SideTools.propTypes = {

};

export default SideTools;
