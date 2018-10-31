import {
  compose,
  isEmpty,
  map,
  pluck,
  reject,
  trim,
  uniq
} from 'ramda'

const getDescriptions = compose(
  uniq,
  map(trim),
  reject(isEmpty),
  pluck('description')
)

export default getDescriptions
