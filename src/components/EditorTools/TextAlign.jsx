import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ControlGroup from './components/ControlGroup';

class TextAlign extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentTextAlign: 'left'
    }
    this.updateTextAlign = this.updateTextAlign.bind(this)
    this.toggleTextAlign = this.toggleTextAlign.bind(this)
  }

  componentDidMount() {
    this.updateTextAlign();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.textAlign && (nextProps.textAlign !== this.props.textAlign)) {
      this.updateFontSize(nextProps.textAlign)
    }
  }

  updateTextAlign(textAlign) {
    const alignment = textAlign || this.props.textAlign
    if(!alignment) return;

    this.setState({ textAlign: alignment });
  }

  toggleTextAlign(alignment) {
    return this.props.onChange(alignment)
  }

  render() {

    return (
      <ControlGroup
        onClick={this.toggleTextAlign}
        items={this.props.items}
        activeIds={{ [this.state.currentTextAlign]: true }}
        />
    );
  }
}

TextAlign.propTypes = {
  items: PropTypes.array,
  textAlign: PropTypes.string,
  onChange: PropTypes.func,
};

TextAlign.defaultProps = {
  items: [],
  onChange: () => {},
};

export default TextAlign;
