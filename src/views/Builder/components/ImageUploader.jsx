import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ImageUploader extends PureComponent {

  render() {
    return (
      <form onSubmit={(e)=>this._handleSubmit(e)}>
        <input className="fileInput"
          type="file"
          onChange={this.props.onImageChange} />
      </form>
    );
  }
}

ImageUploader.propTypes = {
  onImageChange: PropTypes.func,
};

ImageUploader.defaultProps = {

};

export default ImageUploader;
