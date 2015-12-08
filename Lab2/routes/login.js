/**
 * New node file
 */
// login function
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook";
//var MyConnectionPool= require("./MyConnectionPool.js");
exports.login = function(req, res) {

	var username, password;
	username = req.param("username");
	password = req.param("password");
	var user_rows;	
	var json_responses;
	console.log(username + " " + password);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		coll.findOne({user_name: username, user_pass:password}, function(err, user){
			if (user) {
				console.log("before"+req.session);
				// This way subsequent requests will know the user is logged in.
				req.session.username = user.user_name;
				req.session.loggedInUserId=user._id;
				req.session.loggedInUserFname=user.user_fname;
				req.session.loggedInUserLname=user.user_lname;
				req.session.loggedInUserName=user.user_name;
				req.session.loggedInEmail=user.user_email;
				req.session.loggedInDOB=user.user_dob;
				req.session.loggedInSex=user.user_sex;
				req.session.loggedInPhone=user.user_phone;
				req.session.loggedInUserPic=user.user_pic;
				req.session.loggedIninterests=user.user_interest;
				req.session.loggedInevents=user.Events;	
				req.session.loggedInUserFriends=user.Friends;
				//console.log(req.session.username +" is the session");
				console.log(req.session);
				
				//var arr=req.session.loggedInevents[2].event;
			//	console.log(arr);
				res.render("navhome",{'title':"Facebook","user":req.session});
			//	json_responses = {"statusCode" : 200};
			//	res.send(json_responses);

			} else {
				console.log("returned false");
				//json_responses = {"statusCode" : 401};
			//	res.send(json_responses);
				res.render("login",{"error":"Incorrect username or password"});
			}
		});
	});


};

// function to display signup page
exports.signup = function(req, res) {
	var error;
	res.render("signup", {
		error : error
	});
};

// function for signup
exports.aftersignup = function(req, res) {
	var first_name, last_name, email, password, password1, phone, sex, dob, username;
	password = req.param("password");
	password1 = req.param("password1");
	first_name = req.param("first_name");
	last_name = req.param("last_name");
	phone = req.param("phone");
	sex = req.param("sex");
	dob = req.param("dob").toString();
	email = req.param("email");
	username = req.param("user_name");
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		//------------------------------------------------------------------------
		coll.findOne({user_name: username}, function(err, user){
			//--------------------------
			if (user) {
				// This way subsequent requests will know the user is logged in.

				console.log("returned false check username"+user);
				//json_responses = {"statusCode" : 401};
			//	res.send(json_responses);
				res.render("signup", {error : "Username already exists"});
			

			} else {
				
				coll.insert( {"user_name": username,"user_pass": password,  "user_fname": first_name,"user_lname": last_name,"user_phone": phone,"user_sex": sex,"user_dob": dob, "user_email": email}, function(err, user){
					if (user) {
						// This way subsequent requests will know the user is logged in.
						
					console.log(req.session.username +" is the session");
						
						res.render("login",{"error":""});

					} else {
						console.log("returned false check insert");
				
						}
				});//end of insert
			}
			
		});//end of findone
	});	//end of mongo call
		

};
		
		
	



exports.checkLoggedInUser = function(req, res) {

if(typeof req.session.loggedInUserFname==="undefined"){
	return false;
	
}
else{
	return true;
}

};

exports.Logout = function(req, res) {

	req.session.destroy();
	console.log(req.session);
	res.render("login",{ title: 'Login','error':'' });

};