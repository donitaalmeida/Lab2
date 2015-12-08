exports.checkLoggedInUser = function(req, res) {

if(typeof req.session.loggedInUserFname==="undefined"){
	console.log(typeof req.session.loggedInUserFname);
	return false;
	
}
else{
	console.log(typeof req.session.loggedInUserFname);
	return true;
}

};