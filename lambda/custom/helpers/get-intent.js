import { compose, prop } from 'ramda'
import getRequest from './get-request'

const getIntent = compose(
  prop('intent'),
  getRequest
)

export default getIntent
