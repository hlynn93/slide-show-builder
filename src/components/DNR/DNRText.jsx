import React from 'react';
import PropTypes from 'prop-types';
import withDNR from './withDNR';
import { Editor, RichUtils } from 'draft-js';
import { getCustomStyleMap } from '../../utils/rtfUtils';

import './DNR.scss';

const blockStyleFn = contentBlock => {
  const type = contentBlock.getType();
  switch (type) {
    case 'blockquote': return 'dnr_blockquote'
    case 'code-block': return 'dnr_precode'
    default:
      break;
  }
}

const Text = ({
  onTextChange,
  content,
  textAlign,
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
        textAlignment={textAlign}
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
  textAlign: PropTypes.oneOf(['left', 'right', 'center', 'justify'])
};

Text.defaultProps = {
  placeholder: "Write something...",
  readOnly: false,
  isActive: false,
  onChange: () => {}
};

export default withDNR(Text);
