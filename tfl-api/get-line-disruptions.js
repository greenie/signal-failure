import request from './request'

const getLineDisruptions = async line => {
  const path = `/Line/${line}/Disruption`
  return request(path)
}

export default getLineDisruptions
