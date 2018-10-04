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
