class RequestError extends Error {
  constructor (message) {
    super(message)
    this.name = 'RequestError'
  }
}

export default RequestError
