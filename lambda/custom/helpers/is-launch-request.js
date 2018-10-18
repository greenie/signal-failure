import { propEq } from 'ramda'

const isLaunchRequest = propEq('type', 'LaunchRequest')

export default isLaunchRequest
