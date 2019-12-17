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

//to send email
var nodemailer = require('nodemailer'); 

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
    var count = 1; //for singles
    var ccount = 1; //for couples
    req.session.count = count; //reset the count
    req.session.ccount = ccount; //reset the count 
    req.session.group_before_exchange = "";

    //will use this to compute exchange
    req.session.to_sort = {};
    var i = 0;
    //req.session.to_sort[i] = '';

    console.log("count: " + count);
    console.log("count rew: " + req.session.count);
    sql = "SELECT single_name1, single_name2, single_name3, single_name4, single_name5, single_name6, single_name7, single_name8, c_first_name1, c_second_name1, c_first_name2, c_second_name2, c_first_name3, c_second_name3, c_first_name4, c_second_name4, c_first_name5, c_second_name5, c_first_name6, c_second_name6, c_first_name7, c_second_name7, c_first_name9, c_second_name9, c_first_name8, c_second_name8, c_first_name10, c_second_name10, c_first_name11, c_second_name11, c_first_name12, c_second_name12, c_first_name13, c_second_name13 FROM groups WHERE group_id = " + req.session.group_id;
    
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
                    console.log(result.rows[0].single_name1);
                    req.session.to_sort[i] = '' //must initialize each index before filling it
                    req.session.to_sort[i++] += result.rows[0].single_name1;
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name1
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name1
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name1 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name1 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name1 + " </li><br>";
                    console.log("group session B1: " + req.session.group_before_exchange);
                    req.session.count = count++;
                    req.session.ccount = ccount++;
                    console.log("switch one: " + req.session.count); 
                } else if (result.rows[0].c_first_name1) { //if couple def.
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name1
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name1
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name1 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name1 + " </li><br>";
                    req.session.ccount = ccount++;
                } else if (result.rows[0].single_name1) { //if single def.
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].single_name1;
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name1 + " </li><br>";
                    req.session.count = count++;
                } 
                if (result.rows[0].c_first_name2 && result.rows[0].single_name2) {
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].single_name2;
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name2
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name2
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name2 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name2 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name2 + " </li><br>";
                    req.session.count = count++;
                    req.session.ccount = ccount++;
                    console.log("switch 2");
                } else if (result.rows[0].c_first_name2) { //if couple def.
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name2
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name2
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name2 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name2 + " </li><br>";
                    req.session.ccount = ccount++;
                } else if (result.rows[0].single_name2) { //if single def.
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].single_name2;
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name2 + " </li><br>";
                    req.session.count = count++;
                    console.log("switch 2, singles"); 
                } 
                if (result.rows[0].c_first_name3 && result.rows[0].single_name3) {
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].single_name3;
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name3
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name3
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name3 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name3 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name3 + " </li><br>";
                    req.session.count = count++;
                    req.session.ccount = ccount++;
                    console.log("switch 3");
                } else if (result.rows[0].c_first_name3) { //if couple def.
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name3
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name3
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name3 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name3 + " </li><br>";
                    req.session.ccount = ccount++;
                } else if (result.rows[0].single_name3) { //if single def.
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].single_name3;
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name3 + " </li><br>";
                    req.session.count = count++;
                } 
                if (result.rows[0].c_first_name4 && result.rows[0].single_name4) {
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].single_name4;
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name4
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name4
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name4 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name4 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name4 + " </li><br>";
                    req.session.count = count++;
                    req.session.ccount = ccount++;
                } else if (result.rows[0].c_first_name4) { //if couple def.
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name4
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name4
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name4 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name4 + " </li><br>";
                    req.session.ccount = ccount++;
                } else if (result.rows[0].single_name4) { //if single def.
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].single_name4;
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name4 + " </li><br>";
                    req.session.count = count++;
                } 
                if (result.rows[0].c_first_name5 && result.rows[0].single_name5) {
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].single_name5;
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name5
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name5
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name5 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name5 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name5 + " </li><br>";
                    req.session.count = count++;
                    req.session.ccount = ccount++;
                } else if (result.rows[0].c_first_name5) { //if couple def.
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name5
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name5
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name5 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name5 + " </li><br>";
                    req.session.ccount = ccount++;
                } else if (result.rows[0].single_name5) { //if single def.
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].single_name5
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name5 + " </li><br>";
                    req.session.count = count++;
                } 
                if (result.rows[0].c_first_name6 && result.rows[0].single_name6) {
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].single_name6;
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name6
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name6
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name6 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name6 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name6 + " </li><br>";
                    req.session.count = count++;
                    req.session.ccount = ccount++;
                } else if (result.rows[0].c_first_name6) { //if couple def.
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name6
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name6
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name6 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name6 + " </li><br>";
                    req.session.ccount = ccount++;
                } else if (result.rows[0].single_name6) { //if single def.
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].single_name6
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name6 + " </li><br>";
                    req.session.count = count++;
                } 
                if (result.rows[0].c_first_name7 && result.rows[0].single_name7) {
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].single_name7;
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name7
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name7
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name7+ " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name7 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name7 + " </li><br>";
                    req.session.count = count++;
                    req.session.ccount = ccount++;
                } else if (result.rows[0].c_first_name7) { //if couple def.
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name7
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name7
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name7 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name7 + " </li><br>";
                    req.session.ccount = ccount++;
                } else if (result.rows[0].single_name7) { //if single def.
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].single_name7
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name7 + " </li><br>";
                    req.session.count = count++;
                } 
                if (result.rows[0].c_first_name8 && result.rows[0].single_name8) {
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].single_name8;
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name8
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name8
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name8 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name8 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name8 + " </li><br>";
                    req.session.count = count++;
                    req.session.ccount = ccount++;
                } else if (result.rows[0].c_first_name8) { //if couple def.
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name8
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name8
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name8 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name8 + " </li><br>";
                    req.session.ccount = ccount++;
                } else if (result.rows[0].single_name8) { //if single def.
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].single_name8
                    req.session.group_before_exchange += "<li>" + result.rows[0].single_name8 + " </li><br>";
                    req.session.count = count++;
                } 
                if (result.rows[0].c_first_name9) {
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name9
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name9
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name9 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name9 + " </li><br>";
                    req.session.ccount = ccount++;
                } 
                if (result.rows[0].c_first_name10) {
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name10
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name10
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name10 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name10 + " </li><br>";
                    req.session.ccount = ccount++;
                } 
                if (result.rows[0].c_first_name11) {
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name11
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name11
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name11 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name11 + " </li><br>";
                    req.session.ccount = ccount++;
                } 
                if (result.rows[0].c_first_name12) {
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name12
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name12
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name12 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name12 + " </li><br>";
                    req.session.ccount = ccount++;
                } 
                if (result.rows[0].c_first_name13) {
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_first_name13
                    req.session.to_sort[i] = ''
                    req.session.to_sort[i++] += result.rows[0].c_second_name13
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_first_name13 + " </li><br>";
                    req.session.group_before_exchange += "<li>" + result.rows[0].c_second_name13 + " </li><br>";
                    req.session.ccount = ccount++;
                }
                req.session.sortArrayLength = i;
                console.log("group stuff: " + req.session.to_sort[0]);
                console.log("group stuff: " + req.session.to_sort[4]);
                console.log("group stuff: " + req.session.sortArrayLength + " and i: " + i);
                console.log("group session: " + req.session.group_before_exchange);
                status = {"success" : true, "group" : req.session.group_before_exchange};
            } 
        }
        res.json(status);
        }) 
});

