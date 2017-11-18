import axios from 'axios'
import getSecret from '../helpers/secrets'
import log from '../helpers/log'
import RequestError from '../helpers/axios/request-error'
import ResponseError from '../helpers/axios/response-error'

const request = async path => {
  const TFL_APP_ID = await getSecret('TFL_APP_ID')
  const TFL_API_KEY = await getSecret('TFL_API_KEY')
  const requestOptions = {
    method: 'get',
    baseURL: 'https://api.tfl.gov.uk',
    url: path,
    params: {
      app_id: TFL_APP_ID,
      app_key: TFL_API_KEY
    },
    timeout: 3000
  }

  try {
    const { status, data, headers } = await axios(requestOptions)
    log({ status, data, headers })
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
