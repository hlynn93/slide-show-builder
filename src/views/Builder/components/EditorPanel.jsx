import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Panel from '../../../components/Panel';

import './EditorPanel.scss';

class EditorPanel extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {

    const { visible, onToggle, position, children } = this.props

    return (
      <Panel
        position={position}
        bounds={".builder_content"}
        className="panel_editor"
        minimize={!visible}
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
  position: PropTypes.objectOf({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  visible: PropTypes.bool,
  onToggle: PropTypes.func,
  children: PropTypes.any,
};

EditorPanel.defaultProps = {
  visible: false,
  onToggle: () => {},
  position: { x: 0, y: 0 }
};

export default EditorPanel;
