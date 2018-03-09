import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import data from '../../../data/getImages.json';
import { Dialog } from 'element-react';
import { OBJECT_TYPE } from '../../../constants/builderConstants';

import './Gallery.scss';

class Gallery extends PureComponent {
  constructor(props) {
    super(props);
    this.handleImageClick = this.handleImageClick.bind(this)
  }

  handleImageClick(img, e) {
    e.preventDefault();
    this.props.onCancel();
    this.props.onImageChange(OBJECT_TYPE.IMAGE, img)
  }

  render() {
    const {
      onCancel,
      visible
    } = this.props

    const { images } = data

    return (
      <Dialog
        title="Add image"
        onCancel={onCancel}
        visible={visible}
        size="large"
        >
        <Dialog.Body>
          <div className="gallery">
              {
                images.map((img,id) => (
                  <div
                    key={id}
                    className="gallery_item">
                    <img
                      src={img.src}
                      className="gallery_img"
                      onClick={this.handleImageClick.bind(null, img)}
                      />
                  </div>
                ))
              }
          </div>
        </Dialog.Body>
      </Dialog>
    );
  }
}

Gallery.propTypes = {
  onImageChange: PropTypes.func,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  visible: PropTypes.bool
};

Gallery.defaultProps = {
  onCancel: () => {},
  onClose: () => {}
};

export default Gallery;
