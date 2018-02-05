import React, { PureComponent } from 'react';
import SideTools from './components/SideTools';
import Canvas from './components/Canvas';
import ImageEditor from './components/ImageEditor';
import ImageUploader from './components/ImageUploader';
// import PropTypes from 'prop-types';

const formatObjectData = (content, url, type, id) => ({
  content,
  url,
  type,
  id
})

class Builder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      objects: {},
      imgIds: [],
      currentObject: {}
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleImageChange = this.handleImageChange.bind(this)
  }

  handleClick(id) {
    this.setState({
      currentObject: { ...this.state.objects[id] }
    });
  }

  handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      const { objects, imgIds } = this.state;

      const image = formatObjectData(file,
        reader.result,
        "image",
        Object.keys(objects).length
      )

      this.setState({
        objects: {
          ...objects,
          [image.id]: image
        },
        imgIds: imgIds.concat(image.id)
      });
    }

    if(file)
      reader.readAsDataURL(file)
  }

  render() {
    const { objects, imgIds, currentObject } = this.state
    return (
      <div className="builder">
        <SideTools />
        <div style={{marginLeft: 60}}>
          <ImageUploader
            onImageChange={this.handleImageChange}
            />
          <Canvas
            objects={objects}
            imgIds={imgIds}
            onClick={this.handleClick}
            activeId={currentObject.id}
            />
          <ImageEditor />
        </div>
      </div>
    );
  }
}

Builder.propTypes = {

};

Builder.defaultProps = {

};

export default Builder;
