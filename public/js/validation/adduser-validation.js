$(document).ready(function () {
    $('#formAddUser').bootstrapValidator({
        live: 'enabled',
        message: 'This value is not valid',
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                message: 'The username is not valid',
                validators: {
                    notEmpty: {
                        message: 'The username is required and can\'t be empty'
                    },
                    stringLength: {
                        min: 3,
                        max: 30,
                        message: 'The username must be more than 6 and less than 30 characters long'
                    },
                    //regexp: {
                    //    regexp: /^[a-zA-Z0-9_\.]+$/,
                    //    message: 'The username can only consist of alphabetical, number, dot and underscore'
                    //},
                    different: {
                        field: 'password',
                        message: 'The username and password can\'t be the same as each other'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'The email address is required and can\'t be empty'
                    },
                    emailAddress: {
                        message: 'The input is not a valid email address'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'The password is required and can\'t be empty'
                    },
                    identical: {
                        field: 'confirmPassword',
                        message: 'The password and its confirm are not the same'
                    },
                    different: {
                        field: 'username',
                        message: 'The password can\'t be the same as username'
                    }
                }
            },
            confirmPassword: {
                validators: {
                    notEmpty: {
                        message: 'The confirm password is required and can\'t be empty'
                    },
                    identical: {
                        field: 'password',
                        message: 'The password and its confirm are not the same'
                    },
                    different: {
                        field: 'username',
                        message: 'The password can\'t be the same as username'
                    }
                }
            },
            ddlrole: {
                validators: {
                    notEmpty: {
                        message: 'The role is required and can\'t be empty'
                    }
                }
            },
            captcha: {
                validators: {
                    callback: {
                        message: 'Wrong answer',
                        callback: function (value, validator) {
                            var items = $('#captchaOperation').html().split(' '), sum = parseInt(items[0]) + parseInt(items[2]);
                            return value == sum;
                        }
                    }
                }
            }
        }
    })
    .on('success.form.bv', function (e) {
        e.preventDefault();
        var $form = $(e.target);
        var bv = $form.data('bootstrapValidator');
        
        //$.post($form.attr('action'), $form.serialize());
        
        $.ajax({
            type: 'POST',
            url: $form.attr('action'),
            data: $form.serialize(),
            cache: false,
            success: function (data, textStatus, jqXHR) {
                if (data.status) {
                    window.location = data.redirect
                }
                else {
                    $('#msg').append('<div class="alert alert-dismissible alert-danger">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oh snap! </strong>' + data.flashMessage + '</div>');
                }
                
                //alert('Changes saved');
            },
            fail: function (data) {
                location.reload();
            },
            Error: function (xhr, status, jqhr) {
                alert('error asaas');
            }
        });

        //$.post($form.attr('action'), $form.serialize(), function (result) {
        //    console.log(result);
        //}, 'json');
    //.success(function (msg) {
    //        // great success
    //        return true;
    //        //alert(msg);
    //    })
    //.fail(function (xhr, status, error) {
    //        bv.updateStatus('email', 'INVALID', 'callback');
    //    });
    })
});