function logIn() {
  console.log("After log in button");
  var username_given = $("#username").val(); //get info from user
	var password_given = $("#password").val();

	var params = {
		username: username_given,
		password: password_given
  };

  console.log("Before login funcion");
  $.post("/login", params, function(result) {
		if (result) {
      console.log("in result");
      if (username_given == result.username && password_given == result.password) {
        $("#logged").text("Currently logged in");
      } else {
        $("#logged").text("Error: Invalid username or password.");
      }
		} else {
			$("#logged").text("Error: Please enter username and password");
		}
	});
}

function showMembers() {
  $.post("/showMembers", function(result) {
    console.log("in show members");
    if (result.success) {
      console.log("result in log" + result.group);
      document.getElementById("group").innerHTML = result.group;
		} else {
      $("#group").text("Error: No user logged in");
    }
  });
}
function newUser() {
    //query database to create a new group
    //add text that says new user created, please log in
}
function addCouple() {
    //query db to add couple
    //add text to say couple added!
}

function addSingle() {
  var name_given = $("#nameSingle").val(); //get info from user
	var email_given = $("#emailSingle").val();

	var param = {
		name : name_given,
		email : email_given
  };

  $.post("/addSingles", param, function(result) {
    console.log(result.message);
    console.log(result.success);
    if (result.success) {
      console.log("person added to the db");
      document.getElementById("singleAdd").innerHTML = "Member added!";
		} else {
      $("#singleAdd").text(result.message);
    }
  });
}

function assignNames() {
    //var request = new XMLHttpRequest()

    // Open a new connection, using the POST request on the URL endpoint
   // request.open('POST', 'postgres://giftadmin:gifty@localhost:5432/familygiftexchange', true) //for the database when up and running
    
   // request.onload = function() {
        // Begin accessing JSON data here
     //   var data = JSON.parse(this.response)
    
        //will be accessing names from the db
    /*    if (request.status >= 200 && request.status < 400) {
        for (i in data) { //put the names in a list
                    var txt = "<li>" + data[i] + "</li><br>" ;
            } 
        } else */if (1 == 1) {
        var txt = "<li>" + "AJAX request worked again! - Assigned names!" + "</li><br>";
        txt = "<li>" + "Me - You" + "</li><br>"
        } else  {
        console.log('error')
        }
            document.getElementById("group").innerHTML = txt;
            //get rid of all "added person" text
   // }
        // Send request
      //  request.send()
}
function emailGroup() {
    //do something to send this email list to the whole group 
    //will need to query for the emails of each member
    //will need to query to recreate the list and then email
}  