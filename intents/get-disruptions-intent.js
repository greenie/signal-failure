import axios from 'axios';
import getValueForSlot from '../helpers/get-value-for-slot';
import responseToSpeak from '../helpers/response-to-speak';
import fullLineName from '../helpers/full-line-name';
import getSecret from '../helpers/secrets';
import log from '../helpers/log';

export default async function () {
  log(this.event.request);

  const TFL_APP_ID = await getSecret('TFL_APP_ID');
  const TFL_API_KEY = await getSecret('TFL_API_KEY');
  const lineSlot = this.event.request.intent.slots.Line;
  const line = getValueForSlot(lineSlot);

  if (!line) {
    return this.emit(':ask', this.t('UNRECOGNISED_LINE_MESSAGE'));
  }

  const lineDisruptionsUrl = `/Line/${line}/Disruption`;
  const modeDisruptionsUrl = `/Line/Mode/${line}/Disruption`;
  const requestOptions = {
    method: 'get',
    baseURL: 'https://api.tfl.gov.uk',
    url: (line === 'tube') ? modeDisruptionsUrl : lineDisruptionsUrl,
    params: {
      app_id: TFL_APP_ID,
      app_key: TFL_API_KEY
    }
  };

  axios.interceptors.response.use(
    ({ status, data, headers }) => ({ status, data, headers }),
    error => error
  );

  axios(requestOptions)
    .then(response => {
      const { data } = response;

      log(response);

      if (data.length === 0) {
        const goodService = (line === 'tube')
          ? this.t('GOOD_SERVICE_ALL_LINES_MESSAGE')
          : responseToSpeak(this.t('GOOD_SERVICE_MESSAGE', fullLineName(line)));

        this.emit(
          ':tellWithCard',
          goodService,
          this.t('GOOD_SERVICE_TITLE'),
          goodService
        );
      } else {
        const description = (line === 'tube')
          ? data.map(({ description }) => description).filter(d => d).join('<break strength="strong" />')
          : data[0].description;

        this.emit(
          ':tellWithCard',
          responseToSpeak(description),
          this.t('DELAYS_TITLE'),
          description.replace(/<break[\s+\w*="\w*"]*\s*\/>/g, '\r\n')
        );
      }
    })
    .catch(error => {
      const { response, request, message } = error;

      if (response) {
        const { status, data, headers } = response;
        log({ status, data, headers });

        if (response.status === 404) {
          return this.emit(':ask', this.t('UNRECOGNISED_LINE_MESSAGE'));
        }
      } else if (request) {
        log(request);
      } else {
        log(message);
      }

      this.emit(':tell', this.t('REQUEST_ERROR_MESSAGE'));
    });
}
