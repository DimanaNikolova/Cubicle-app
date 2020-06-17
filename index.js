// const url = 'mongodb://localhost:27017';
// const { MongoClient } = require("mongodb");
// const client = new MongoClient(url)

global.__basedir = __dirname
const dbConnector = require('./config/db')
dbConnector().then(function () {
    const config = require('./config/config')
    const app = require('express')();

    require('./config/express')(app);
    require('./config/routes')(app);

    app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));
}).catch(err => {
    console.log(err)
})