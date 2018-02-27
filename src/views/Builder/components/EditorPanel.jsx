import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Panel from '../../../components/Panel';

import './EditorPanel.scss';

class EditorPanel extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {

    const { hide, minimize, onToggle, position, children } = this.props

    return (
      <Panel
        style={hide ? { display: "none" } : {}}
        position={position}
        bounds={".builder_content"}
        className="panel_editor"
        minimize={!minimize}
        onToggle={onToggle}
        >
        <div className="panel_editor_inner">
          { children }
        </div>
      </Panel>
    );
  }
}

EditorPanel.propTypes = {
  hide: PropTypes.bool,
  position: PropTypes.object,
  minimize: PropTypes.bool,
  onToggle: PropTypes.func,
  children: PropTypes.any,
};

EditorPanel.defaultProps = {
  hide: false,
  minimize: false,
  onToggle: () => {},
  position: { x: 0, y: 0 }
};

export default EditorPanel;
