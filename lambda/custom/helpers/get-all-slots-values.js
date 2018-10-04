import {
  compose,
  props,
  map,
  filter,
  complement,
  isNil
} from 'ramda'
import getSlotValue from './get-slot-value'

const getAllSlotsValues = slots => compose(
  filter(complement(isNil)),
  map(getSlotValue),
  props(slots)
)

export default getAllSlotsValues
