import React, { PureComponent } from 'react';
import Panel from '../../../components/Panel';
import PropTypes from 'prop-types';

import './SideTools.scss'

const renderButtons = config => (
  config.map(c => (
    <div
      key={c.id}
      className="sidetools_item">
      <img
        onClick={c.onClick}
        className="sidetools_icon"
        src={process.env.PUBLIC_URL + `/images/icons/sidetools/${c.icon}.png`}
      />
    </div>
  ))
)

class SideTools extends PureComponent {

  render() {

    const {
      onImageClick,
      onToggle,
      onTextClick,
      onPreviewClick,
      onSaveClick,
      onRedoClick,
      onUndoClick,
      minimize
    } = this.props

    const config = [
      {
        id: 'image',
        icon: 'photo',
        onClick: onImageClick,
      },
      {
        id: 'text',
        icon: 'textbox',
        onClick: onTextClick,
      },
      {
        id: 'preview',
        icon: 'preview',
        onClick: onPreviewClick,
      },
      {
        id: 'save',
        icon: 'save',
        onClick: onSaveClick,
      },
      {
        id: 'undo',
        icon: 'undo',
        onClick: onUndoClick,
      },
      {
        id: 'redo',
        icon: 'redo',
        onClick: onRedoClick,
      },
    ]

    return (
      <Panel
        className="sidetools"
        onToggle={onToggle}
        minimize={!minimize}>
        { renderButtons(config) }
      </Panel>
    );
  }
}

SideTools.propTypes = {
  onImageClick: PropTypes.func,
  onToggle: PropTypes.func,
  onTextClick: PropTypes.func,
  onPreviewClick: PropTypes.func,
  onSaveClick: PropTypes.func,
  onUndoClick: PropTypes.func,
  onRedoClick: PropTypes.func,
  minimize: PropTypes.bool,
};

export default SideTools;
