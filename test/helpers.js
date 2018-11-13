import assert from 'assert'
import getAllSlotsValues from '../lambda/custom/helpers/get-all-slots-values'
import getDescriptions from '../lambda/custom/helpers/get-descriptions'
import getIntent from '../lambda/custom/helpers/get-intent'
import getSlotValue from '../lambda/custom/helpers/get-slot-value'
import intentNameIs from '../lambda/custom/helpers/intent-name-is'
import toSentence from '../lambda/custom/helpers/to-sentence'
import { request } from './request.json'

describe('Helpers', () => {
  describe('getAllSlotsValues', () => {
    it('should return the values for all slots with matched values', () => {
      const actual = getAllSlotsValues(['LineA', 'LineB', 'LineC'])(request.intent.slots)
      const expected = [{ name: 'Jubilee', id: 'jubilee' }]

      assert.deepStrictEqual(actual, expected)
    })
  })

  describe('getSlotValue', () => {
    it('should return the first value for a slot with matched values', () => {
      const actual = getSlotValue(request.intent.slots.LineA)
      const expected = { name: 'Jubilee', id: 'jubilee' }

      assert.deepStrictEqual(actual, expected)
    })

    it('should return `null` for a slot with no matched values', () => {
      const actual = getSlotValue(request.intent.slots.LineB)
      const expected = null

      assert.strictEqual(actual, expected)
    })

    it('should return `undefined` for a nonexistent slot', () => {
      const actual = getSlotValue(request.intent.slots.LineD)
      const expected = undefined

      assert.strictEqual(actual, expected)
    })
  })

  describe('getDescriptions', () => {
    it('should return unique descriptions from a collection of objects with a description property', () => {
      const someDescriptions = [
        { description: 'first' },
        { description: 'second' },
        { description: 'third' },
        { description: 'first' },
        { description: '' }
      ]
      const actual = getDescriptions(someDescriptions)
      const expected = ['first', 'second', 'third']

      assert.deepStrictEqual(actual, expected)
    })
  })

  describe('getIntent', () => {
    it('should return the `intent` part of the request envelope', () => {
      const actual = getIntent(request)
      const expected = request.intent

      assert.strictEqual(actual, expected)
    })
  })

  describe('intentNameIs', () => {
    it('should return `true` if the intent name matches the input', () => {
      const actual = intentNameIs('GetMultiLineDisruptionsIntent')(request)
      const expected = true

      assert.strictEqual(actual, expected)
    })
  })

  describe('toSentence', () => {
    it('should return an empty string for empty arrays', () => {
      const list = []
      const actual = toSentence(list)
      const expected = ''

      assert.strictEqual(actual, expected)
    })

    it('should return the array\'s item for arrays with only one element', () => {
      const list = ['a']
      const actual = toSentence(list)
      const expected = 'a'

      assert.strictEqual(actual, expected)
    })

    it('should return the array\'s items joined with the string \' and \' for arrays with two elements', () => {
      const list = ['a', 'b']
      const actual = toSentence(list)
      const expected = 'a and b'

      assert.strictEqual(actual, expected)
    })

    it('should return the array\'s items as an Oxford Comma style sentence for arrays with three or more elements', () => {
      const list = ['a', 'b', 'c']
      const actual = toSentence(list)
      const expected = 'a, b, and c'

      assert.strictEqual(actual, expected)
    })
  })
})
