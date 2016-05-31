var express = require('express');
var connection = require('../config/connection.js');
var utility = require('../config/utility.js');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var util = require('util');

module.exports = function (app) {

    app.get('/chat', utility.isAuthenticated, function (req, res) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('chat', {
            title: 'Chat Application',
            message: 'Welcome Admin',
            userName: (req.user) ? req.user.username : undefined,
            userID: (req.user) ? req.user.id : undefined,
            userIconColor: (req.user) ? req.user.usericon_color : undefined,
            flashMessage: req.flash('flashMessage'),
            successMessage: req.flash('successMessage')
        });

        //var objuser = utility.findUserAlreadylogin(req.user.id.toString());
        //if (objuser != null || objuser != undefined) {
        //    req.flash('flashMessage', 'User Already Login!');
        //    res.render('alreadyLoginError', {
        //        title: 'Alert',
        //        message: 'Welcome Admin',
        //        userName: (req.user) ? req.user.username : undefined,
        //        userID: (req.user) ? req.user.id : undefined,
        //        flashMessage: req.flash('flashMessage'),
        //        successMessage: req.flash('successMessage')
        //    });
        //} else {
        //    res.render('chat', {
        //        title: 'List of allUsers',
        //        message: 'Welcome Admin',
        //        userName: (req.user) ? req.user.username : undefined,
        //        userID: (req.user) ? req.user.id : undefined,
        //        flashMessage: req.flash('flashMessage'),
        //        successMessage: req.flash('successMessage')
        //    });
        //}


    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/chatlogout', function (req, res) {
        req.logout();
        req.session.destroy();
        res.redirect('/');
    });

    app.post('/savechat', function (req, res) {
        var r = req.body;
        var f = req.file;
        console.log("Hello World");

        var newFileNameArray = [];
        var newFileName = "";

        //uploading(req, res, function (err) {
        //    //console.log(req.body);
        //    //console.log(req.files);
        //    if (err) {
        //        return res.end("Error uploading file.");
        //    }
        //    res.end("File is uploaded");
        //});

        //res.status(204).end();

        // creates a new incoming form.
        var form = new formidable.IncomingForm();

        form.uploadDir = path.join('./uploads');

        // parse a file upload
        form.parse(req, function (err, fields, files) {
            res.writeHead(200, { 'content-type': 'text/plain' });
            //res.write('Upload received :\n');
            //res.end(util.inspect({ fields: fields, files: files }));
            //io.of('/chatMsg').emit('chatMsg');
            //socket.emit('chatMsg');
            res.end(util.inspect({status:true, files: newFileNameArray}));
        });

        form.on('file', function (field, file) {
            var fileExtension = path.extname(file.name);
            console.log("extension is  " + fileExtension);
            //fs.renameSync(file.path, path.join(form.uploadDir, "123" + file.name));
            var date = new Date();
            newFileName = req.user.id + "C" + date.getDay() + date.getTime() + fileExtension;
            newFileNameArray.push(newFileName);
            fs.renameSync(file.path, path.join(form.uploadDir, newFileName));
        });

        //form.on('end', function (fields, files) {
        //    /* Temporary location of our uploaded file */
        //    var temp_path = this.openedFiles[0].path;
        //    /* The file name of the uploaded file */
        //    var file_name = this.openedFiles[0].name;
        //    /* Location where we want to copy the uploaded file */
        //    var new_location = './uploads/';
        //    fs.copy(temp_path, new_location + file_name, function (err) {
        //        if (err) {
        //            console.log(err);
        //        } else {
        //            console.log("success!");
        //            res.send({ status: true });
        //        }
        //    });
        //});
        // log any errors that occur
        form.on('error', function (err) {
            console.log('An error has occured: \n' + err);
        });

        // once all the files have been uploaded, send a response to the client
        form.on('end', function () {
            //res.send({ status: true });
            res.end('success');
        });
    });

    app.get('/notepad', function (req, res) {
        res.render('notepad', {
            title: 'CW Notepad',
            message: 'Notepad',
            userName: (req.user) ? req.user.username : undefined,
            flashMessage: req.flash('flashMessage')
        });
    });
}
