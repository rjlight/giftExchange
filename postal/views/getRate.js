const express = require('express')
const app = express()
const port = process.env.PORT || 3001

app.use(express.static('public'))
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    console.log("got a get");
});

app.get("/calc", calculateRate); 

function calculateRate(req, res) { //this is where we compute the total
    var weight = req.query.weight;
    var type = req.query.type;
    var total;
    switch(type) {
        case 'stamped':
            type = 'Letter (Stamped)';
            if (weight <= 0) {
                total = 'Error: Cannot send a letter with a weight less than 0';
            } else if (weight <= 1) {
                total = '$0.55';
            } else if (weight <= 2) {
                total = '$0.70';
            } else if (weight <= 3) {
                total = '$0.85';
            } else if (weight <= 3.5) {
                total = '$1.00';
            } else {
                total = 'Error: Cannot send a letter with a weight greater than 3.5';
            }
          break;
       case 'metered':
           type = 'Letters (Metered)';
            if (weight <= 0) {
                total = 'Error: Cannot send a letter with a weight less than 0';
            } else if (weight <= 1) {
                total = '$0.50';
            } else if (weight <= 2) {
                total = '$0.65';
            } else if (weight <= 3) {
                total = '$0.80';
            } else if (weight <= 3.5) {
                total = '$0.95';
            } else {
                total = 'Error: Cannot send a letter with a weight less than 3.5';
            }
          break;
       case 'flats':
           type = 'Large Envelope (Flat)';
            if (weight <= 0) {
                total = 'Error: Cannot send an envelope with a weight less than 0';
            } else if (weight <= 1) {
                total = '$1.00';
            } else if (weight <= 2) {
                total = '$1.15';
            } else if (weight <= 3) {
                total = '$1.30';
            } else if (weight <= 4) {
                total = '$1.45';
            } else if (weight <= 5) {
                total = '$1.60';
            } else if (weight <= 6) {
                total = '$1.75';
            } else if (weight <= 7) {
                total = '$1.90';
            } else if (weight <= 8) {
                total = '$2.05';
            } else if (weight <= 9) {
                total = '$2.20';
            } else if (weight <= 10) {
                total = '$2.35';
            } else if (weight <= 11) {
                total = '$2.50';
            } else if (weight <= 12) {
                total = '$2.65';
            } else if (weight <= 13) {
                total = '$2.80';
            } else {
                total = 'Error: Cannot send a envelope with a weight greater than 13';
            }
          break;
       case 'retail':
           type = 'First-Class Packge Service—Retail';
            if (weight <= 0) {
                total = 'Error: Cannot send a parcel with a weight less than 0';
            } else if (weight <= 4) {
                total = '$3.66';
            } else if (weight <= 8 && weight > 4) {
                total = '$4.39';
            } else if (weight <= 12 && weight > 8) {
                total = '$5.19';
            } else if (weight <= 13) {
                total = '$5.71';
            } else {
                total = 'Error: Cannot send a parcel with a weight greater than 13';
            }
          break;
      }
        console.log(total);
      
    const params = {mail: type, weight: weight, total: total};
    res.render('rate', params);
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))