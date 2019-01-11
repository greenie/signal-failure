import {
  always,
  compose,
  cond,
  find,
  head,
  isNil,
  path,
  pathEq,
  prop,
  T
} from 'ramda'

const getSlotValue = compose(
  cond([
    [isNil, always(undefined)],
    [
      T,
      compose(
        cond([
          [isNil, always(null)],
          [
            T,
            compose(
              prop('value'),
              head,
              prop('values')
            )
          ]
        ]),
        find(pathEq(['status', 'code'], 'ER_SUCCESS_MATCH'))
      )
    ]
  ]),
  path(['resolutions', 'resolutionsPerAuthority'])
)

export default getSlotValue
