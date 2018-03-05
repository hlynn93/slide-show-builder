import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Canvas from '../../Builder/components/Canvas'
import { isEmpty } from 'lodash';

import './PresenterScreen.scss'

class PresenterScreen extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      slides,
      animatedIds,
      curSlideIndex,
      curTransitionIndex,
      mode,
    } = this.props

    const slide = slides[curSlideIndex] || {}
    const slideTransition = slide.transition
    const curSlideState = !isEmpty(slide) ? slide.modes[mode] : {}
    // const objectIds = curSlideState.objectIds || []
    const objTransitions = curSlideState.transitions || []

    const presentSlides = slides.map((s,i) => {
      const transition = objTransitions[curTransitionIndex]
      return (
        <Canvas
          key={i}
          {...this.props}
          objectIds={animatedIds}
          objectTransition={transition}
          slideTransition={slideTransition}
          presenterMode
          />
      )
    })

    return (
      <div className="presenter_screen">
          { presentSlides[curSlideIndex] }
      </div>
    );
  }
}

PresenterScreen.propTypes = {
  slides: PropTypes.array,
  objects: PropTypes.object,
  curSlideIndex: PropTypes.number,
  mode: PropTypes.string,
  animatedIds: PropTypes.array,
  curTransitionIndex: PropTypes.number,
};

PresenterScreen.defaultProps = {
  animatedIds: [],
  slides: [],
  objects: {},
  curSlideIndex: 0,
};

export default PresenterScreen;
