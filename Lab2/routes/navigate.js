/**
 * New node file
 */
var checkLoggedInUser = require("./checkLoggedInUser.js");

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook";
exports.home = function(req, res) {
	if(checkLoggedInUser.checkLoggedInUser(req,res)===true)
	{

		res.render("navhome",{'title':"Facebook","user":req.session});
	}
	else
	{

		res.render('login', { title: 'Login' ,'error':''});
	}
};

exports.newsfeeds = function(req, res) {
	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {
		var username = req.session.username;
		var temp=req.session.loggedInUserFriends;
		console.log("friend:"+req.session.loggedInUserFriends);
		var friend=[];
		var j=0;
		if(typeof temp!='undefined'){
			for (var i = 0; i < temp.length; i++) {
				if(temp[i].status===2){
					friend[j]=temp[i].user_name;
					j++;
				}

			}

			for (var int = 0; int < friend.length; int++) {
				console.log("friend:"+friend[int]);
			}

			mongo.connect(mongoURL, function(){
				var coll = mongo.collection('users');
				coll.find({ user_name:{$in :friend }},{user_fname:1,Events:1}).toArray( function(err, frnd){
					if (frnd) {

						console.log(frnd);
						res.render("newsfeeds", {
							"rows" : frnd,
							'user' : req.session
						});				
					} else {
						console.log("no mem");
					}
				});
			});	
		}


	} else {
		res.render('login');
	}
};

exports.groups = function(req, res) {
	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {

		var username = req.session.username;

		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			//console.log('userid'+username);
			var coll = mongo.collection('groups');
			coll.find({ group_members: username }).toArray( function(err, group){
				if (group) {
					//	console.log(group);
					res.render("groups", {
						"rows" : group,
						'user' : req.session
					});

				} else {
					console.log("no group");
				}
			});
		});


	} else {
		res.render('login');
	}
};

exports.friends = function(req, res) {
	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {
		console.log(req.session.loggedInUserFriends);
		res.render("friends", {

			'user' : req.session, 'friends':req.session.loggedInUserFriends
		});

	}
};

exports.searchfriend = function(req, res) {

	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {

		var searchrequest = req.param("searchrequest");
		console.log("searchreq"+searchrequest);
		var username=req.session.username;
		mongo.connect(mongoURL, function(){
			var coll = mongo.collection('users');
			coll.findOne({ $and:[{user_name:searchrequest},{user_name:{$ne:username}}]}, function(err, user){
				if (user) {
					console.log(user);
					res.send({'name':user});
				} else {
					console.log("not found");
				}
			});
		});

	} else {
		res.render('login');
	}
};

exports.inputfriend = function(req, res) {

	console.log("inside input friend");

	var username = req.session.username;
	var friendname=req.param("friendname");
	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {
		mongo.connect(mongoURL, function() {

			var coll = mongo.collection('users');

			coll.update({
				"user_name" : username
			}, {
				$push : {
					"Friends" : {
						"user_name" : friendname,
						"status" : 1
					}
				}
			}, function(err, user) {
				if (user) {

					coll.update({user_name : friendname},{$push:{"Friends":{"user_name":username,"status":0}}}
					, function(err, user) {
						if (user) {

							res.send({"message":"Friend Request Sent"});


						} else {
							console.log("returned false");

						}
					});
					// end of find one
				}

				else {
					console.log("returned false");

				}
			});

			// end of update

		});

	} else {
		res.render('login');
	}
};



exports.acceptfriend = function(req, res) {
	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {
		var username = req.session.username;
		var friendname = req.param("friendname");
		console.log("Username: "+username+" Friend: "+friendname);
		mongo.connect(mongoURL, function() {

			var coll = mongo.collection('users');

			coll.update({
				"user_name" : username, "Friends.user_name":friendname,"Friends.status":0
			}, {
				$set : {
					"Friends.$.status" : 2

				}
			}, function(err, user) {
				if (user) {

					coll.update({"user_name" : friendname,"Friends.user_name":username, "Friends.status":0},{$set:{"Friends.$.status":2}}
					, function(err, user) {
						if (user) {

							res.send({"message":"Friend Request Accepted"});


						} else {
							console.log("returned false2");

						}
					});
					// end of find one
				}

				else {
					console.log("returned false1");

				}
			});

			// end of update

		});


	} else {
		res.render('login');
	}
};

exports.rejectfriend = function(req, res) {

	if (checkLoggedInUser.checkLoggedInUser(req, res) === true) {
		var username = req.session.username;
		var friendname = req.param("friendname");
		console.log("Username: "+username+" Friend: "+friendname);
		mongo.connect(mongoURL, function() {

			var coll = mongo.collection('users');

			coll.update({
				"user_name" : username, "Friends.user_name":friendname,"Friends.status":0
			}, {
				$set : {
					"Friends.$.status" : 3

				}
			}, function(err, user) {
				if (user) {

					coll.update({"user_name" : friendname,"Friends.user_name":username, "Friends.status":1},{$set:{"Friends.$.status":3}}
					, function(err, user) {
						if (user) {

							res.send({"message":"Friend Request Deleted"});


						} else {
							console.log("returned false2");

						}
					});
					// end of find one
				}

				else {
					console.log("returned false1");

				}
			});

			// end of update

		});


	} else {
		res.render('login');
	}
};