const { google } = require('googleapis'),
    express = require('express'),
    exphbs = require('express-handlebars'),
    path = require('path'),
    { private_key_id, private_key } = process.env || require('./config.json'),
    PORT = process.env.PORT || 3000,
    redirect = process.env.PORT ? "https://dnd-inventory-web.herokuapp.com/:" : `http://localhost:${PORT}`;

// const createConnection = () => {
//     return new google.auth.OAuth2(
//         private_key_id,
//         private_key,
//         redirect
//     )
// }

const app = express(),
    routes = require('./routes/router');

app.use(express.static("public"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .engine("handlebars", exphbs({ defaultLayout: "main" }))
    .set("view engine", "handlebars");

app.use(routes);

app.listen(PORT, function(error) {
    if (error) throw error;
    else console.log(`Listening on ${process.env.PORT ? 'https://burger-app-mooj.herokuapp.com/' : `localhost:${PORT}`}`);
});
