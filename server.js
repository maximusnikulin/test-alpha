const express = require('express')
const app = express()

const persons = require('./persons.json')

app.set('view engine', 'ejs')
app.set('views', __dirname)

app.use(express.static('public'))

app.get('/', (req, res) => res.render('index'))
app.get('/persons', (req, res) => {
  res.json(persons)
})

app.listen(3000, '0.0.0.0', () => console.log('Step by to us on 3000 port'))
