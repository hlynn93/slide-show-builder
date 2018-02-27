import React, { PureComponent } from 'react';
import PresenterScreen from './components/PresenterScreen';
import Controls from './components/Controls';
import initialState from './data.json';
import { ASPECT_RATIO } from '../../constants/builderConstants';

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
    const { slides, currentSlide } = this.state
    this.setState({ currentSlide: Math.min(slides.length - 1, currentSlide + 1)});
  }

  handlePrev() {
    this.setState({ currentSlide: Math.max(0, this.state.currentSlide - 1) });
  }

  render() {
    const {
      mode,
      objects,
      currentSlide,
      slides,
    } = this.state;

    const scale = calculateScale(mode)

    return (
      <div className="presenter">
        <PresenterScreen
          mode={mode}
          scale={scale}
          objects={objects}
          currentSlide={currentSlide}
          slides={slides}
          />
        <Controls
          index={currentSlide}
          length={slides.length}
          onPrev={this.handlePrev}
          onNext={this.handleNext}
          />
      </div>
    );
  }
}

Presenter.propTypes = {

};

const calculateScale = (mode) => {
  const windowsWidth = window.innerWidth
  const windowsHeight = (window.innerHeight - CONTROL_HEIGHT)
  const scaleWidth = windowsWidth / ASPECT_RATIO[mode].width
  const scaleHeight = windowsHeight / ASPECT_RATIO[mode].height
  return Math.min(scaleWidth, scaleHeight)
}

export default Presenter;
