import React from 'react';
import PropTypes from 'prop-types';
import withDNR from './withDNR';
import { Editor, RichUtils } from 'draft-js';
import { getCustomStyleMap } from 'draftjs-utils';

import './DNR.scss';

const blockStyleFn = contentBlock => {
  const type = contentBlock.getType();
  switch (type) {
    case 'blockquote': return 'dnr_blockquote'
    case 'code-block': return 'dnr_precode'

    /* Text alignment */
    case 'left': return 'align-left';
    case 'center': return 'align-center';
    case 'right': return 'align-right';

    default:
      break;
  }
}

const Text = ({
  onTextChange,
  content,
  ...props
}) => {

  const handleTextKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onTextChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  return (
    <div className={"canvas_text"}>
      <Editor
        { ...props }
        handleKeyCommand={handleTextKeyCommand}
        editorState={content}
        onChange={onTextChange}
        customStyleMap={getCustomStyleMap()}
        blockStyleFn={blockStyleFn}
      />
    </div>
  );
};

Text.propTypes = {
  isActive: PropTypes.bool,
  className: PropTypes.string,
  onTextChange: PropTypes.func,
  content: PropTypes.any,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
};

Text.defaultProps = {
  placeholder: "Write something...",
  readOnly: false,
  isActive: false,
  onChange: () => {}
};

export default withDNR(Text);
