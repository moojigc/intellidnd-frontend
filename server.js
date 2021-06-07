const {
    createServer
} = require("http");
const fs = require('fs');
const app = require("./dist/App.js");

createServer((req, res) => {
    const {
        html
    } = app.render({
        url: req.url
    });

    res.write(fs.readFileSync(__dirname + '/public/index.html', { encoding: 'utf-8' }));

    res.end();
}).listen(3000);