import { CANVAS_MODE } from '../constants/builderConstants';
import { cloneDeep } from 'lodash';

const ID_SEPARATOR = '--'

const extractBaseId = (idString) => idString.split(ID_SEPARATOR)[0]

/**
 * Concat ID and the mode to be used as an object ID for specific mode
 */
const formatId = (type, baseId, mode) => baseId + ID_SEPARATOR + type + ID_SEPARATOR +  mode

/**
* Generate a unique value to be used as an ID for objects
*/
export const generateId = () => (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()

/**
 * Add the new object to the object list and
 * append its ID to the respective mode of the currently active slide
 */
export const addObject = (objects, slides, slideIndex, object) => {
  const newObjects = { ...objects }
  const newSlides = slides.slice(0);
  const newSlide = { ...slides[slideIndex] }

  Object.values(CANVAS_MODE).map(mode => {
    const newObject = {
      ...object,
      id: formatId(object.type, object.id, mode)
    }
    newObjects[newObject.id] = newObject;
    newSlide.modes[mode].objectIds.push(newObject.id)
  })
  newSlides[slideIndex] = newSlide

  return {
    slides: newSlides,
    objects: newObjects
  }
}

/**
 * Remove the object from the object list and also
 * remove its ID from the respective mode of the currently active slide
 */
export const removeObject = (objects, slides, id, slideId) => {
  const baseId = extractBaseId(id)
  const newObjects = { ...objects }
  const newSlides = slides.slice(0);
  const newSlide = { ...slides[slideId] }

  Object.keys(newSlide.modes).map(mode => {
    const id = `${baseId}-${mode}`
    const objectIds = newSlide.modes[mode].objectIds
    const index = objectIds.indexOf(id);

    delete newObjects[id];
    objectIds.splice(index, 1)
  })

  newSlides[slideId] = newSlide

  return {
    objects: newObjects,
    slides: newSlides
  }
}

/**
 * Copy and insert the new element into the array
 */
export const addSlide = (slides, slide, index = 0) => {
  const newSlides = slides.slice(0)
  newSlides.splice(index, 0, cloneDeep(slide))
  return newSlides
}

/**
 * Remove the slide from the list and its objects from the object list
 */
export const removeSlide = (objects, slides, index) => {

  /* Returns if no index is specified */
  if(!index)
    return { objects, slides}

  /* Returns if there is only one slide in the deck */
  if(slides.length <= 1)
    return { objects, slides }

  const newSlides = slides.slice(0);
  const newObjects = { ...objects }
  const slide = slides[index]

  newSlides.splice(index, 1)
  Object.keys(slide.modes).map(mode => {
    const objectIds = slide.modes[mode].objectIds
    objectIds.map(id => delete newObjects[id])
  })

  return {
    slides: newSlides,
    objects: newObjects
  }
}
