import log from '../helpers/log'

export default function () {
  const { event: { request } } = this
  log(request)

  this.emit('GetTubeDisruptionsIntent')
}
