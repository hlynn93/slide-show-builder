import React, { PureComponent } from 'react';
import FaBeer from 'react-icons/lib/fa/beer';
import Panel from '../../../components/Panel';
// import PropTypes from 'prop-types';

import './SideTools.scss'

class SideTools extends PureComponent {
  render() {
    return (
      <Panel className="side-tools">
          <FaBeer className="side-tools-icon" />
      </Panel>
    );
  }
}

SideTools.propTypes = {

};

export default SideTools;
