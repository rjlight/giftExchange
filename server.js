var express = require("express");
var app = express(); 

app.use(express.static('public'))
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Include to use session
var parseurl = require('parseurl')
var session = require('express-session')

app.use(session({
    secret: 'gift lover',
    resave: false,
    saveUninitialized: true
  }))

//In order to get POST variables
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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

app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    console.log("Username: " + username);
    console.log("password: " + password);
    
    var sqlu = "SELECT group_username, group_password FROM groups WHERE group_username = $1::varchar AND group_password = $2::varchar";

    var paramu = [username, password];

    pool.query(sqlu, paramu, function(err, result) {
        var status = {success:false};
        console.log("in query");
        if(err) {
            console.log("Error with db occurred");
            console.log(err);
            callback(err, null); //pass error along the line
        } else if (result.rows.length) {

            req.session.user = result.rows[0].group_username; //set session vars
            req.session.pass = result.rows[0].group_password; //before they are changed
            
            status = {"success":true, "username" :username, "password" :password};

        } 
        res.json(status);
    })
});

app.post("/showMembers", function(req, res) {
    console.log("session user: " + req.session.user);
    console.log("session password: " + req.session.pass);
    
    var username = req.session.user;
    var password = req.session.pass;
    
    //db select to show all members
    var sqlu = "SELECT group_username, group_password FROM groups WHERE group_username = $1::varchar AND group_password = $2::varchar";

    var paramu = [username, password];

    pool.query(sqlu, paramu, function(err, result) {
        var status = {success:false};
        console.log("in query");
        if(err) {
            console.log("Error with db occurred");
            console.log(err);
            callback(err, null); //pass error along the line
        } else if (result.rows.length) {
            //create a print statement for all names in db
            status = {"success":true, "username" :username, "password" :password};
        } 
        res.json(status);
    })
});

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