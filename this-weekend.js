const axios = require('axios')
const libxml = require('libxmljs')

const { TFL_APP_ID, TFL_APP_KEY } = process.env

const requestOptions = {
  method: 'get',
  url: 'https://data.tfl.gov.uk/tfl/syndication/feeds/TubeThisWeekend_v2.xml',
  params: {
    app_id: TFL_APP_ID,
    app_key: TFL_APP_KEY
  },
  timeout: 3000
}

async function getFeed () {
  const { data } = await axios(requestOptions)
  const doc = libxml.parseXml(data)

  console.log(doc.root().childNodes().toString())
}

getFeed()
