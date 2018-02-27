import React, { PureComponent } from 'react';
import PresenterScreen from './components/PresenterScreen';
import initialState from './data.json';
import { ASPECT_RATIO } from '../../constants/builderConstants';

const CONTROL_HEIGHT = 60;

class Presenter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(e) {
    const {
      currentSlide,
      slides,
    } = this.state
    switch (e.keyCode) {
      case 39: // Right arrow
        this.setState({
          currentSlide: Math.min(slides.length - 1, currentSlide + 1)
        });
        break;

      case 37: // Left arrow
        this.setState({
          currentSlide: Math.max(0, currentSlide - 1)
        });
        break;

      default:
    }
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
      <div>
        <PresenterScreen
          mode={mode}
          scale={scale}
          objects={objects}
          currentSlide={currentSlide}
          slides={slides}
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
