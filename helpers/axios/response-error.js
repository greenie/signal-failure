class ResponseError extends Error {
  constructor (message, response) {
    super(message)
    this.name = 'ResponseError'
    this.status = response.status
    this.data = response.data
    this.headers = response.headers
  }
}

export default ResponseError
