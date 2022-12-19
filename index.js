require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const Airtable = require('airtable');
const PORT = process.env.PORT || 3030;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: AIRTABLE_API_KEY
});
var base = Airtable.base(AIRTABLE_BASE_ID);

app.use(bodyParser.json());

function addEntry(text) {
    const val = (text ?? "").split(" ");
    const day = {fields: {Valor:parseFloat(val[0]), Categoria: val[1]}};
    if(day.fields.Valor && day.fields.Categoria) {    
        base('Day').create([
            day
        ], function(err, records) {
            if (err) {
                console.error(err);
            return;
            }
            records.forEach(function (record) {
                console.log(record.getId());
                console.log(record.fields);
            });
        });
    }
}

app.post('/day-webhook', (req, res) => {
    if(req.body?.type==="url_verification") {
        res.send(req.body?.challenge);
    } else if(req.body?.event?.type==="message") {
        addEntry(req.body?.event?.text);
        res.send("");
    } else {
        res.statusCode = 400;
        res.send("unknown command");
    }
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});