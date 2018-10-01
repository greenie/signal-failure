import {
  compose,
  cond,
  prop,
  pathEq,
  path,
  head,
  T,
  always
} from 'ramda'

const getResolutions = path(['resolutions', 'resolutionsPerAuthority'])

const getSlotValues = cond([
  [
    getResolutions,
    compose(
      cond([
        [
          pathEq(['status', 'code'], 'ER_SUCCESS_MATCH'),
          prop('values')
        ],
        [T, always(undefined)]
      ]),
      head,
      getResolutions
    )
  ],
  [T, always(undefined)]
])

export default getSlotValues
