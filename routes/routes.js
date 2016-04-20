module.exports = function (app) {
    // All default routes
    require('./index')(app);
    
    // admin
    require('./admin')(app);
    
    //Chat
    require('./chat')(app);
    
    // All signup / signin routes
    require('./registerUser')(app);

  // Add future routes here
}
