const express = require('express'),
    exphbs = require('express-handlebars'),
    PORT = process.env.PORT || 3000;

const app = express(),
    routes = require('./routes/router');

app.use(express.static("public"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .engine("handlebars", exphbs({ defaultLayout: "main" }))
    .set("view engine", "handlebars")
    .use(routes)
    .listen(PORT, error => {
    if (error) throw error;
    else console.log(`Listening on ${process.env.PORT ? 'https://burger-app-mooj.herokuapp.com/' : `localhost:${PORT}`}`);
});
