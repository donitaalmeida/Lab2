
/*
 * GET home page.
 */
var checkLoggedInUser= require("./checkLoggedInUser.js");


exports.index = function(req, res){
	
	
	
	if(checkLoggedInUser.checkLoggedInUser(req,res)===true)
	{
		
		res.render("navhome",{'title':"Facebook","user":req.session});
	}
	else
		{
	
		res.render('login', { title: 'Login' ,'error':''});
		}
};