app.post("/assignNames", function(req, res) {
    var len = req.session.sortArrayLength;
    req.session.mixed = '';

    if (req.session.loggedIn && req.session.group_before_exchange) {
        var to_mix = {};
        var mixed = {};

        for (var i = 0; i < req.session.sortArrayLength; i++) {
            to_mix[i] = req.session.to_sort[i];
            mixed[i] = req.session.to_sort[i];
        }
        //console.log("to_mix: " + to_mix[0] + " "+ to_mix[4]);
    }

    while (--len) {
        var j = Math.floor(Math.random() * (len + 1))

        var temp = mixed[len];
        mixed[len] = mixed[j];
        mixed[j] = temp;
    }

    for (var i = 0; i < req.session.sortArrayLength; i++) {
        console.log("to_mix: " + to_mix[i]);
        console.log("mixed: " + mixed[i]);
        req.session.mixed += "<li>" + to_mix[i] + " - " + mixed[i] + " </li><br>"
    }
    status = {"success" : true, "mixed" : req.session.mixed};
    res.json(status);
});

app.post("/getGroupId", function(req, res) {
//function getGroupId() {
    req.session.account_create_id = "";
    var sql = "SELECT group_id FROM account";

    var message = "Error: Cannot be logged in to create a new account!";
    var status = {"success" : false, "message" :  message};

    pool.query(sql, function(err, result) {
        if (!req.session.loggedIn) { //not logged in
            if(err) {
                console.log("Error with db occurred");
                console.log(err);
                callback(err, null); //pass error along the line
            } else {
                for (var i = 0; i < result.rows.length; i++) { //find group id in db
                    req.session.account_create_id = result.rows[i].group_id
                }
                req.session.account_create_id += 1; //go one past it for the new group
                message = "Account created. Group id: " + req.session.account_create_id;
                status = {"success" : true, "message" :  message};
            }
        } 
        console.log(status)
        res.json(status);
    }) 
});

