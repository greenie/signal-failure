import responseToSpeak from '../helpers/response-to-speak'
import log from '../helpers/log'

export default {
  'AMAZON.HelpIntent': function () {
    const { event: { request } } = this
    log(request)

    const fullHelpMessage = this.t('HELP_MESSAGE', this.t('HELP_REPROMPT_MESSAGE'))

    return this.emit(
      ':ask',
      responseToSpeak(fullHelpMessage),
      this.t('HELP_REPROMPT_MESSAGE')
    )
  },

  'AMAZON.CancelIntent': function () {
    const { event: { request } } = this
    log(request)

    return this.emit(':tell', this.t('STOP_MESSAGE'))
  },

  'AMAZON.StopIntent': function () {
    const { event: { request } } = this
    log(request)

    return this.emit(':tell', this.t('STOP_MESSAGE'))
  }
}
