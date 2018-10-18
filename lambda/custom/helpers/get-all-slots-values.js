import {
  compose,
  isNil,
  map,
  props,
  reject
} from 'ramda'
import getSlotValue from './get-slot-value'

const getAllSlotsValues = slots => compose(
  reject(isNil),
  map(getSlotValue),
  props(slots)
)

export default getAllSlotsValues
