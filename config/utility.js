// route middleware to make sure
function isLoggedIn(req, res, next) {
    
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    
    // if they aren't redirect them to the home page
    res.redirect('/');
}

// route middleware to make sure
function isAuthenticated(req, res, next) {
    
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    
    // if they aren't redirect them to the home page
    res.redirect('/');
}

var loggedinUsers = [];

module.exports = {
    isAuthenticated: function (req, res, next) {
        
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();
        
        // if they aren't redirect them to the home page
        res.redirect('/');
    },
    bar: function () {
    // whatever
    },
    arrayObjectIndexOf: function arrayObjectIndexOf(myArray, searchTerm, property) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm) return i;
        }
        return -1;
    },
    findById: function findById(source, id) {
        if (source.length > 0) {
            for (var i = 0; i < source.length; i++) {
                if (source[i].user_id === id) {
                    return source[i];
                }
            }
            return null;
        }
        else
            return null;
    },
    
    findUserAlreadylogin: function (userid) {
        if (userid > 0) {
            if (loggedinUsers.length > 0) {
                for (var i = 0; i < loggedinUsers.length; i++) {
                    if (loggedinUsers[i].user_id === userid) {
                        return loggedinUsers[i];
                    }
                }
            }
        }

    },
    
    saveLoginUser: function (objuser) {
        loggedinUsers.push(objuser);
    },
    
    getOnlineUserList : function () {
        for (var i = 0, len = loggedinUsers.length; i < len; i++) {
            return loggedinUsers[i].name;
        }
    },
    
    getRandomColor: function () {
        //var letters = '0123456789ABCDEF'.split('');
        //var color = '#';
        //for (var i = 0; i < 6; i++) {
        //    color += letters[Math.floor(Math.random() * 16)];
        //}
        var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
        return hue;
    }

};

