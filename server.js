var express = require("express");
var app = express();

app.use(express.static('public'))
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const { Pool } = require("pg");

//database connection
const connectionString = process.env.DATABASE_URL || "postgres://giftadmin:gifty@localhost:5432/familygiftexchange";
//how we will connect
const pool = new Pool({connectionString: connectionString});

app.set("port", (process.env.PORT || 5000));

app.get("/gift", getGift);

app.listen(app.get("port"), function() {
    console.log("Now listening for connections on port : ", app.get("port"));
}); //will listen on above port

function getGift(req, res){
    console.log("Getting gift info");

    var id = req.query.id; //query parameter with id
    console.log("Getting id: ", id);
    
    getPersonFromDb(id, function(error, result) {
        
        if (error || result == null || result.length != 1) {
            res.status(500).json({success:false, data: error});
        } else {
            console.log("Back from the database w/o error + results: ", result);
            res.json(result[0]); //first person
        }
    });
}

function getPersonFromDb(id, callback) {
    console.log("getpersonfromdb called with id: ", id);

    var sql = "SELECT single_name, single_email FROM singles WHERE single_id = $1::int";
    var params = [id];

    pool.query(sql, params, function(err, result) {
        if(err) {
            console.log("Error with db occurred");
            console.log(err);
            callback(err, null); //pass error along the line
        }
        console.log("Found db result: " + JSON.stringify(result.rows));

        callback(null, result.rows);
    })
}