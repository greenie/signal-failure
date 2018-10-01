import { pathEq } from 'ramda'

const intentRequestNameIs = name => pathEq(['intent', 'name'], name)

export default intentRequestNameIs
