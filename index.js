window.React    = require("react");
var request  = require("superagent");

var CalEvent = React.createClass({

  displayName: 'CalEvent',

  _formatTime: function(time) {
    time = time.substring(0, time.length - 6);
    var parts = time.split(':');
    var hour = parts[0];
    var minutes = parts[1];
    if (hour > 12) {
      return time = (hour - 12) + ':' + minutes + 'PM';
    } else if (hour == 0) {
      return time = 12 + ':' + minutes + 'AM';
    } else if (hour == 12) {
      return time += 'PM';
    } else {
      return time += 'AM';
    }
  },

  _formatDate: function(date) {
    date = date.split("-");
    eventYear = date.shift();
    date.push(eventYear);
    date = date.join("/");
    return date;
  },

  render: function () {
    var event = this.props.event;
    var eventDateTime = this.props.event.start.dateTime;
    eventDateTime = eventDateTime.split("T");
    eventTime = this._formatTime(eventDateTime[1]);
    eventDate = this._formatDate(eventDateTime[0]);

    return(
      React.DOM.div( {className:"event"}, 
        React.DOM.dt( {className:"event__title"}, event.summary),
        React.DOM.span( {className:"event__location"}, 
          React.DOM.span(null, event.location)
        ),
        React.DOM.dd( {className:"event__details"}, 
          React.DOM.time( {className:"event__schedule", dateTime:event.start.dateTime}, 
            React.DOM.span( {className:"event__date"}, eventDate),
            React.DOM.span( {className:"event__time"}, eventTime)
          )
        )
      )
    );
  }
});

var CalEvents = React.createClass({displayName: 'CalEvents',
  propTypes: {
    calendarID: React.PropTypes.string.isRequired,
    apiKey: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      events: []
    };
  },

  componentDidMount: function() {
    request
      .get('https://www.googleapis.com/calendar/v3/calendars/' + this.props.calendarID + '/events?fields=items(summary,id,location,start)&key=' + this.props.apiKey)
      .end(function(res){
      this.setState({
        events: res.body.items
      });
    }.bind(this));
  },

  render: function() {

    return(
      React.DOM.div( {className:"events"}, 
        React.DOM.dl( {className:"events__list"}, 
        this.state.events.map(function (event) {
          var today = new Date;
          today = today.toISOString();
          if(event.start.dateTime >  today) {
            return(
              CalEvent( {className:"events__item", key:event.id, event:event})
            );
          }
        })
        )
      )
    );
  }
});

module.exports = CalEvents;
