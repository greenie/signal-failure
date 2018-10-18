import axios from 'axios'
import RequestError from '../helpers/axios/request-error'
import ResponseError from '../helpers/axios/response-error'

const request = async path => {
  const { TFL_APP_ID, TFL_APP_KEY } = process.env
  const requestOptions = {
    method: 'get',
    baseURL: 'https://api.tfl.gov.uk',
    url: path,
    params: {
      app_id: TFL_APP_ID,
      app_key: TFL_APP_KEY
    },
    timeout: 3000
  }

  try {
    const { status, data, headers } = await axios(requestOptions)
    console.log(JSON.stringify({ status, data, headers }, null, 2))
    return data
  } catch (error) {
    const { message, request, response } = error

    if (response) {
      throw new ResponseError(message, response)
    } else if (request) {
      throw new RequestError(message)
    }

    throw new Error(message)
  }
}

export default request
