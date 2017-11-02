import axios from 'axios'
import getSecret from '../helpers/secrets'
import log from '../helpers/log'
import formatRequestError from './format-request-error'

axios.interceptors.response.use(
  ({ status, data, headers }) => ({ status, data, headers })
)

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
    const response = await axios(requestOptions)
    log(response)
    return response.data
  } catch (error) {
    throw formatRequestError(error)
  }
}

export default request