app.post("/createGroup", function(req, res) {
    var group_id = req.session.account_create_id;
    console.log("group id in Create Group: " + group_id);
    var sql = "INSERT INTO groups (group_id) VALUES (" + group_id + ")";
    
    var message = "Error: in group!";
    var status = {"success" : false, "message" :  message};

    pool.query(sql, function(err, result) {
        if(err) {
            console.log("Error with db occurred");
            console.log(err);
            callback(err, null); //pass error along the line
        } else {
            message = "Created group!";
            status = {"success" : true, "message" :  message};
        } 
        res.json(status);
    })
}); 

app.post("/createAccount", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
    console.log("Username: " + username);
    console.log("password: " + password);

    var group_id = req.session.account_create_id;
    var sql = "INSERT INTO account (a_username, a_password, group_id) VALUES ($1::varchar, $2::varchar, " + group_id + ")";

    var param = [username, password];
    
    var message = "Error: in createAccount!";
    var status = {"success" : false, "message" :  message};

    pool.query(sql, param, function(err, result) {
        if(err) {
            console.log("Error with db occurred");
            console.log(err);
            callback(err, null); //pass error along the line
        } else {
            message = "Account created";
            status = {"success" : true, "message" :  message};
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
            } else //if (result.rows.length) {
                status = {"success" : true, "message" :  message}; //just need to know that it worked
            //} 
        } else if(req.session.loggedIn) {
            message = "Error: Can only have 8 single members per group!";
            status = {"success" : false, "message" :  message};
        } 
        console.log(status)
        res.json(status);
    })  
});

app.post("/addCouples", function(req, res) {
    var name1 = req.body.name1;
    var name2 = req.body.name2
    var email = req.body.email;
    var group_id = req.session.group_id;

    console.log("count #: " + req.session.count + " couples: " + req.session.ccount);
    //console.log("group id: " + req.session.group_id);
    //console.log("logged in: " + req.session.loggedIn);
    
    var sql = "UPDATE groups SET c_first_name" + req.session.ccount + " = $1::varchar, c_second_name" + req.session.ccount + " = $2::varchar, couple_email" + req.session.ccount + " = $3::varchar WHERE group_id = " + group_id;

    req.session.ccount += 1; //increment the count

    var param = [name1, name2, email];

    var message = "Error: Must be logged in to add members!";
    var status = {"success" : false, "message" :  message};

    pool.query(sql, param, function(err, result) {
        if (req.session.loggedIn && (req.session.ccount <= 13)) {
            console.log("in iffff");
            if(err) {
                console.log("Error with db occurred");
                console.log(err);
                callback(err, null); //pass error along the line
            } else //if (result.rows.length) {
                  status = {"success" : true, "message" :  message}; //just need to know that it worked
           // } 
        } else if(req.session.loggedIn) {
            message = "Error: Can only have 13 couples per group!";
            status = {"success" : false, "message" :  message};
        } 
        console.log(status)
        res.json(status);
    })  
});

