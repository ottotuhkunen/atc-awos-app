const express = require('express');
const basicAuth = require('express-basic-auth')

const app = express();

app.use(basicAuth({
    users: { 'vatscaEFIN': 'HelsinkiAWOS2023!' }, // username, password
    challenge: true
}));

app.use(express.static('.')); // index.html directory

app.listen(3000, function () {
    console.log('App is listening on port 3000!');
});
