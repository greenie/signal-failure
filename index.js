import Alexa from 'alexa-sdk'
import translations from './resources/translations'
import LaunchRequest from './intents/launch-request'
import GetLineDisruptionsIntent from './intents/get-line-disruptions-intent'
import GetTubeDisruptionsIntent from './intents/get-tube-disruptions-intent'
import AmazonDefaultIntents from './intents/amazon-default-intents'
import Unhandled from './intents/unhandled'
import getSecret from './helpers/secrets'

export const handler = async (event, context, callback) => {
  let alexa = Alexa.handler(event, context, callback)
  alexa.appId = await getSecret('SKILL_ID')
  alexa.resources = translations

  const handlers = {
    LaunchRequest,
    GetLineDisruptionsIntent,
    GetTubeDisruptionsIntent,
    ...AmazonDefaultIntents,
    Unhandled
  }

  alexa.registerHandlers(handlers)
  alexa.execute()
}
