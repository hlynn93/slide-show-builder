import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PresenterScreen from './components/PresenterScreen';
import Controls from './components/Controls';
import initialState from './data.json';
import { ASPECT_RATIO } from '../../constants/builderConstants';
import { withRouter } from "react-router-dom";
import { union, difference, isNumber } from 'lodash';

import './Presenter.scss';

const CONTROL_HEIGHT = 37;

class Presenter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handlePrev = this.handlePrev.bind(this)
    this.initSlide = this.initSlide.bind(this)
    this.initFullSlide = this.initFullSlide.bind(this)
    this.nextSlide = this.nextSlide.bind(this)
    this.prevSlide = this.prevSlide.bind(this)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
    this.initSlide();
  }

  /*  Initialized the slide at the starting state */
  initSlide() {
    const { slides, curSlideIndex, mode } = this.state
    const curSlideState = slides[curSlideIndex] ? slides[curSlideIndex].modes[mode] : {}
    const objectIds = curSlideState.objectIds || []
    const transitions = curSlideState.transitions || []

    /* Take out all the objects that animations are being applied from the list */
    let newAnimatedIds = objectIds.slice(0)
    transitions.map(t => {
      newAnimatedIds = difference(newAnimatedIds, t.objectIds)
    })

    this.setState({
      curTransitionIndex: undefined,
      animatedIds: newAnimatedIds
    });
  }


  /* Initialized the slide with all the objects being animated */
  initFullSlide() {
    const { slides, curSlideIndex, mode } = this.state
    const curSlideState = slides[curSlideIndex] ? slides[curSlideIndex].modes[mode] : {}
    const objectIds = curSlideState.objectIds || []
    const transitions = curSlideState.transitions || []

    this.setState({
      curTransitionIndex: transitions.length ? transitions.length - 1 : undefined,
      animatedIds: objectIds.slice(0)
    });
  }

  /** Goes to next slide */
  nextSlide() {
    const { slides, curSlideIndex } = this.state

    /* Do nothing if the current slide is the last slide */
    if(curSlideIndex + 1 >= slides.length)
      return

    this.setState({
      curSlideIndex: curSlideIndex + 1,
      animatedIds: []
    }, () => this.initSlide());
  }

  /** Goes to previous slide */
  prevSlide() {
    const { curSlideIndex } = this.state

    /* Do nothing if the current slide is the first slide */
    if(curSlideIndex <= 0)
      return

    this.setState({
      curSlideIndex: curSlideIndex - 1,
      animatedIds: []
    }, () => this.initFullSlide());
  }

  handleKeyDown(e) {
    switch (e.keyCode) {
      case 39: // Right arrow
        this.handleNext(); break;

      case 37: // Left arrow
        this.handlePrev(); break;

      default:
    }
  }

  handleNext() {

    const { slides, curSlideIndex, animatedIds, mode, curTransitionIndex } = this.state

    const curSlideState = slides[curSlideIndex] ? slides[curSlideIndex].modes[mode] : {}
    const transitions = curSlideState.transitions || []
    const nextTransitionIndex = isNumber(curTransitionIndex) ? curTransitionIndex + 1 : 0

    /* If no more animations left on this slide */
    if(!transitions[nextTransitionIndex]) {
      return this.nextSlide()
    } else {
      const newAnimatedIds = union(animatedIds, transitions[nextTransitionIndex].objectIds)
      return this.setState({
        curTransitionIndex: nextTransitionIndex,
        animatedIds: newAnimatedIds
      });
    }
  }

  handlePrev() {
    const { slides, curSlideIndex, animatedIds, mode, curTransitionIndex } = this.state

    const curSlideState = slides[curSlideIndex] ? slides[curSlideIndex].modes[mode] : {}
    const transitions = curSlideState.transitions || []
    const nextTransitionIndex = curTransitionIndex - 1

    /* If there is no animation left to be reverted */
    if(!isNumber(curTransitionIndex)) {
      return this.prevSlide()
    }

    /* If this is the first transition (index = 0) */
    if(!transitions[nextTransitionIndex]) {
      return this.setState({
        animatedIds: [],
        curTransitionIndex: undefined
      });
    } else {
      const newAnimatedIds = difference(animatedIds, transitions[nextTransitionIndex].objectIds)
      return this.setState({
        curTransitionIndex: nextTransitionIndex,
        animatedIds: newAnimatedIds
      });
    }
  }

  render() {
    const {
      mode,
      objects,
      curSlideIndex,
      slides,
      animatedIds
    } = this.state;

    const scale = calculateScale(mode)

    return (
      <div className="presenter">
        <PresenterScreen
          mode={mode}
          scale={scale}
          objects={objects}
          curSlideIndex={curSlideIndex}
          animatedIds={animatedIds}
          slides={slides}
          />
        <Controls
          index={curSlideIndex}
          length={slides.length}
          onPrev={this.handlePrev}
          onNext={this.handleNext}
          onExit={() => this.props.history.push('/builder')}
          />
      </div>
    );
  }
}

Presenter.propTypes = {
  history: PropTypes.object,
};

const calculateScale = (mode) => {
  const windowsWidth = window.innerWidth
  const windowsHeight = (window.innerHeight - CONTROL_HEIGHT)
  const scaleWidth = windowsWidth / ASPECT_RATIO[mode].width
  const scaleHeight = windowsHeight / ASPECT_RATIO[mode].height
  return Math.min(scaleWidth, scaleHeight)
}

export default withRouter(Presenter);
