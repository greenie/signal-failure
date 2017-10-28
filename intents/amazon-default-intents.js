import responseToSpeak from '../helpers/response-to-speak'

export default {
  'AMAZON.HelpIntent': function () {
    const fullHelpMessage = this.t('HELP_MESSAGE', this.t('HELP_REPROMPT_MESSAGE'))

    this.emit(
      ':ask',
      responseToSpeak(fullHelpMessage),
      this.t('HELP_REPROMPT_MESSAGE')
    )
  },

  'AMAZON.CancelIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'))
  },

  'AMAZON.StopIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'))
  }
}
