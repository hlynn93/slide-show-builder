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

  initSlide() {
    const { slides, curSlideIndex, mode } = this.state
    const curSlideState = slides[curSlideIndex] ? slides[curSlideIndex].modes[mode] : {}
    const objectIds = curSlideState.objectIds || []
    const transitions = curSlideState.transitions || []
    let newAnimatedIds = objectIds.slice(0)
    transitions.map(t => {
      newAnimatedIds = difference(newAnimatedIds, t.objectIds)
    })

    this.setState({
      curTransitionIndex: undefined,
      animatedIds: newAnimatedIds
    });
  }

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

  nextSlide() {
    const { slides, curSlideIndex } = this.state

    if(curSlideIndex + 1 >= slides.length)
      return

    this.setState({
      curSlideIndex: curSlideIndex + 1,
      animatedIds: []
    }, () => this.initSlide());
  }

  prevSlide() {
    const { curSlideIndex } = this.state

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

    console.warn(transitions[nextTransitionIndex]);
    if(!transitions[nextTransitionIndex]) {
      this.nextSlide()
    } else {
      const newAnimatedIds = union(animatedIds, transitions[nextTransitionIndex].objectIds)
      this.setState({
        curTransitionIndex: nextTransitionIndex,
        animatedIds: newAnimatedIds
      });
    }


    // if(animatedIds.length >= objectIds.length)
    //   this.setState({
    //     curSlideIndex: Math.min(slides.length - 1, curSlideIndex + 1),
    //     animatedIds: []
    //   });
    // else {
    //   const newAnimatedIds = animatedIds.slice(0)
    //   let newId = objectIds[newAnimatedIds.length]
    //   console.warn(newId, objects[newId].transition);

    //   while(!newId && !objects[newId].transition) {
    //     newAnimatedIds.push(newId)
    //     newId = objectIds[newAnimatedIds.length]
    //   }

    //   this.setState({
    //     animatedIds: newAnimatedIds
    //   });
    // }
  }

  handlePrev() {
    const { slides, curSlideIndex, animatedIds, mode, curTransitionIndex } = this.state

    const curSlideState = slides[curSlideIndex] ? slides[curSlideIndex].modes[mode] : {}
    const transitions = curSlideState.transitions || []
    const nextTransitionIndex = curTransitionIndex - 1

    if(!isNumber(transitions[curTransitionIndex])) {
      this.prevSlide()
    }

    if(!transitions[nextTransitionIndex]) {
      this.setState({
        animatedIds: [],
        curTransitionIndex: undefined
      });
    } else {
      const newAnimatedIds = difference(animatedIds, transitions[nextTransitionIndex].objectIds)
      this.setState({
        curTransitionIndex: nextTransitionIndex,
        animatedIds: newAnimatedIds
      });
    }

    // const { transitions, slides, curSlideIndex, }

    // const { animatedIds, slides, curSlideIndex, mode, objects } = this.state
    // const objectIds = slides[curSlideIndex] ? slides[curSlideIndex].modes[mode].objectIds : []

    // if(animatedIds.length <= 0) {
    //   const nextSlide = Math.max(0, curSlideIndex - 1)
    //   const objectIds = slides[nextSlide] ? slides[nextSlide].modes[mode].objectIds : []

    //   this.setState({
    //     curSlideIndex: nextSlide,
    //     animatedIds: objectIds.slice(0)
    //   });
    // } else {
    //   const newAnimatedIds = animatedIds.slice(0)
    //   let newId = objectIds[newAnimatedIds.length - 1]

    //   while(!newId && !objects[newId].transition) {
    //     newAnimatedIds.pop()
    //     newId = objectIds[newAnimatedIds.length - 1]
    //   }

    //   this.setState({
    //     animatedIds: newAnimatedIds
    //   });
    // }

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
    console.warn(this.state);

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

// // add an item to the end of the array and return the shallow copy of the array
// const shallowPush = (array, item) => {
//   const newArray = array.slice(0)
//   newArray.push(item);
//   return newArray
// }

// // remove the last item of the array and return the shallow copy of the array
// const shallowPop = (array) => {
//   const newArray = array.slice(0)
//   newArray.pop();
//   return newArray
// }

export default withRouter(Presenter);
