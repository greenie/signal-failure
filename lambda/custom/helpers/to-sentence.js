import {
  always,
  compose,
  concat,
  cond,
  converge,
  equals,
  head,
  isEmpty,
  join,
  last,
  length,
  slice,
  T
} from 'ramda'

const toSentence = cond([
  [
    isEmpty,
    always('')
  ],
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
