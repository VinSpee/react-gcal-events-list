/** @jsx React.DOM */
var React    = require("react");
var request  = require("superagent");

/** @jsx React.DOM */

var CalEvent = React.createClass({

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
      <div className="event">
        <dt className="event__title">{event.summary}</dt>
        <span className="event__location">
          <span>{event.location}</span>
        </span>
        <dd className="event__details">
          <time className="event__schedule" dateTime={event.start.dateTime}>
            <span className="event__date">{eventDate}</span>
            <span className="event__time">{eventTime}</span>
          </time>
        </dd>
      </div>
    );
  }
});

var CalEvents = React.createClass({
  getInitialState: function() {
    return {
      events: []
    };
  },

  componentDidMount: function() {
    request
      .get('https://www.googleapis.com/calendar/v3/calendars/' + this.props.calendarID + '/events?fields=items(summary,id,location,start)&key=' + this.props.apiKey)
      .end(function(res){
         var events = res.body.items;
         this.setState({
           events: events
         });
      }.bind(this));
  },

  render: function() {

    return(
      <div className="events">
        <dl className="events__list">
        {this.state.events.map(function (event) {
          var today = new Date;
          today = today.toISOString();
          if(event.start.dateTime >  today) {
            return(
              <CalEvent className="events__item" key={event.id} event={event}/>
            );
          }
        })}
        </dl>
      </div>
    );
  }
});

React.renderComponent(
  <CalEvents calendarID="find this from calendar.google.com -> my calendars -> settings -> the calendar you want to map -> Calendar Address -> Calendar ID" apiKey="Get a free api key from https://console.developers.google.com/project" />,
  document.querySelector("[data-component=events-list]")
);

module.exports = CalEvents;
