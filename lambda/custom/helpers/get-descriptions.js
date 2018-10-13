import {
  complement,
  compose,
  filter,
  isEmpty,
  map,
  prop,
  uniq
} from 'ramda'

const getDescriptions = compose(
  uniq,
  filter(complement(isEmpty)),
  map(prop('description'))
)

export default getDescriptions
