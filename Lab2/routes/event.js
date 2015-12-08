/**
 * New node file
 */

var checkLoggedInUser = require("./checkLoggedInUser.js");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook";
exports.addevent = function(req, res) {
	var username = req.session.loggedInUserName;
	var eventname = req.param("event_description");
	var date = req.param("event_date");
	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');

		coll.update({
			"user_name" : username
		}, {
			$push : {
				"Events" : {
					"event_description" : eventname,
					"event_date" : date
				}
			}
		}, function(err, user) {
			if (user) {
				// This way subsequent requests will know the user is logged in.

				// console.log(req.session.username +" is the session");
				coll.findOne({
					user_name : username
				}, function(err, user) {
					if (user) {

						req.session.loggedInevents = user.Events;

						console.log(req.session.username + " is the session");
						// var arr=req.session.loggedInevents[2].event;
						// console.log(arr);
						res.render("navhome", {
							'title' : "Facebook",
							"user" : req.session
						});
						// json_responses = {"statusCode" : 200};
						// res.send(json_responses);

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
};


