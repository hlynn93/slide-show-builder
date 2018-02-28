import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PresenterScreen from './components/PresenterScreen';
import Controls from './components/Controls';
import initialState from './data.json';
import { ASPECT_RATIO } from '../../constants/builderConstants';
import { withRouter } from "react-router-dom";

import './Presenter.scss';

const CONTROL_HEIGHT = 37;

class Presenter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handlePrev = this.handlePrev.bind(this)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
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
    const { slides, currentSlide, animatedIds, mode } = this.state
    const objectIds = slides[currentSlide] ? slides[currentSlide].modes[mode].objectIds : []

    if(animatedIds.length >= objectIds.length)
      this.setState({
        currentSlide: Math.min(slides.length - 1, currentSlide + 1),
        animatedIds: []
      });
    else {
      const newAnimatedIds = animatedIds.slice(0)
      const newId = objectIds[animatedIds.length]
      newAnimatedIds.push(newId);
      this.setState({
        animatedIds: newAnimatedIds
      });
    }
  }

  handlePrev() {
    const { animatedIds, slides, currentSlide, mode } = this.state
    if(animatedIds.length <= 0) {
      const nextSlide = Math.max(0, currentSlide - 1)
      const objectIds = slides[nextSlide] ? slides[nextSlide].modes[mode].objectIds : []

      this.setState({
        currentSlide: nextSlide,
        animatedIds: objectIds.slice(0)
      });
    } else {
      const newAnimatedIds = animatedIds.slice(0)
      newAnimatedIds.pop()
      this.setState({
        animatedIds: newAnimatedIds
      });
    }

  }

  render() {
    const {
      mode,
      objects,
      currentSlide,
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
          currentSlide={currentSlide}
          animatedIds={animatedIds}
          slides={slides}
          />
        <Controls
          index={currentSlide}
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
