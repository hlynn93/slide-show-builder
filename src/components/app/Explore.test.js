import React from 'react'
import Explore from './Explore'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() });

describe('Explore', function() {

  const props = {
    value: '',
    onChange: jest.fn(),
  }

  it('should render a text input and a button', function() {
    const explore = shallow(<Explore {...props} />)
    expect(explore.find('input').length).toBe(1);
    expect(explore.find('button').length).toBe(1);
  });
});
