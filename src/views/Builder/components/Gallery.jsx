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

  handleImageClick(img, ref, e) {
    e.preventDefault();
    const width = this[ref].offsetWidth;
    const height = this[ref].offsetHeight;
    this.props.onCancel();
    this.props.onImageChange(OBJECT_TYPE.IMAGE, {
      ...img,
      attr: {
        width,
        height
      }
    })
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
                      ref={ref => this[`imgRefs-${id}`] = ref}
                      src={img.src}
                      className="gallery_img"
                      onClick={this.handleImageClick.bind(null, img, `imgRefs-${id}`)}
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
