import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Form } from 'element-react';
import '../EditorTools.scss';

class NumberField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined
    }
  }

  onSubmit(e) {
    e.preventDefault()
    this.props.onChange(parseInt(this.state.value))
  }

  render() {
    return (
      <Form
        className="editor_link"
        model={{ ...this.state.value }}
        onSubmit={this.onSubmit.bind(this)}>
        <Form.Item>
          <Input
            {...this.props}
            className="editor_number_field"
            type="number"
            onChange={value => this.setState({ value })}
            />
        </Form.Item>
      </Form>
    );
  }
}

NumberField.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  max: PropTypes.number,
  min: PropTypes.number,
  style: PropTypes.object,
  className: PropTypes.string,
};

NumberField.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
  min: 1,
  max: 200,
};

export default NumberField;
