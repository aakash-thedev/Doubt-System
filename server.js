const express = require('express');
const app = express();
const PORT = process.env.PORT || 7000;
const db = require('./config/mongoose');
const routes = require('./routes');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const passLocalStrategy = require('./config/passport_local_strategy');
const cookieParser = require('cookie-parser');

app.use(express.urlencoded());
app.use(expressLayouts);
app.use(cookieParser());

app.use('*/assets', express.static('./assets'));

// layouts ki styling ke alawa agar individual pages ki styling krni ho
// tb style aur script tags ko unki respective sahi positions me hi rkhne ke liye
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// to set view engine as EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// session middleware
// also mongoStore is used to store the session cookie in the db
app.use(session({
    // name is name of cookie
    name : 'doubtsystem',
    // this secret field is the encrypted text which we will generate later during production / deployment
    secret : 'codingninjasdoubtsystem',
    saveUninitialized : false,
    resave : false,
    cookie : {
        // maxAge is in milliseconds
        maxAge : (1000 * 60 * 100)
    },
    store : new MongoStore({
        mongooseConnection : db,
        autoRemove : 'disabled'
    }, function(err) { console.log(err || 'connect-mongodb setup ok') } )

}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use('/', routes);

app.listen(PORT, function(err){
    if(err) { console.log("Error running server"); return; }

    console.log("Server running on port ", PORT);
});