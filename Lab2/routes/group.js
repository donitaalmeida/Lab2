

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook";

exports.getGroups = function(req, res) {


	var username=req.session.loggedInUserName;
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		console.log('userid'+username);
		var coll = mongo.collection('groups');
		coll.find({ group_members: username }).toArray( function(err, group){
			if (group) {
				console.log(group);
				res.render("groups", {
					"rows" : group,
					'user' : req.session
				});

			} else {
				console.log("no group");
			}
		});
	});
	

};

exports.getGroupMembers = function(req, res) {

	var username=req.session.loggedInUserName;
	var groupname=req.param("groupname");
	mongo.connect(mongoURL, function(){
		
		var coll = mongo.collection('groups');
		coll.findOne({ group_name: groupname },function(err, group){
			if (group) {
				//console.log(group);
				var members=group.group_members;
			//	console.log(members);
			
					var coll = mongo.collection('users');
					coll.find({ user_name:{$in :members }}).toArray( function(err, mem){
						if (mem) {
						//	console.log(mem);
							res.send({"members":mem});
							
						} else {
							console.log("no mem");
						}
					});
				

			} else {
				console.log("no group");
			}
		});
	});
	
	
};





exports.groupformed = function(req, res){

	var groupname=req.param("groupname");
	var description=req.param("description");
	var username=req.session.username ;
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('groups');
	coll.insert( {group_name:groupname, group_description:description,"group_members":[username]}, function(err, user){
		if (user) {
			console.log("successful insert");
			mongo.connect(mongoURL, function(){
				console.log('Connected to mongo at: ' + mongoURL);
				console.log('userid'+username);
				var coll = mongo.collection('groups');
				coll.find({ group_members: username }).toArray( function(err, group){
					if (group) {
						console.log(group);
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
			
			console.log(err);
			}
	});//end of insert
	});
};