app.post("/getEmail", function(req, res)  {
    var sql;
    var status = {success:false}; //if no one is logged in = false
     
    req.session.emails = "";

    sql = "SELECT single_email1, couple_email1, single_email2, couple_email2, single_email3, couple_email3, single_email4, couple_email4, single_email5, couple_email5, single_email6, couple_email6, single_email7, couple_email7, single_email8, couple_email8, couple_email9, couple_email10, couple_email11, couple_email12, couple_email13 FROM groups WHERE group_id =" + req.session.group_id;
   
    pool.query(sql, function(err, result) {
        status = {success:false};
        if (req.session.loggedIn) { 
            if(err) {
                console.log("Error with db occurred");
                console.log(err);
            } else if (result.rows.length) {
                console.log("in the email if else"); 
                if (result.rows[0].couple_email1 && result.rows[0].single_email1) {
                    req.session.emails += result.rows[0].couple_email1;
                    req.session.emails += ', ' + result.rows[0].single_email1;
                    console.log("switch one: " + req.session.count); 
                } else if (result.rows[0].couple_email1) { //if couple def.
                    req.session.emails += ', ' + result.rows[0].couple_email1;
                } else if (result.rows[0].single_email1) { //if single def.
                    req.session.emails += ', ' + result.rows[0].single_email1;
                } 
                if (result.rows[0].couple_email2 && result.rows[0].single_email2) {
                    req.session.emails += ', ' + result.rows[0].couple_email2;
                    req.session.emails += ', ' + result.rows[0].single_email2;
                    console.log("switch 2");
                } else if (result.rows[0].couple_email2) { //if couple def.
                    req.session.emails += ', ' + result.rows[0].couple_email2;
                } else if (result.rows[0].single_email2) { //if single def.
                    req.session.emails += ', ' + result.rows[0].single_email2;
                } 
                if (result.rows[0].couple_email3 && result.rows[0].single_email3) {
                    req.session.emails += ', ' + result.rows[0].couple_email3;
                    req.session.emails += ', ' + result.rows[0].single_email3;
                } else if (result.rows[0].couple_email3) { //if couple def.
                    req.session.emails += ', ' + result.rows[0].couple_email3;
                } else if (result.rows[0].single_email3) { //if single def.
                    req.session.emails += ', ' + result.rows[0].single_email3;
                } 
                if (result.rows[0].couple_email4 && result.rows[0].single_email4) {
                    req.session.emails += ', ' + result.rows[0].couple_email4;
                    req.session.emails += ', ' + result.rows[0].single_email4;
                } else if (result.rows[0].couple_email4) { //if couple def.
                    req.session.emails += ', ' + result.rows[0].couple_email4;
                } else if (result.rows[0].single_email4) { //if single def.
                    req.session.emails += ', ' + result.rows[0].single_email4;
                } 
                if (result.rows[0].couple_email5 && result.rows[0].single_email5) {
                    req.session.emails += ', ' + result.rows[0].couple_email5;
                    req.session.emails += ', ' + result.rows[0].single_email5;
                } else if (result.rows[0].couple_email5) { //if couple def.
                    req.session.emails += ', ' + result.rows[0].couple_email5;
                } else if (result.rows[0].single_email5) { //if single def.
                    req.session.emails += ', ' + result.rows[0].single_email5;
                } 
                if (result.rows[0].couple_email6 && result.rows[0].single_email6) {
                    req.session.emails += ', ' + result.rows[0].couple_email6;
                    req.session.emails += ', ' + result.rows[0].single_email6;
                } else if (result.rows[0].couple_email6) { //if couple def.
                    req.session.emails += ', ' + result.rows[0].couple_email6;
                } else if (result.rows[0].single_email6) { //if single def.
                    req.session.emails += ', ' + result.rows[0].single_email6;
                } 
                if (result.rows[0].couple_email7 && result.rows[0].single_email7) {
                    req.session.emails += ', ' + result.rows[0].couple_email7;
                    req.session.emails += ', ' + result.rows[0].single_email7;
                } else if (result.rows[0].couple_email7) { //if couple def.
                    req.session.emails += ', ' + result.rows[0].couple_email7;
                } else if (result.rows[0].single_email7) { //if single def.
                    req.session.emails += ', ' + result.rows[0].single_email7;
                } 
                if (result.rows[0].couple_email8 && result.rows[0].single_email8) {
                    req.session.emails += ', ' + result.rows[0].couple_email8;
                    req.session.emails += ', ' + result.rows[0].single_email8;
                } else if (result.rows[0].couple_email8) { //if couple def.
                    req.session.emails += ', ' + result.rows[0].couple_email8;
                } else if (result.rows[0].single_email8) { //if single def.
                    req.session.emails += ', ' + result.rows[0].single_email8;
                } 
                if (result.rows[0].couple_email9) {
                    req.session.emails += ', ' + result.rows[0].couple_email9;
                } 
                if (result.rows[0].couple_email10) {
                    req.session.emails += ', ' + result.rows[0].couple_email10;
                } 
                if (result.rows[0].couple_email11) {
                    req.session.emails += ', ' + result.rows[0].couple_email11;
                } 
                if (result.rows[0].couple_email12) {
                    req.session.emails += ', ' + result.rows[0].couple_email12;
                } 
                if (result.rows[0].couple_email13) {
                    req.session.emails += ', ' + result.rows[0].couple_email13;
                }
                console.log("group session: " + req.session.emails);
                status = {"success" : true};
            } 
        }
        res.json(status);
        })    
});

app.post("/emailGroup", function(req, res) {
    var transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
        user: 'giftgiver83@yahoo.com',
        pass: 'qdaeleselsstyvsm'
    }
    });
      
    var to_who = '';  
    to_who = '\'' + req.session.emails + '\'';
    console.log(" to whoo: "  + to_who);
    var html = '';
    html = '\'' + req.session.mixed + '\'';

    var mailOptions = {
    from: 'giftgiver83@yahoo.com',
    to: to_who, //to_who, //need to put emails
    subject: 'Family Gift Exchange Assignments',
    html: html
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
        status = {"success" : true};
        res.json(status);
    }
    });
});
