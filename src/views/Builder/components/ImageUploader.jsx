import React, { PureComponent } from 'react';
import { Dialog } from 'element-react';
import PropTypes from 'prop-types';
import { OBJECT_TYPES } from '../../../constants/appConstants';

class ImageUploader extends PureComponent {
  constructor(props) {
    super(props);
    this.handleImageChange = this.handleImageChange.bind(this)
  }


  handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.props.onImageChange(
        OBJECT_TYPES.IMAGE,
        {
          content: file,
          src: reader.result
        }
      );
    }

    if(file)
      reader.readAsDataURL(file)
  }

  render() {
    const {
      onCancel,
      visible
    } = this.props

    return (
      <Dialog
        title="Upload image"
        onCancel={onCancel}
        visible={visible}
        >
        <Dialog.Body>
          <form onSubmit={(e)=>this._handleSubmit(e)}>
            <input className="fileInput"
              type="file"
              onChange={this.handleImageChange} />
          </form>
        </Dialog.Body>
      </Dialog>
    );
  }
}

ImageUploader.propTypes = {
  onImageChange: PropTypes.func,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  visible: PropTypes.bool
};

ImageUploader.defaultProps = {
  onCancel: () => {},
  onClose: () => {}
};

export default ImageUploader;
