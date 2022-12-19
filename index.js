const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3030;

app.use(bodyParser.json());

app.post('/day-webhook', (req, res) => {
    if(req.body?.type==="url_verification") {
        res.send(req.body?.challenge);
    } else if(req.body?.event?.type==="message") {
        console.log(req.body?.event?.text);
        res.send("");
    } else {
        res.statusCode = 400;
        res.send("unknown command");
    }
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});