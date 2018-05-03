import responseToSpeak from '../helpers/response-to-speak'

const SpeechInterceptor = {
  process (handlerInput, response) {
    if (response && response.outputSpeech) {
      response.outputSpeech.ssml = responseToSpeak(response.outputSpeech.ssml)
    }
  }
}

export default SpeechInterceptor
