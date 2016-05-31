$(document).ready(function () {
  $(document).on('click', '#btnviewp', function () {
      //var firstid = $(this).data("firstid");
      var firstid = $(this).attr('data-valuep');
      var b= document.getElementsByTagName('body');
      $(b).append("<div class='overlay1 dark'> <i class='fa fa-refresh fa-spin'></i> </div>");


      $.getJSON( "getuserdetail", { uid: firstid })
        .done(function( data ) {

          //alert( "Data Loaded: " + JSON.stringify(data) );
          $('#u-name').html(data.name);
          $('#u-email').html(data.email);
          $('#u-pass').html(data.pass);

          $('div.overlay1').remove();
      });
  });
});
