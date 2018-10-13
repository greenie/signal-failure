import {
  complement,
  compose,
  filter,
  isNil,
  map,
  props
} from 'ramda'
import getSlotValue from './get-slot-value'

const getAllSlotsValues = slots => compose(
  filter(complement(isNil)),
  map(getSlotValue),
  props(slots)
)

export default getAllSlotsValues
