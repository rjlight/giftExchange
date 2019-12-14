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
    
    var sqlu = "SELECT a_username, a_password, group_id FROM account WHERE a_username = $1::varchar AND a_password = $2::varchar";

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

            req.session.user = result.rows[0].a_username; //set session vars
            req.session.pass = result.rows[0].a_password; //before they are changed
            req.session.loggedIn = true;
            req.session.group_id = result.rows[0].group_id;
            console.log("group_id: " + result.rows[0].group_id);

            status = {"success":true, "username" :username, "password" :password};
        } 
        res.json(status);
    })
});

app.post("/showMembers", function(req, res) {
    console.log("session user: " + req.session.user);
    console.log("session password: " + req.session.pass);

    var sql;
    var status = {success:false}; //if no one is logged in = false
    var count = 2; //for singles
    var ccount = 2; //for couples
    var group;

    console.log("count: " + count);
    console.log("count rew: " + req.session.count);
    sql = "SELECT single_name1, single_name2, single_name3, single_name4, single_name5, single_name6, single_name7, single_name8, c_first_name1, c_second_name1, c_first_name2, c_second_name2, c_first_name3, c_second_name3, c_first_name4, c_second_name4, c_first_name5, c_second_name5, c_first_name6, c_second_name6, c_first_name7, c_second_name7, c_first_name9, c_second_name9, c_first_name8, c_second_name8, c_first_name10, c_second_name10, c_first_name11, c_second_name11, c_first_name12, c_second_name12, c_first_name13, c_second_name13 FROM groups WHERE group_id = 1";
    
    pool.query(sql, function(err, result) {
        status = {success:false};
        if (req.session.loggedIn) { 
            if(err) {
                console.log("Error with db occurred");
                console.log(err);
            } else if (result.rows.length) {
                //set req.session.single_count = (count + 1);
                //set req.sessions.couple_count = (count + 1);
                console.log("in the elseif: " + count); 
                if (result.rows[0].c_first_name1 && result.rows[0].single_name1) {
                    req.session.group_before_exchange = "<li>" + result.rows[0].single_name1 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name1 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name1 + " </li><br>";
                    req.session.count = count++;
                    req.session.ccount = ccount++;
                    console.log("switch one: " + req.session.count); 
                } else if (result.rows[0].c_first_name1) { //if couple def.
                    req.session.group_before_exchange = "<li>" + result.rows[0].c_first_name1 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name1 + " </li><br>";
                    req.session.ccount = ccount++;
                } else if (result.rows[0].single_name1) { //if single def.
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name1 + " </li><br>";
                    req.session.count = count++;
                } 
                if (result.rows[0].c_first_name2 && result.rows[0].single_name2) {
                    req.session.group_before_exchange = "<li>" + result.rows[0].single_name2 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name2 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name2 + " </li><br>";
                    req.session.count = count++;
                    req.session.ccount = ccount++;
                } else if (result.rows[0].c_first_name2) { //if couple def.
                    req.session.group_before_exchange = "<li>" + result.rows[0].c_first_name2 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name2 + " </li><br>";
                    req.session.ccount = ccount++;
                } else if (result.rows[0].single_name2) { //if single def.
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name2 + " </li><br>";
                    req.session.count = count++;
                    console.log("switch 2, singles"); 
                } 
                if (result.rows[0].c_first_name3 && result.rows[0].single_name3) {
                    req.session.group_before_exchange = "<li>" + result.rows[0].single_name3 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name3 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name3 + " </li><br>";
                    req.session.count = count++;
                    req.session.ccount = ccount++;
                } else if (result.rows[0].c_first_name3) { //if couple def.
                    req.session.group_before_exchange = "<li>" + result.rows[0].c_first_name3 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name3 + " </li><br>";
                    req.session.ccount = ccount++;
                } else if (result.rows[0].single_name3) { //if single def.
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name3 + " </li><br>";
                    req.session.count = count++;
                } 
                if (result.rows[0].c_first_name4 && result.rows[0].single_name4) {
                    req.session.group_before_exchange = "<li>" + result.rows[0].single_name4 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name4 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name4 + " </li><br>";
                    req.session.count = count++;
                    req.session.ccount = ccount++;
                } else if (result.rows[0].c_first_name4) { //if couple def.
                    req.session.group_before_exchange = "<li>" + result.rows[0].c_first_name4 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name4 + " </li><br>";
                    req.session.ccount = ccount++;
                } else if (result.rows[0].single_name4) { //if single def.
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name4 + " </li><br>";
                    req.session.count = count++;
                } 
                if (result.rows[0].c_first_name5 && result.rows[0].single_name5) {
                    req.session.group_before_exchange = "<li>" + result.rows[0].single_name5 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name5 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name5 + " </li><br>";
                    req.session.count = count++;
                    req.session.ccount = ccount++;
                } else if (result.rows[0].c_first_name5) { //if couple def.
                    req.session.group_before_exchange = "<li>" + result.rows[0].c_first_name5 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name5 + " </li><br>";
                    req.session.ccount = ccount++;
                } else if (result.rows[0].single_name5) { //if single def.
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name5 + " </li><br>";
                    req.session.count = count++;
                } 
                if (result.rows[0].c_first_name6 && result.rows[0].single_name6) {
                    req.session.group_before_exchange = "<li>" + result.rows[0].single_name6 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name6 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name6 + " </li><br>";
                    req.session.count = count++;
                    req.session.ccount = ccount++;
                } else if (result.rows[0].c_first_name6) { //if couple def.
                    req.session.group_before_exchange = "<li>" + result.rows[0].c_first_name6 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name6 + " </li><br>";
                    req.session.ccount = ccount++;
                } else if (result.rows[0].single_name6) { //if single def.
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name6 + " </li><br>";
                    req.session.count = count++;
                } 
                if (result.rows[0].c_first_name7 && result.rows[0].single_name7) {
                    req.session.group_before_exchange = "<li>" + result.rows[0].single_name7+ " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name7 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name7 + " </li><br>";
                    req.session.count = count++;
                    req.session.ccount = ccount++;
                } else if (result.rows[0].c_first_name7) { //if couple def.
                    req.session.group_before_exchange = "<li>" + result.rows[0].c_first_name7 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name7 + " </li><br>";
                    req.session.ccount = ccount++;
                } else if (result.rows[0].single_name7) { //if single def.
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name7 + " </li><br>";
                    req.session.count = count++;
                } 
                if (result.rows[0].c_first_name8 && result.rows[0].single_name8) {
                    req.session.group_before_exchange = "<li>" + result.rows[0].single_name8 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name8 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name8 + " </li><br>";
                    req.session.count = count++;
                    req.session.ccount = ccount++;
                } else if (result.rows[0].c_first_name8) { //if couple def.
                    req.session.group_before_exchange = "<li>" + result.rows[0].c_first_name8 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name8 + " </li><br>";
                    req.session.ccount = ccount++;
                } else if (result.rows[0].single_name8) { //if single def.
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name8 + " </li><br>";
                    req.session.count = count++;
                } 
                if (result.rows[0].c_first_name9) {
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name9 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name9 + " </li><br>";
                    req.session.ccount = ccount++;
                } 
                if (result.rows[0].c_first_name10) {
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name10 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name10 + " </li><br>";
                    req.session.ccount = ccount++;
                } 
                if (result.rows[0].c_first_name11) {
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name11 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name11 + " </li><br>";
                    req.session.ccount = ccount++;
                } 
                if (result.rows[0].c_first_name12) {
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name12 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name12 + " </li><br>";
                    req.session.ccount = ccount++;
                } 
                if (result.rows[0].c_first_name13) {
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name13 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name13 + " </li><br>";
                    req.session.ccount = ccount++;
                } 
                group = req.session.group_before_exchange; //to use when we switch
                status = {"success" : true, "group" : group};
            } 
        }
        res.json(status);
        }) 
});

app.post("/addSingles", function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var group_id = req.session.group_id;

    console.log("count #: " + req.session.count + " couples: " + req.session.ccount);
    console.log("group id: " + req.session.group_id);
    console.log("Single Name: " + name);
    console.log("logged in: " + req.session.loggedIn);
    
    var sql = "UPDATE groups SET single_email" + req.session.count + " = $2::varchar, single_name" + req.session.count + " = $1::varchar WHERE group_id = " + group_id;

    req.session.count += 1; //increment the count

    var param = [name, email];

    var message = "Error: Must be logged in to add members!";
    var status = {"success" : false, "message" :  message};

    pool.query(sql, param, function(err, result) {
        if (req.session.loggedIn && (req.session.count <= 8)) {
            console.log("in iffff");
            if(err) {
                console.log("Error with db occurred");
                console.log(err);
                callback(err, null); //pass error along the line
            } else if (result.rows.length) {
                status = {"success" : true, "message" :  message}; //just need to know that it worked
            } 
        } else if(req.session.loggedIn) {
            message = "Error: Can only have 8 single members per group!";
            status = {"success" : false, "message" :  message};
        } 
        console.log(status)
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