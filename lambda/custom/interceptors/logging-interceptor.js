import log from '../helpers/log'

const LoggingInterceptor = {
  process (handlerInput) {
    log(handlerInput.requestEnvelope)
  }
}

export default LoggingInterceptor
