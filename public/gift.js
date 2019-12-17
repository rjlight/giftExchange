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

function getGroupId() {
  $.post("/getGroupId", function(result) {
    console.log("in getGroupId");
    if (result.success) {
      console.log("got the group id: " + result.message);
		} else {
      console.log("some error occured");
    }
  });
}

function makeAccount() {
  var username_given = $("#username").val(); //get info from user
  var password_given = $("#password").val();
  
  console.log("username given: " + username_given);

	var paramus = {
		username: username_given,
		password: password_given
  };

  console.log(paramus);

  $.post("/createAccount", paramus, function(result) {
    console.log("in create account");
    if (result.success) {
      $("#logged").text(result.message);
      console.log("created account: " + result.message);
		} else {
      console.log("some error occured in createAccount");
    }
  });
}

function newUser() {
  console.log("After new user");

  window.setTimeout(getGroupId, 1);
  window.setTimeout(createGroup, 1500);
  window.setTimeout(makeAccount, 3000);
}

function createGroup() {
  $.post("/createGroup", function(result) {
    console.log("in create group");
    if (result.success) {
      console.log("created group: "+ result.message);
		} else {
      console.log("some error occured in createGroup");
    }
  });
}

function addCouple() {
  var name_given1 = $("#name1").val(); //get info from user
  var name_given2 = $("#name2").val(); 
	var email_given = $("#email1").val();

	var param = {
    name1 : name_given1,
    name2 : name_given2,
		email : email_given
  };

  $.post("/addCouples", param, function(result) {
    console.log(result.message);
    console.log(result.success);
    if (result.success) {
      console.log("persons added to the db");
      document.getElementById("coupleAdd").innerHTML = "Members added!";
		} else {
      $("#coupleAdd").text(result.message);
    }
  });
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
  $.post("/assignNames", function(result) {
    console.log("in assignNames");
    if (result.success) {
      console.log("result in log" + result.mixed);
      document.getElementById("group").innerHTML = result.mixed;
		} else {
      $("#group").text("Error: No user logged in");
    }
  });
}
function emailGroup() {
  window.setTimeout(getEmails, 1);
  window.setTimeout(sendEmails, 500);;
}  

function getEmails() {
  $.post("/getEmail", function(result) {
    console.log("in getEmails");
    if (result.success) {
      console.log("got emails");
		} else {
      $("#group").text("Error: No user logged in");
    }
  });
}

function sendEmails() {
  $.post("/emailGroup", function(result) {
    console.log("in send emails");
    if (result.success) {
      console.log("emails saved");
      document.getElementById("group").innerHTML = "Emails sent!";
		} else {
      $("#group").text("Error: No user logged in");
    }
  });
}