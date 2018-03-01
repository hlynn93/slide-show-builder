import React, { PureComponent } from 'react';
import { Dialog } from 'element-react';
import PropTypes from 'prop-types';
import Canvas from './Canvas'
import { Transition, TransitionGroup } from '../../../components/Transition'

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
      curSlideIndex,
      mode,
    } = this.props

    const previewSlides = slides.map((s,i) => (
      <Transition key={i} {...s.transition}>
        <Canvas
          key={i}
          {...this.props}
          objectIds={slides[curSlideIndex].modes[mode].objectIds || []}
          />
      </Transition>
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
                { previewSlides[curSlideIndex] }
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
  curSlideIndex: PropTypes.number,
  mode: PropTypes.string,
};

Preview.defaultProps = {
  onCancel: () => {},
  onClose: () => {},
  slides: [],
  objects: {},
  curSlideIndex: 0,
};

export default Preview;
