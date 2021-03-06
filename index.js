require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

mongoose.connect(`mongodb://${username}:${password}@nosama-shard-00-00-dstgw.gcp.mongodb.net:27017,nosama-shard-00-01-dstgw.gcp.mongodb.net:27017,nosama-shard-00-02-dstgw.gcp.mongodb.net:27017/${dbName}?replicaSet=NOsama-shard-0&ssl=true&authSource=admin`, {
    useNewUrlParser: true,
});

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());

/**
 * declare and route api User
 * @type {*}
 */
const userRoute = require('./routes/userRoute');
app.use('/user', userRoute);

app.listen(PORT, () => {
    console.log(`Server lives! Port: ${PORT}`);
});