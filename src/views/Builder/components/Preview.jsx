import React, { PureComponent } from 'react';
import { Dialog } from 'element-react';
import PropTypes from 'prop-types';
import Canvas from './Canvas'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import './Preview.scss'

const Fade = ({ children, ...props }) => (
  <CSSTransition
    {...props}
    timeout={1000}
    classNames="fade"
  >
    {children}
  </CSSTransition>
);

Fade.propTypes = {
  children: PropTypes.any
}

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
