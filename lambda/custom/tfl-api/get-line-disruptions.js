import request from './request'

const getLineDisruptions = async (line, ...lines) => {
  const path = `/Line/${[line].concat(lines).join(',')}/Disruption`
  return request(path)
}

export default getLineDisruptions
