import { propEq } from 'ramda'

const requestTypeIs = type => propEq('type', type)

export default requestTypeIs
