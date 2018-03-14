import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './CanvasObject.scss';

const CursorWrapper = ({
  attr,
  style,
  className,
  ...props
}) => (
  <div
    style={{
      ...style,
      ...attr
    }}
    className={cx(
      className,
      'dnr_cursor'
    )}
    {...props}>
  </div>
);

// const convertAttrToStyle = (attr) => {

// }


CursorWrapper.propTypes = {
  style: PropTypes.object,
  attr: PropTypes.object,
  className: PropTypes.string,
};

export default CursorWrapper;
