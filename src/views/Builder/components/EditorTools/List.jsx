import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { RichUtils } from 'draft-js';
import { changeDepth, getSelectedBlocksType } from 'draftjs-utils';
import { ButtonGroup } from '../../../../components/Button';

// format: (style, state) => RichUtils.toggleBlockType(state, style)

class List extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentStyle: 'unstyled'
    }
    this.updateStyle = this.updateStyle.bind(this)
    this.toggleStyle = this.toggleStyle.bind(this)
  }

  componentDidMount() {
    this.updateStyle()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.editorState && (nextProps.editorState !== this.props.editorState)) {
      this.updateStyle(nextProps.editorState)
    }
  }

  toggleStyle(style) {
    const { onChange, editorState } = this.props;

    if(['right-indent', 'left-indent'].indexOf(style) < 0)
      return onChange(RichUtils.toggleBlockType(editorState, style))

    if(style === 'right-indent')
      return onChange( changeDepth(editorState, 1, 4))

    else
      return onChange( changeDepth(editorState, -1, 4))
  }

  updateStyle(editorState) {
    const state = editorState || this.props.editorState
    if(!state) return

    this.setState({
      currentStyle: getSelectedBlocksType(state)
    });
  }

  render() {
    return (
      <ButtonGroup
        onClick={this.toggleStyle}
        items={this.props.items}
        activeIds={this.state.currentStyles}
        />
    );
  }
}

List.propTypes = {
  items: PropTypes.array,
  editorState: PropTypes.object,
  onChange: PropTypes.func,
};

List.defaultProps = {
  items: [],
  onChange: () => {},
};

export default List;
