(function(global, doc, $){
  
  // Define the namespace
  global.fbeventpicker = {
    
    // Initialization Function
    init: function(FB) {
      var that = this;
      
      // Authenticate with Facebook
      this.authenticate(function(){
        // Get the user's events
        that.getEvents(function(events){
          
          // Build the html for the selection process
          that.buildEventList(events);
        });
      });
      
      // Attach output button handler
      $('#'+this.options.prefix+'toCSV').click(function(){
        that.outputCSV();
        return false;
      });
    },
    
    // resuable values for configuration
    options: {
      permissions: "user_events",
      prefix: "fbep-",
      eventList: "eventlist",
      container: "container"
    },
    
    // Handles Facebook Authentication
    // -- Only fires callback if correct Auth is achieved
    authenticate: function(callback) {
      var that = this;
      FB.login(function(response) {
        
        if (response.session) {
          if (response.perms) {
            callback();
          } else {
            //TODO:: Handle bad permissions situation
          }
        } else {
          //TODO:: Handle bad permissions situation
        }
      }, {perms: that.options.permissions});
    },
    
    // Retrieve the user's events from facebook
    getEvents: function(callback) {
      FB.api('/me/events', function(response) {
        callback(response.data);
      });
    },
    
    // Inject the events into the DOM
    buildEventList: function(events) {
      var container = $('#'+this.options.prefix+this.options.container),
          eventList = container.find('#'+this.options.prefix+this.options.eventList),
          eventKey,
          event,
          eventElem;
      
      // Save an object level reference
      this.container = this.container || container;
      this.eventList = this.eventList || eventList;
      
      // Loop through events
      for(eventKey in events) {
        if(events.hasOwnProperty(eventKey)) {
          event = events[eventKey];
          
          // Create list items from the events
          // Available properties are:
          //     name, location, start_time, end_time, id, rsvp_status
          eventElem = $('<li />').html(
            'Name: ' + event.name + '<br />' +
            'Location: ' + event.location + '<br />' +
            'Start: ' + event.start_time + '<br />' +
            'End: ' + event.end_time + '<br />' +
            'RSVPd?: ' + event.rsvp_status + '<br />' +
            'Include? <input type="checkbox" />'
          ).data(this.options.prefix+'event', event);
          
          // append event to list
          eventList.append(eventElem);
        }
      }
    },
    
    // Take selections and create CSV output
    outputCSV: function() {
      var event,
          CSV = ['"Name","Location","Start_Time","End_Time"'],
          outputBox = this.container.find('#'+this.options.prefix+'CSVoutput'),
          that = this;
      
      // Build an array of selected events
      this.eventList.find('input:checked').each(function(){
        event = $(this).closest('li').data(that.options.prefix+'event');
        CSV.push('"'+event.name+'","'+event.location+'","'+event.start_time+'","'+event.end_time+'"');
      });
      
      outputBox.val(CSV.join("\n"));
    }
  };
})(this, this.document, this.jQuery);