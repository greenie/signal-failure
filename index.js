const AWS = require('aws-sdk');
const Alexa = require('alexa-sdk');
const axios = require('axios');
const translations = require('./resources/translations');

let secrets = {};

const lineIdToName = id => {
  switch (id) {
    case 'tfl-rail':
      return 'TfL Rail';

    case 'waterloo-city':
      return 'Waterloo and City';

    case 'london-overground':
      return 'Overground';

    case 'hammersmith-city':
      return 'Hammersmith and City';

    case 'dlr':
      return 'DLR';

    default:
      return `${id.charAt(0).toUpperCase()}${id.slice(1)}`;
  }
};

const fullLineName = id => {
  const noPrefix = ['tfl-rail'];
  const noSuffix = noPrefix.concat(['london-overground', 'dlr']);
  const prefix = !noPrefix.includes(id) ? 'the' : null;
  const suffix = !noSuffix.includes(id) ? 'line' : null;

  return [prefix, lineIdToName(id), suffix].filter(p => p).join(' ');
};

const getValueForSlot = slot => {
  const { resolutions: { resolutionsPerAuthority }, value } = slot;

  if (resolutionsPerAuthority) {
    const matching = resolutionsPerAuthority.find(r => r.status.code === 'ER_SUCCESS_MATCH');
    return matching ? matching.values[0].value.id : null;
  }

  return value;
};

const responseToSpeak = response => {
  return response.replace(/DLR/, '<say-as interpret-as="spell-out">DLR</say-as>');
};

const handlers = {
  'LaunchRequest': function () {
    this.emit(':ask', this.t('HELP_REPROMPT_MESSAGE'));
  },
  'GetDisruptionsIntent': function () {
    console.log(JSON.stringify(this.event.request));

    const { TFL_APP_ID, TFL_API_KEY } = secrets;
    const lineSlot = this.event.request.intent.slots.Line;
    const line = getValueForSlot(lineSlot);

    if (!line) {
      return this.emit(':ask', this.t('UNRECOGNISED_LINE_MESSAGE'));
    }

    const requestOptions = {
      method: 'get',
      url: `/Line/${line}/Disruption`,
      baseURL: 'https://api.tfl.gov.uk',
      params: {
        app_id: TFL_APP_ID,
        app_key: TFL_API_KEY
      }
    };

    axios(requestOptions)
      .then(response => {
        console.log(response);

        if (response.data.length === 0) {
          const goodService = this.t('GOOD_SERVICE_MESSAGE', fullLineName(line));

          this.emit(
            ':tellWithCard',
            responseToSpeak(goodService),
            this.t('GOOD_SERVICE_TITLE'),
            goodService
          );
        } else {
          const description = response.data[0].description;

          this.emit(
            ':tellWithCard',
            responseToSpeak(description),
            this.t('DELAYS_TITLE'),
            description
          );
        }
      })
      .catch(error => {
        const { response, request, message } = error;

        if (response) {
          const { data, status, headers } = response;
          console.log(JSON.stringify({ data, status, headers }));
        } else if (request) {
          console.log(request);
        } else {
          console.log(message);
        }

        this.emit(':tell', this.t('REQUEST_ERROR_MESSAGE'));
      });
  },
  'AMAZON.HelpIntent': function () {
    const fullHelpMessage = this.t('HELP_MESSAGE', this.t('HELP_REPROMPT_MESSAGE'));

    this.emit(
      ':ask',
      responseToSpeak(fullHelpMessage),
      this.t('HELP_REPROMPT_MESSAGE')
    );
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },
  'Unhandled': function () {
    this.emit(':ask', this.t('UNHANDLED_MESSAGE'));
  }
};

const processEvent = (event, context, callback) => {
  let alexa = Alexa.handler(event, context, callback);
  alexa.appId = secrets.SKILL_ID;
  alexa.resources = translations;

  // Fix for the Service Simulator setting applicationId to 'applicationId'
  if (event.context && event.context.System.application.applicationId == 'applicationId') {
    event.context.System.application.applicationId = event.session.application.applicationId;
  }

  alexa.registerHandlers(handlers);
  alexa.execute();
};

exports.handler = (event, context, callback) => {
  if (Object.keys(secrets).length !== 0) {
    processEvent(event, context, callback);
  } else {
    const kms = new AWS.KMS();

    const decrypt = secret => {
      return new Promise((resolve, reject) => {
        const params = { CiphertextBlob: new Buffer(process.env[secret], 'base64') };

        kms.decrypt(params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve([secret, data.Plaintext.toString('ascii')]);
          }
        });
      });
    };

    const toDecrypt = ['SKILL_ID', 'TFL_APP_ID', 'TFL_API_KEY'];

    Promise.all(toDecrypt.map(decrypt))
      .then(decrypted => {
        secrets = decrypted.reduce((prev, secret) => {
          prev[secret[0]] = secret[1];
          return prev;
        }, secrets);

        processEvent(event, context, callback);
      })
      .catch(console.log);
  }
};
