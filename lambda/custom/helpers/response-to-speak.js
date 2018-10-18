import { compose, replace } from 'ramda'

const responseToSpeak = compose(
  replace(/&/g, 'and'),
  replace(/DLR/g, '<say-as interpret-as="spell-out">DLR</say-as>')
)

export default responseToSpeak
