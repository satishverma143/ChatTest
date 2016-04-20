var bcrypt = require('bcryptjs');
var express = require('express');
var connection = require('../config/connection.js');
var utility = require('../config/utility.js');
var adminFunctions = require('../functions/adminFunctions.js');

module.exports = function (app) {
    
    app.get('/admin', utility.isAuthenticated, function (req, res) {
        if (req.user.roleid == 2) {
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            adminFunctions.GetAllUsers(function (allUsers) {
                res.render('admin/adminDashboard', {
                    title: 'List of allUsers',
                    users: allUsers,
                    message: 'Welcome Admin',
                    userName: (req.user) ? req.user.username : undefined,
                    flashMessage: req.flash('flashMessage'),
                    successMessage: req.flash('successMessage')
                });
            });
        }
        else
            res.redirect('/chat');
    });
    
    // Display Admin Home Page
    app.get('/admin1', utility.isAuthenticated, function (req, res) {
        res.render('admin/adminDashboard', {
            title: 'Chat Application1212',
            message: 'Yourssd header message',
            userName: (req.user) ? req.user.username : undefined,
            flashMessage: req.flash('flashMessage')
        });
    });
    
    // Display Add User Form
    app.get('/adduser', function (req, res) {
        res.render('admin/addUser', {
            title: 'Add New User',
            message: 'Add new user',
            userName: (req.user) ? req.user.username : undefined,
            flashMessage: req.flash('flashMessage')
        });
    });
    
    // Save User Form Data / Add user in to db
    app.post('/adduser', function (req, res) {
        var salt = '$2a$10$wENMOiXaNvkXN9BmCbh4ZO';
        //var salt = bcrypt.genSaltSync(10);
        // Hash the password with the salt
        var hash = bcrypt.hashSync(req.body.password, salt);
        var formdata = req.body;
        var postData = {
            username: formdata.name,
            email: formdata.email,
            passwordread: formdata.password,
            roleid: formdata.ddlrole,
            is_active: formdata.optstatus,
            password: hash,
            created_at: new Date(),
            updated_at: new Date(),
            usericon_color: utility.getRandomColor()
        };
        adminFunctions.InsertUser(req, postData, function (result) {
            if (result != null) {
                //return res.redirect('/admin');
                //res.redirect('/admin');
                res.send({ redirect: '/admin', status: true, flashMessage: 'User Added Successfully!!' });
            }
            else {
                res.send({ redirect: '', status: false, flashMessage: 'Sorry! That email is already taken.!!' });
                //req.flash('error', 'Could not update your name, please contact our support team');
                //res.redirect(req.flash('flashMessage', 'Sorry! That email is already takenqqq.'), 'adduser');
            }
                
        });
    });
    
    // Edit User
    app.get('/Edit/:id', function (req, res) {
        adminFunctions.GetUser(req.params.id, function (results) {
            if (results.length == 0) {
                //res.status(404).send('Customer does not exist <br> <a href=/Customers>Go back</a>');
                res.status(404).render('404_error', { title: "Sorry, page not found", userName: (req.user) ? req.user.username : undefined, });
            }
            else {
                res.render('admin/editUser', {
                    title: 'View User',
                    user: results,
                    message: 'Welcome Admin',
                    userName: (req.user) ? req.user.username : undefined,
                    flashMessage: req.flash('flashMessage'),
                    successMessage: req.flash('successMessage')
                });
            }
        });
    });
    
    // --- POST
    app.post('/Edit/:id', function (req, res) {
        //var User = req.body;
        var User = {
            name: req.body.name,
            user_id: req.body.user_id,
            ddlrole: req.body.ddlrole,
            optstatus: req.body.optstatus,
            usericon_color: utility.getRandomColor()
        };
        adminFunctions.UpdateUser(User, function () {
            req.flash('successMessage', 'Update successfully!!.');
            res.redirect('/admin/');
        });
    });
}