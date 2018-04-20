import * as Alexa from 'ask-sdk-core'
import HelpIntent from './intents/help-intent'
import GetLineDisruptionsIntent from './intents/get-line-disruptions-intent'
import GetTubeDisruptionsIntent from './intents/get-tube-disruptions-intent'
import ExitIntent from './intents/exit-intent'
import LocalisationInterceptor from './interceptors/localisation-interceptor'
import Unhandled from './intents/unhandled'

const handler = Alexa.SkillBuilders.custom()
  .withSkillId(process.env.SKILL_ID)
  .addRequestHandlers(
    HelpIntent,
    GetLineDisruptionsIntent,
    GetTubeDisruptionsIntent,
    ExitIntent
  )
  .addRequestInterceptors(LocalisationInterceptor)
  .addErrorHandlers(Unhandled)
  .lambda()

export { handler }
