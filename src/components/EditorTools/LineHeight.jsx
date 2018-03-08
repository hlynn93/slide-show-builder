import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  toggleCustomInlineStyle,
  getSelectionCustomInlineStyle
} from '../../utils/rtfUtils';
import { TEXT_TOOL_TYPE } from '../../constants/builderConstants';
import { NumberField } from './components';

// format: (LineHeight, state) =>

class LineHeight extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      currentLineHeight: undefined
    }
    this.updateLineHeight = this.updateLineHeight.bind(this)
    this.toggleLineHeight = this.toggleLineHeight.bind(this)
  }

  componentDidMount() {
    this.updateLineHeight()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.editorState && (nextProps.editorState !== this.props.editorState)) {
      this.updateLineHeight(nextProps.editorState)
    }
  }

  updateLineHeight(editorState) {
    const state = editorState || this.props.editorState
    if(!state) return

    const fontKey = getSelectionCustomInlineStyle(editorState, ['LINEHEIGHT']).LINEHEIGHT
    if(!fontKey) return

    this.setState({
      currentLineHeight: parseFloat(fontKey.split('-')[1])
    });
  }

  toggleLineHeight(sizeStr) {
    const size = parseFloat(sizeStr)
    if(isNaN(size)) return

    const { onChange, editorState } = this.props;
    return onChange(toggleCustomInlineStyle(editorState, TEXT_TOOL_TYPE.LINE_HEIGHT, size))
  }

  render() {
    return (
      <NumberField
        min={0}
        max={200}
        onChange={this.toggleLineHeight}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
        style={{ width: 100 }}
        append="px"
        placeholder="Line height"
        />
    );
  }
}

LineHeight.propTypes = {
  editorState: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
};

export default LineHeight;
