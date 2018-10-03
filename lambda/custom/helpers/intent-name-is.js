import { pathEq } from 'ramda'

const intentNameIs = name => pathEq(['intent', 'name'], name)

export default intentNameIs
