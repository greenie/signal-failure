import { propEq } from 'ramda'

const requestDialogIs = state => propEq('dialogState', state)

export default requestDialogIs
