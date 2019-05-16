module.exports = {
	ensureAuthenticated: function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		req.flash('error_msg', 'Нямате достъп до тази страница. Влезте си в профила или се регистрирайте първо.');
		res.redirect('/users/login')
	}
}