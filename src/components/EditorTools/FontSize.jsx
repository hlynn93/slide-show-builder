import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  toggleCustomInlineStyle,
  getSelectionCustomInlineStyle
} from '../../utils/rtfUtils';
import { TEXT_TOOL_TYPE } from '../../constants/builderConstants';
import { NumberField } from './components';

// format: (fontSize, state) =>

class FontSize extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      currentFontSize: undefined
    }
    this.updateFontSize = this.updateFontSize.bind(this)
    this.toggleFontSize = this.toggleFontSize.bind(this)
  }

  componentDidMount() {
    this.updateFontSize()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.editorState && (nextProps.editorState !== this.props.editorState)) {
      this.updateFontSize(nextProps.editorState)
    }
  }

  updateFontSize(editorState) {
    const state = editorState || this.props.editorState
    if(!state) return

    const fontKey = getSelectionCustomInlineStyle(editorState, ['FONTSIZE']).FONTSIZE
    if(!fontKey) return

    this.setState({
      currentFontSize: parseInt(fontKey.split('-')[1])
    });
  }

  toggleFontSize(sizeStr) {
    const size = parseInt(sizeStr)
    if(isNaN(size)) return

    const { onChange, editorState } = this.props;
    return onChange(toggleCustomInlineStyle(editorState, TEXT_TOOL_TYPE.FONT_SIZE, size))
  }

  render() {
    return (
      <NumberField
        min={1}
        max={200}
        onChange={this.toggleFontSize}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
        style={{ width: 100 }}
        append="px"
        />
    );
  }
}

FontSize.propTypes = {
  items: PropTypes.array,
  editorState: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
};

export default FontSize;
