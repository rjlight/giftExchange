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
        req.session.loggedIn = false;
        console.log("in query");
        if(err) {
            console.log("Error with db occurred");
            console.log(err);
            callback(err, null); //pass error along the line
        } else if (result.rows.length) {

            req.session.user = result.rows[0].group_username; //set session vars
            req.session.pass = result.rows[0].group_password; //before they are changed
            req.session.loggedIn = true;

            status = {"success":true, "username" :username, "password" :password};
        } 
        res.json(status);
    })
});

app.post("/showMembers", function(req, res) {
    console.log("session user: " + req.session.user);
    console.log("session password: " + req.session.pass);

    //db select to show all members
    var sql = "SELECT c.first_person_name, c.second_person_name, s.single_name, g.group_id FROM couples c INNER JOIN association a ON c.couples_id = a.couples_id INNER JOIN singles s ON a.singles_id = s.single_id INNER JOIN groups g ON g.group_id = a.group_id"; 

    var status = {success:false}; //if no one is logged in = false

    pool.query(sql, function(err, result) {
        if (req.session.loggedIn) {
            console.log("in query");
            if(err) {
                console.log("Error with db occurred");
                console.log(err);
                callback(err, null); //pass error along the line
            } else if (result.rows.length) {
                //create a print statement for all names in db
                var group = "<li>" + result.rows[0].first_person_name + "</li><br>";
                group += "<li>" + result.rows[0].second_person_name + "</li><br>";
                group += "<li>" + result.rows[0].single_name + "</li><br>";
                group += "<li>" + result.rows[1].single_name + "</li><br>";
                console.log("first name: " + result.rows[0].first_person_name);
                console.log("second name: " + group);

                req.session.group_id = result.rows[0].group_id;

                req.session.group_before_exchange = group; //to use when we switch
                status = {"success" : true, "group" : group};
            } 
        } res.json(status);
    })
});

app.post("/addSingles", function(req, res) {
    var name = req.body.name;
    var email = req.body.email;

    console.log("Single Name: " + name);
    console.log("Email: " + email);
    
    var sql = "INSERT INTO singles (single_id, single_name, single_email) VALUES (2, $1::varchar, $2::varchar)";

    req.session.singleId = 2;

    var param = [name, email];

    var status = {success:false}; //if no one is logged in = false

    pool.query(sql, param, function(err, result) {
        if (req.session.loggedIn) {
            if(err) {
                console.log("Error with db occurred");
                console.log(err);
                callback(err, null); //pass error along the line
            } else if (result.rows.length) {
                status = {"success" : true}; //just need to know that it worked
            } 
        } res.json(status);
    })
});

app.post("/addSingleGroup", function(req, res) {
    var single_id = req.session.singleId;
    var group_id;
    console.log(id);

    //must get the group_id
    var sql = "INSERT INTO association (group_id, singles_id) VALUES ($1::int, $2::int)";
    var param = [group_id, single_id];

    var status = {success:false}; //if no one is logged in = false

    pool.query(sql, param, function(err, result) {
        if (req.session.loggedIn) {
            if(err) {
                console.log("Error with db occurred");
                console.log(err);
                callback(err, null); //pass error along the line
            } else if (result.rows.length) {
                status = {"success" : true}; //just need to know that it worked
            } 
        } res.json(status);
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