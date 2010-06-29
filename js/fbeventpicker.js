(function(global, doc, $){
  global.fbeventpicker = {
    init: function(FB) {
      FB.login(function(response) {
        
        if (response.session) {
          if (response.perms) {
            console.log('yay', response);
            /*FB.api('/me', function(response) {
              console.log(response);
            });*/
          } else {
            console.log('Handle no perms');
          }
        } else {
          console.log('Handle no perms');
        }
      }, {perms:'user_events'});
    }
  };
})(this, this.document, jQuery);