import {
  cond,
  compose,
  equals,
  length,
  converge,
  concat,
  head,
  last,
  T,
  join,
  slice
} from 'ramda'

const toSentence = cond([
  [
    compose(equals(1), length),
    head
  ],
  [
    compose(equals(2), length),
    join(' and ')
  ],
  [
    T,
    converge(
      concat,
      [
        compose(
          join(', '),
          slice(0, -1)
        ),
        compose(
          concat(', and '),
          last
        )
      ]
    )
  ]
])

export default toSentence
