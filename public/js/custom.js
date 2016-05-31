$(document).ready(function () {
    $("#contextFirst").fadeIn(2000);
    var elem = document.getElementById('barch');
    var socket = io.connect();
    var count = 0;
    var totalOnlineUser = false;
    var userActivity = false;
    var userIconBackgroundColor = getRandomColor();
    var nm = $("#username").val();

    var user_Id = $("#hiddenuserID").val();
    var user_Name = $("#hiddenusername").val();
    var userIconColor = $("#hiddenusericon").val();

    var uservisiblenow="";
    vis(function(){
      uservisiblenow=vis();
      // if(uservisiblenow){
      // document.title = 'Visible';
      // }
      // else{
      // document.title = 'Not Visible';
      // }
    });

    var mySound = new Audio('../sounds/button-09.mp3');
    mySound.load();

    //Check User
    socket.emit('chkUser', { name: user_Name, user_Id: user_Id, userIconColor: userIconColor });
    socket.on('chkUser', function (chk) {
        if (chk > (-1)) {
            //$("#myModalLoading").modal('hide');
            //$("#alertMsg").html("<h3> user already loggedIn !</h3>");
            //$("#myModal").modal('show');
            socket.emit('joined', { name: user_Name, user_Id: user_Id });
            $("#username").val(user_Name);
        } else {
            socket.emit('joined', { name: user_Name, user_Id: user_Id });
            $("#username").val(user_Name);

        }
    });

    //window.location.hostname
    $('#chatForm').submit(function (e) {
        e.preventDefault();
        $("#msgSending").html("<img src='images/msgloader.GIF' style='float:left'>Message sending please wait...");
        elem.scrollTop = elem.scrollHeight;

        var msg = $('#chatInput').val();
        socket.emit('chatMsg', { msg: msg, userIconColor: userIconColor });
        $('#chatInput').val('');
        return false;
    });

    socket.on("msgEveryOne", function (data, iconColor, messages) {
        //`sender_id`, `sender_name`, `receiver_id`, `receiver_name`, `message_text`, `message_type`, `created_at`,
        $('#messages').append("<div class='direct-chat-msg'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left captialname'>" + data.sender_name + "</span><span class='direct-chat-timestamp pull-right' data-livestamp=" + data.created_at + "></span></div><i class='chat-icon direct-chat-img' style='background-color:" + iconColor + "'>" + shortName(data.sender_name) + "</i><div class='direct-chat-text'>" + wdtEmojiBundle.render(data.message_text) + "</div></div>");
        $("#msgSending").html(" ");
        $(elem).animate({ scrollTop: $(elem).prop("scrollHeight") }, 1000);
        $("#messages").linkify({ target: "_blank" });
        vis(function(){
          if(!vis())
            notifyMe(data.sender_name);
        });
        mySound.play();
    });

    socket.on('newOne', function (data, messages) {
        if (data.user_Id == user_Id) {
            $('#messages').empty();
            if (messages.length < 10) {

            }
            else {
                if ($("#btnloadmore").length == 0) {
                    $(elem).prepend('<a href="javascript:void(0);" id="btnloadmore" data-firstid="' + messages[0].id + '" class="btn btn-info btn-block">LOAD MORE</a>');
                }
                $.each(messages, function (index, vl) {
                    $('#messages').append("<div class='direct-chat-msg'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left captialname'>" + vl.name + "</span><span class='direct-chat-timestamp pull-right' data-livestamp=" + vl.created_at + "></span></div><i class='chat-icon direct-chat-img' style='background-color:" + vl.usericon_color + "'>" + shortName(vl.name) + "</i><div class='direct-chat-text'>" + wdtEmojiBundle.render(vl.message_text) + "</div></div>");
                });
            }
            $(elem).animate({ scrollTop: $(elem).prop("scrollHeight") }, 1000);
            $("#messages").linkify({ target: "_blank" });
        //elem.scrollTop = elem.scrollHeight;
        }
    });

    socket.on("loadMoreMsg", function (data, messages) {
        if (data.user_Id == user_Id) {
            if (messages.length == 0) {

            }
            else {
                var childNode = elem.childNodes[0];
                $(childNode).attr('data-firstid', messages[0].id);
                var newItem = "";
                $.each(messages, function (index, vl) {
                    newItem += "<div class='direct-chat-msg'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left captialname'>" + vl.name + "</span><span class='direct-chat-timestamp pull-right' data-livestamp=" + vl.created_at + "></span></div><i class='chat-icon direct-chat-img' style='background-color:" + vl.usericon_color + "'>" + shortName(vl.name) + "</i><div class='direct-chat-text'>" + wdtEmojiBundle.render(vl.message_text) + "</div></div>";
                });

                $('#messages').prepend(newItem);
                $("#messages").linkify({ target: "_blank" });
            }

            $('div.overlay').remove();
        }
    });


    socket.on('myInfo', function (me, datetime) {
        $('#myInfo').html(me);
        $('#myName').css('background-color', userIconColor).html(shortName(me));
        $('#lgtime').html(datetime);
        progressBar('true');
    });

    socket.on('totalOnlineUser', function (data, me) {
        $('#totalUser').html('<i class="fa fa-user"></i> ' + (data.length - 1));
        $('#onlineUser').empty();
        $('#userList').empty();
        $('#privateChatBox').empty();
        var onlineu = [];

        var itemString = $.map(data, function (item, key) {
            onlineu.push(item.name);
        });

        $.each(data, function (index, val) {
            if (val.user_id != user_Id)
                $('#userList').append('<li class="online" id="li_' + val.user_id + '"><a href="javascript:void(0)" class="pchat captialname" id="' + val.user_id + '" data-username="' + val.name + '"><i class="menu-icon" style="background-color:' + val.usericon_color + '">' + shortName(val.name) + '</i><div class="status available pull-right"></div><div class="menu-info"><h4 class="control-sidebar-subheading">' + val.name + '</h4><p id="typing_' + val.user_id + '" class="text-danger">Online</p></div></a></li>');
        });
        //$.each(onlineu, function (index, val) {
        //    $('#userList').append('<li class="list-group-item " id="li_' + val + '"><span class="glyphicon glyphicon-star-empty" ></span> <a href="javascript:void(0);" class="pchat" id="' + val + '">' + val + '</a><span><span id="typing_' + val + '" class="text-danger"  ></span></li>');
        //});

    });

    function shortName(uname) {
        var name = uname;
        var initials = "";
        var wordArray = name.split(" ");
        for (var i = 0; i < wordArray.length; i++) {
            initials += wordArray[i].substring(0, 1);
        }
        return initials.toUpperCase();
    }

    function getRandomColor() {
        //var letters = '0123456789ABCDEF'.split('');
        //var color = '#';
        //for (var i = 0; i < 6; i++) {
        //    color += letters[Math.floor(Math.random() * 16)];
        //}
        var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
        return hue;
    }

    $(document).on('click', '#btnloadmore', function () {
        //var firstid = $(this).data("firstid");
        var childNode = elem.childNodes[0];
        var firstid = $(childNode).attr('data-firstid');

        $('#boxc').append("<div class='overlay'> <i class='fa fa-refresh fa-spin'></i> </div>");
        socket.emit('loadMoreChatData', { firstid: firstid, user_Id: user_Id });
    });

    // User is Typing...
    var typing = false;
    var timeout = undefined;

    function timeoutTyping() {
        typing = false;
        socket.emit('typing', false);
    }


    $("#chatInput").keypress(function (e) {
        if (e.which !== 13) {
            if (typing === false && $(this).is(":focus")) {
                typing = true;
                socket.emit('typing', true);
            } else {
                clearTimeout(timeout);
                timeout = setTimeout(timeoutTyping, 3000);
            }
        }
    });

    socket.on("isTyping", function (data) {
        if (data.isTyping) {
            $("#typing_" + data.user).html(" is typing..");
            timeout = setTimeout(timeoutTyping, 3000);
        } else {
            $("#typing_" + data.user).html("Online");
        }
    });
    // End user is typing...

    socket.on('usersActivity', function (data) {
        $('#userActivity').empty();
        $.each(data, function (index, value) {
            $('#userActivity').prepend('<li class=" list-group-item ' + value.color + '">' + value.name + value.msg + ' </li>');
        });
    });

    socket.on('userDisconnect', function () {
        alert("You are disconnected due to some server issue, reloading..");
        window.location.replace(window.location.pathname);
    });

    $('#btnUserLogout').click(function (e) {
        e.preventDefault();
        socket.emit('userLogout', true);
        window.location = 'chatlogout';
        //alert('logout');
    });


    ////////// Private chat ///



    var count = 0;
    socket.on('getprivatemsg', function (senderId, senderName, receiverId, receiverName, message) {

        var elem = document.getElementById('chat_div_' + senderId);
        if (typeof (elem) != 'undefined' && elem != null) {

        } else {
            createChatBox(senderId, senderName);
        }

        if ((senderId == receiverId) && (count == 0)) {
            alert("You are chatting with yourself, Server will repeat what ever you'll send! By this you can test yourself if no user online except you!");
            count++;
        }

        $("#chat_div_" + senderId).chatbox("option", "boxManager").addMsg(senderName, message);
        $("#chat_div_" + senderId + ' .message').linkify({
            target: "_blank"
        });
        vis(function(){
          if(!vis())
            notifyMe(senderName);
        });
        mySound.play();
    });

    socket.on('UserNotOnline', function (data) {
        $("#chat_div_" + data.rId).append("<div class='not-available'>" + data.rName + " isn't on Chat right now. So message'll not send right now.</div>");
    });

    socket.on('ShowUserPrivateChatMsg', function (data, messages) {
        //#usermessages
        var chatBoxId = document.getElementById('chat_div_' + data.rId);
        if (messages.length != 0) {
            if (messages.length < 10) {

            }
            else {
                if ($("#btnLoadPrivateChat").length == 0) {
                    $("#chat_div_" + data.rId).prepend('<a href="javascript:void(0);" id="btnLoadPrivateChat" data-firstid="' + messages[0].id + '" class="btn btn-info btn-block">LOAD MORE</a>');
                }
            }

            $.each(messages, function (index, vl) {
                if (vl.sender_id == user_Id) {
                    $('#' + chatBoxId.id + ' #usermessages').append("<div class='ui-chatbox-msg'><div class='message-data align-right'><span class='message-data-time' data-livestamp=" + vl.created_at + "></span>&nbsp;&nbsp;<span class='message-data-name'>Me </span><i class='fa fa-circle me'></i></div><div class='message other-message pull-right'>" + vl.message_text + "</div></div>");
                }
                else {
                    $('#' + chatBoxId.id + ' #usermessages').append("<div class='ui-chatbox-msg'><div class='message-data'><span class='message-data-name'><i class='fa fa-circle other'></i>" + vl.name + "</span><span class='message-data-time' data-livestamp=" + vl.created_at + "></span></div><div class='message my-message'>" + vl.message_text + "</div></div>");
                }
            });
        }
        $('#' + chatBoxId.id).niceScroll();
        $(chatBoxId).animate({ scrollTop: $(elem).prop("scrollHeight") }, 1000);
        $('#' + chatBoxId.id + ' #usermessages').linkify({
            target: "_blank"
        });

    });





    $(document).on('click', '.pchat', function () {
        var id = $(this).attr('id');
        var username = $(this).data('username');
        var elem = document.getElementById('chat_div_' + id);
        if (typeof (elem) != 'undefined' && elem != null) {

            $("#chat_div_" + id).chatbox("option", "boxManager").toggleBox();
        } else {
            createChatBox(id, username);
        }
    });


    var offset = 0;
    function createChatBox(receiver_userid, receiver_name) {
        //var box[] = userid;
        var privateDiv = document.getElementById('PrivateTab');
        var privateBox = document.createElement('div');
        var privateLog = document.createElement('div');
        var senderData = { name: user_Name, user_Id: user_Id };
        $(privateBox).attr({
            'id': "chat_div_" + receiver_userid,
        });
        $(privateLog).attr({
            'id': "log_" + receiver_userid,
            'style': "display:none;"
        });
        var MessageUserBox = document.createElement('div');

        privateDiv.appendChild(privateBox);
        privateDiv.appendChild(privateLog);
        $(MessageUserBox).attr({
            'id': "usermessages",
        });
        $("#chat_div_" + receiver_userid).append(MessageUserBox);
        $("#chat_div_" + receiver_userid).chatbox({
            id: "Me",
            user: { key : "value" },
            title : receiver_name,
            offset: offset,
            messageSent : function (id, user, msg) {
                //$("#log_"+userid).append(id + " said: " + msg + "<br/>");
                $("#chat_div_" + receiver_userid).chatbox("option", "boxManager").addMsg(id, msg);
                $("#chat_div_" + receiver_userid + ' .message').linkify({
                    target: "_blank"
                });

                socket.emit('sendprivatechat', senderData.user_Id, senderData.name, receiver_userid, receiver_name, msg);

            }
        });

        socket.emit('getPrivateChatMessages', { sId: senderData.user_Id, sName: senderData.name, rId: receiver_userid, rName: receiver_name });

        offset = offset + 310;                                              // getter
    }







    function private_send(key) {
        var messagetosend = $('#to_' + key + "_data").val();
        $('#to_' + key + "_text").append("<div><b>Me: </b>" + messagetosend + "</div>");
        socket.emit('sendprivatechat', key, messagetosend);
    }


    ///// End Private Chat /////


    //var i = 0;
    //setInterval(function(){ i++; console.log("Hello"+i+datetime)},1000);
    setInterval(function () {
        socket.emit('dateTimeUpdate', { datatime: window.datetime });
    }, 1000);


    wdtEmojiBundle.defaults.emojiSheets = {
        'apple': 'https://cdn.rawgit.com/needim/wdt-emoji-bundle/master/sheets/sheet_apple_64.png',
        'google': 'https://cdn.rawgit.com/needim/wdt-emoji-bundle/master/sheets/sheet_google_64.png',
        'twitter': 'https://cdn.rawgit.com/needim/wdt-emoji-bundle/master/sheets/sheet_twitter_64.png',
        'emojione': 'https://cdn.rawgit.com/needim/wdt-emoji-bundle/master/sheets/sheet_emojione_64.png'
    };

    wdtEmojiBundle.defaults.type = wdtEmojiBundle.defaults.emojiSheets.apple;
    wdtEmojiBundle.defaults.pickerColors = [
        'green', 'pink', 'yellow', 'blue', 'gray'
    ];

    wdtEmojiBundle.init('.wdt-emoji-bundle-enabled');


    function notifyMe(msgFrom) {
      // If it's okay let's create a notification
      var options = {
          body: msgFrom + ' ' +' send a message.',
          icon: "../images/chat1.png",
          dir : "ltr"
      };

      // Let's check if the browser supports notifications
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      }

      // Let's check if the user is okay to get some notification
      else if (Notification.permission === "granted") {
        var notification = new Notification("Hi hero, New notification",options);
        // Remove the notification from Notification Center when clicked.
        notification.onclick = function () {
          window.open(window.location.origin);
        };

        // Callback function when the notification is closed.
        notification.onclose = function () {
        console.log('Notification closed');
        };
      }

      // Otherwise, we need to ask the user for permission
      // Note, Chrome does not implement the permission static property
      // So we have to check for NOT 'denied' instead of 'default'
      else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
          // Whatever the user answers, we make sure we store the information
          if (!('permission' in Notification)) {
            Notification.permission = permission;
          }

          // If the user is okay, let's create a notification
          if (permission === "granted") {
            // var options = {
            //       body: "This is the body of the notification",
            //       icon: "icon.jpg",
            //       dir : "ltr"
            //   };
            var notification = new Notification("Hi hero, New notification",options);
            // Remove the notification from Notification Center when clicked.
            notification.onclick = function () {
              window.open(window.location.origin);
            };

            // Callback function when the notification is closed.
            notification.onclose = function () {
            console.log('Notification closed');
            };
          }
        });
      }

      // At last, if the user already denied any notification, and you
      // want to be respectful there is no need to bother them any more.
    }


});

var vis = (function(){
    var stateKey, eventKey, keys = {
        hidden: "visibilitychange",
        webkitHidden: "webkitvisibilitychange",
        mozHidden: "mozvisibilitychange",
        msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function(c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();


function progressBar(totalOnlineUser) {

    if (totalOnlineUser) {
        $("#context").slideDown('slow', function () {
            $("#myModalLoading").modal('hide');
        });
    } else {

        $(".modal-body").html("<img src='/images/loading.GIF'><h3>  Loading please wait....</h3>");


    }
}
