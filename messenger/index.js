/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
const verify = (req, res) => {
  if (req.query['hub.verify_token'] === 'WfUnydgxxMXgdExnADGepigdbxqsdVBzjnu') {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Error, wrong validation token')
  }
}

const echo = (req, res) => {
  const handleMessaging = (req, res) => {
    const receivedMessage = (event) => {
      console.log('Message data:', event.message)
    }
    const data = req.body
    if (data.object === 'page') {
      // fb might batch entries and send multiple
      data.entry.forEach((entry) => {
        const pageID = entry.id
        const timeOfEvent = entry.time
        console.log(`New Event: ${entry.id} at ${entry.time}`)
        // iterate over each messaging event
        entry.messaging.forEach((event) => {
          if (event.message) {
            receivedMessage(event)
          } else {
            console.log(`Webhook received unknown event: ${event}`)
          }
        })
      })
    }
    res.sendStatus(200)
  }

  switch (req.method) {
    case 'POST':
      handleMessaging(req, res)
      break
    default:
      res.status(500).send({ error: 'Something blew up!' })
      break
  }
}

exports.echo = echo