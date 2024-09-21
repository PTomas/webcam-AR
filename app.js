const express = require('express');
const path = require('path');
const { fileURLToPath } = require('url');
const router = require('./routes/router.js');
const exphbs = require('express-handlebars')

const app = express();
app.use(express.static("public"));
// app.use('/js', express.static(path.join(__dirname + "/public/js")));
app.use('/css', express.static(path.join(__dirname + "/public/css")));

const port = process.env.PORT || 3000;

var hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: 'views/layouts',
  extname: '.hbs'
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use('/', require('./routes/router.js'));

app.listen(port, function () {
  console.log('Server started at http://localhost:' + port);
});