import React, { PureComponent } from 'react';
import MdImage from 'react-icons/lib/md/image';
import MdTextFields from 'react-icons/lib/md/text-fields';
import FaArrowsAlt from 'react-icons/lib/fa/arrows-alt';
import Panel from '../../../components/Panel';
import PropTypes from 'prop-types';

import './SideTools.scss'

class SideTools extends PureComponent {
  render() {

    const {
      onClick,
      onToggle,
      onTextClick,
      onPreview,
      visible
    } = this.props
    return (
      <Panel
        className="sidetools"
        onToggle={onToggle}
        minimize={!visible}>
        <div className="sidetools_item">
          <MdImage
            onClick={onClick}
            className="sidetools_icon"
          />
        </div>
        <div className="sidetools_item">
          <MdTextFields
            onClick={onTextClick}
            className="sidetools_icon"
          />
        </div>
        <div className="sidetools_item">
          <FaArrowsAlt
            onClick={onPreview}
            className="sidetools_icon"
          />
        </div>
      </Panel>
    );
  }
}

SideTools.propTypes = {
  onClick: PropTypes.func,
  onToggle: PropTypes.func,
  onTextClick: PropTypes.func,
  onPreview: PropTypes.func,
  visible: PropTypes.bool,
};

export default SideTools;
