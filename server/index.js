const express = require('express');
const app = express();
const port = process.env.port || 3000;
const DB = require('./config/mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const path = require('path');
const db = require('../server/config/mongoose');
const MongoStore = require('connect-mongo');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
passport.use('local-register', passportLocal.localRegister);
passport.use('local-login', passportLocal.localLogin);
app.use('/', require('./routes'));

app.listen(port, function(error){
    if(error){
        console.log('Error', error);
    }
    console.log(`Server running successfully on port : ${port}`);
});