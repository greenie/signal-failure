import request from './request'

const getModeDisruptions = async mode => {
  const path = `/Line/Mode/${mode}/Disruption`
  return request(path)
}

export default getModeDisruptions
