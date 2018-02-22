import React, { PureComponent } from 'react';
import { Dialog } from 'element-react';
import PropTypes from 'prop-types';
import Canvas from './Canvas'


class Preview extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      onCancel,
      visible
    } = this.props

    return (
      <Dialog
        title="Preview"
        className="preview_dialog"
        onCancel={onCancel}
        visible={visible}
        >
        <Dialog.Body>
          { visible &&
            <Canvas
              {...this.props}
              isPreview={true}
              />
          }
        </Dialog.Body>
      </Dialog>
    );
  }
}

Preview.propTypes = {
  onCancel: PropTypes.func,
  visible: PropTypes.bool
};

Preview.defaultProps = {
  onCancel: () => {},
  onClose: () => {}
};

export default Preview;
