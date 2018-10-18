const LoggingInterceptor = {
  process (handlerInput) {
    console.log(JSON.stringify(handlerInput.requestEnvelope, null, 2))
  }
}

export default LoggingInterceptor
