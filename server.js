const express = require('express');
const basicAuth = require('express-basic-auth')

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
});

app.use(basicAuth({
    users: { [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASSWORD },
    challenge: true
}));

app.use(express.static('.')); // index.html directory

app.listen(port, function () {
    console.log('App is listening on port ' + port + '!');
});
