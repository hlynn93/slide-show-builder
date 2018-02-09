import React, { PureComponent } from 'react';
import MdImage from 'react-icons/lib/md/image';
import MdTextFields from 'react-icons/lib/md/text-fields';
import Panel from '../../../components/Panel';
import PropTypes from 'prop-types';

import './SideTools.scss'

class SideTools extends PureComponent {
  render() {
    return (
      <Panel className="sidetools">
        <div className="sidetools_item">
          <MdImage
            onClick={this.props.onClick}
            className="sidetools_icon"
          />
        </div>
        <div className="sidetools_item">
          <MdTextFields
            onClick={this.props.onTextClick}
            className="sidetools_icon"
          />
        </div>
      </Panel>
    );
  }
}

SideTools.propTypes = {
  onClick: PropTypes.func,
  onTextClick: PropTypes.func,
};

export default SideTools;
