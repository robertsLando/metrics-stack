const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const index = require('./routes/index')

const app = express()
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
app.use(cookieParser())

app.use('/', index)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

process.removeAllListeners('SIGINT')

async function gracefuShutdown () {
  console.log('Shutdown detected. Clean up stuff...')
  // TODO: close database
  return process.exit()
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, gracefuShutdown)
}

module.exports = app
