import React, { PureComponent } from 'react';
import { Dialog } from 'element-react';
import PropTypes from 'prop-types';
import Canvas from './Canvas'
import { Fade, TransitionGroup } from '../../../components/Transition'

import './Preview.scss'

class Preview extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      onCancel,
      visible,
      slides,
      currentSlide,
      mode,
    } = this.props

    const previewSlides = slides.map((s,i) => (
      <Fade key={i}>
        <Canvas
          key={i}
          {...this.props}
          objectIds={slides[currentSlide].modes[mode].objectIds || []}
          />
      </Fade>
    ))

    return (
      <Dialog
        title="Preview"
        className="preview_dialog"
        onCancel={onCancel}
        visible={visible}
        >
        <Dialog.Body>
          { visible &&
            <TransitionGroup className="preview_container">
                { previewSlides[currentSlide] }
            </TransitionGroup>
          }
        </Dialog.Body>
      </Dialog>
    );
  }
}

Preview.propTypes = {
  onCancel: PropTypes.func,
  visible: PropTypes.bool,
  slides: PropTypes.array,
  objects: PropTypes.object,
  currentSlide: PropTypes.number,
  mode: PropTypes.string,
};

Preview.defaultProps = {
  onCancel: () => {},
  onClose: () => {},
  slides: [],
  objects: {},
  currentSlide: 0,
};

export default Preview;
