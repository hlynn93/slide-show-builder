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

// const customStyleFn = () => {
//   return {
//     ...getCustomStyleMap(),
//     red: {
//       color: 'rgba(255, 0, 0, 1.0)',
//     },
//     orange: {
//       color: 'rgba(255, 127, 0, 1.0)',
//     },
//     yellow: {
//       color: 'rgba(180, 180, 0, 1.0)',
//     },
//     green: {
//       color: 'rgba(0, 180, 0, 1.0)',
//     },
//     blue: {
//       color: 'rgba(0, 0, 255, 1.0)',
//     },
//     indigo: {
//       color: 'rgba(75, 0, 130, 1.0)',
//     },
//     violet: {
//       color: 'rgba(127, 0, 255, 1.0)',
//     },
//   }
// }

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
