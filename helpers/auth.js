// exports to other modules
module.exports = {
    // if you add the ensureAuthenticated property to any link, it will not allow access unless the user is logged in
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Not Authorized');
        // if not authorized it will redirect the user back to the login page
        res.redirect('/users/login');
    }
}