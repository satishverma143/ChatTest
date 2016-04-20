var express = require('express');
var moment = require('moment');
var connection = require('../config/connection.js');
var utility = require('../config/utility.js');
var userFunctions = require('../functions/userFunctions.js');

var users = [];
var messages = [];
var usersActivity = [];
var onlineClient = {};

module.exports = function (io) {
    
    io.sockets.on('connection', function (socket) {
        console.log('connection made');
        
        /* * Vlidate user id duplicate */
        socket.on('chkUser', function (data) {
            //var chk = users.indexOf(data.name);
            userFunctions.GetOnlineUser(data.user_Id, function (results) {
                if (results.length == 0) {
                    console.log('user not exist');
                    
                    var chk = -1;
                    var userDetails = { name: data.name, user_id: data.user_Id, loginDateTime: new Date(), loginStatus: '1' };//, usericon_color: data.userIconColor };
                    userFunctions.SaveOnlineUser(userDetails, function (result) {
                        if (result != null) {
                            console.log('user added in online table');
                            var curdatetime = currentDateTime('India', '5.5');
                            var data1 = { name: data.name, msg: ' joined chat on ' + curdatetime + ' !', color: 'text-success' };
                            usersActivity.push(data1);
                            onlineClient[data.user_Id] = socket;
                            socket.emit("chkUser", chk);
                        }
                        else {
                            console.log('user not added in online table');
                        }
                    });
                }
                else {
                    var chk = results[0].user_id;
                    onlineClient[data.user_Id] = socket;
                    socket.emit("chkUser", chk);
                }
            });
        });
        
        socket.on('joined', function (data) {
            var a = moment(new Date());
            var b = moment(new Date());
            a.from(b);
            console.log(a.from(b));
            var curdatetime = moment(new Date()).format('LLL');;
            socket.username = data.name;
            socket.user_Id = data.user_Id;
            userFunctions.GetAllTotalOnlineUsers(function (results) {
                if (results.length == 0) { console.log('no one is online'); }
                else {
                    var r = results;
                    io.sockets.emit('totalOnlineUser', results, socket.username);
                    socket.emit("myInfo", socket.username, curdatetime);
                    io.sockets.emit('usersActivity', usersActivity, curdatetime);
                    userFunctions.GetAllGroupChatMessage(null, function (resultmessages) {
                        if (resultmessages.length == 0) { console.log('no data in group chat messages'); }
                        else {
                            io.sockets.emit('newOne', data, resultmessages);
                        }
                    });
                }
            });
            
        });
        
        socket.on("chatMsg", function (data) {
            //`sender_id`, `sender_name`, `receiver_id`, `receiver_name`, `message_text`, `message_type`, `created_at`, `read_status`SELECT * FROM `chat_messages` WHERE 1
            var curdatetime = new Date();            
            var chatData = {
                sender_id: socket.user_Id,
                sender_name: socket.username,
                message_text: data.msg,
                message_type: "msgPublic",                
                created_at: curdatetime
            }
            
            userFunctions.InsertGroupChatMessage(chatData, function (results) {
                if (results.length == 0) {
                    console.log('msgPublic can not insert in message table');
                }
                else {
                    console.log('msgPublic inserted successfully in message table');
                    io.sockets.emit("msgEveryOne", chatData, data.userIconColor, curdatetime);
                }
            });
        });
        
        socket.on("loadMoreChatData", function (data) {
            userFunctions.GetAllGroupChatMessage(data.firstid, function (resultmessages) {
                if (resultmessages.length == 0) {
                    console.log('no data in group chat messages');
                    io.sockets.emit('loadMoreMsg', data, resultmessages);
                }
                else {
                    io.sockets.emit('loadMoreMsg', data, resultmessages);
                }
            });
        });
        
        socket.on('disconnect', function (data) {
            var curdatetime = currentDateTime('India', '5.5');
      //      if (socket.username != undefined) {
      //          userFunctions.GetOnlineUser(socket.user_Id, function (results) {
      //              if (results.length == 0) {
      //                  console.log('user not exist');
      //              }
      //              else {
      //                  var user_id = results[0].user_id;
      //                  var id = results[0].id;
      //                  userFunctions.UpdateOnlineUser(id, function (result) {
      //                      if (result.length == 0) {
      //                          console.log('can not update user in table');
      //                      }
      //                      else {
      //                          console.log('user upadated');
                                
      //                          userFunctions.GetAllTotalOnlineUsers(function (results) {
      //                              if (results.length == 0) { console.log('no one is online'); }
      //                              else {
      //                                  var r = results;
      //                                  io.sockets.emit('totalOnlineUser', results, socket.username);
      //                                  data = { name: socket.username, msg: " left chat on " + curdatetime + " !" , color: "text-danger" }
      //                                  usersActivity.push(data);
                                        
      //                                  io.sockets.emit('usersActivity', usersActivity, curdatetime);
      //                                  socket.emit('usersDisconnect');
      //                              }
      //                          });
      //                      }
      //                  });
      //              }
      //          });
      ////socket.emit("disconnect",{});
      //      }
        });
        
        socket.on('userLogout', function (data) {
            if (socket.username != undefined) {
                userFunctions.GetOnlineUser(socket.user_Id, function (results) {
                    if (results.length == 0) {
                        console.log('user not exist');
                    }
                    else {
                        var user_id = results[0].user_id;
                        var id = results[0].id;
                        userFunctions.UpdateOnlineUser(id, function (result) {
                            if (result == 0) {
                                console.log('can not update user in table');
                            }
                            else {
                                console.log('user upadated');
                                
                                userFunctions.GetAllTotalOnlineUsers(function (getresult) {
                                    if (getresult.length == 0) { console.log('no one is online'); }
                                    else {
                                        var r = getresult;
                                        io.sockets.emit('totalOnlineUser', getresult, socket.username);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
        
        
        socket.on("typing", function (data) {
            io.sockets.emit("isTyping", { isTyping: data, user: socket.user_Id });
        });
        
        socket.on('dateTimeUpdate', function (data) {
            socket.datetime = data.datatime;
        });
        ////// Create room /////
        socket.on('sendPrivateChat', function (data) {
            var socketTo = onlineClient[data.toName];
            var socketFrom = onlineClient[data.fromName];
            var group = 'private';
            socketTo.join(group);  //create room
            socketFrom.join(group);
            //io.sockets.in(data.name).emit('privateChat', data);    
            socketTo.emit('privateChat', data);
            socketFrom.emit('privateChat', data);
        });
        
        
        
        socket.on('sendprivatechat', function (senderId, senderName, receiverId, receiverName, msg) {
            var clientSocket = onlineClient[receiverId];
            var curdatetime = new Date();
            var chatData = {
                sender_id: senderId,
                sender_name: senderName,
                receiver_id: receiverId,
                receiver_name: receiverName,
                message_text: msg,
                message_type: "msgPrivate",                
                created_at: curdatetime
            };
            
            if (typeof clientSocket == 'undefined' && !clientSocket) {
                io.sockets.emit("UserNotOnline", { rId: receiverId, rName: receiverName });
            } else {
                //clientSocket.emit('getprivatemsg', socket.username, key, msg);                 
                userFunctions.InsertGroupChatMessage(chatData, function (results) {
                    if (results.length == 0) {
                        console.log('msgPrivate can not insert in message table');
                    }
                    else {
                        console.log('msgPrivate inserted successfully in message table');
                        clientSocket.emit('getprivatemsg', senderId, senderName, receiverId, receiverName, msg);
                    }
                });
            }
        });
        
        socket.on('getPrivateChatMessages', function (data) {
            var chatIds = { sId: data.sId, rId: data.rId };
            userFunctions.GetUserPrivateChatMessage(chatIds, null, function (results) {
                if (results.length == 0) {
                    console.log('no data in msgPrivate');
                }
                else {
                    console.log('fetch data successfully from msgPrivate');
                    io.sockets.emit("ShowUserPrivateChatMsg", { sId: data.sId, rId: data.rId }, results);
                    //clientSocket.emit('getprivatemsg', senderId, senderName, receiverId, receiverName, msg);
                }
            });
        });

    });
}

function alreadyLogin(req, res) {
    res.send({ redirect: '', status: false, flashMessage: 'Sorry! That email is already taken.!!' });
    res.redirect('/');
}

//current date and time of any country!
function currentDateTime(city, offset) {
    // create Date object for current location
    d = new Date();
    
    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    
    // create new Date object for different city
    // using supplied offset
    currentdate = new Date(utc + (3600000 * offset));
    
    // return time as a string
    
    var datetime = currentdate.getDate() + "/" 
                    + (currentdate.getMonth() + 1) + "/" 
                    + currentdate.getFullYear() + " @ " 
                    + currentdate.getHours() + ":" 
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
    return datetime;
                                  
}