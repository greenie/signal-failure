import { prop } from 'ramda'

const getIntent = request => prop('intent', request)

export default getIntent
