import {
  always,
  compose,
  cond,
  head,
  path,
  pathEq,
  prop,
  T
} from 'ramda'

const getResolutions = path(['resolutions', 'resolutionsPerAuthority'])

const getSlotValue = cond([
  [
    getResolutions,
    compose(
      cond([
        [
          pathEq(['status', 'code'], 'ER_SUCCESS_MATCH'),
          compose(
            prop('value'),
            head,
            prop('values')
          )
        ],
        [T, always(null)]
      ]),
      head,
      getResolutions
    )
  ],
  [T, always(undefined)]
])

export default getSlotValue
