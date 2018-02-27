import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Canvas from '../../Builder/components/Canvas'
import { Transition, TransitionGroup } from '../../../components/Transition'

import './PresenterScreen.scss'

class PresenterScreen extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      slides,
      currentSlide,
      mode,
    } = this.props

    const presentSlides = slides.map((s,i) => (
      <Transition key={i} {...s.transition}>
        <Canvas
          key={i}
          {...this.props}
          objectIds={slides[currentSlide].modes[mode].objectIds || []}
          fullScreen
          />
      </Transition>
    ))

    return (
      <TransitionGroup className="presenter_screen_container">
          { presentSlides[currentSlide] }
      </TransitionGroup>
    );
  }
}

PresenterScreen.propTypes = {
  slides: PropTypes.array,
  objects: PropTypes.object,
  currentSlide: PropTypes.number,
  mode: PropTypes.string,
};

PresenterScreen.defaultProps = {
  slides: [],
  objects: {},
  currentSlide: 0,
};

export default PresenterScreen;
