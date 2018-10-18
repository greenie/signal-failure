import {
  compose,
  isEmpty,
  pluck,
  reject,
  uniq
} from 'ramda'

const getDescriptions = compose(
  uniq,
  reject(isEmpty),
  pluck('description')
)

export default getDescriptions
