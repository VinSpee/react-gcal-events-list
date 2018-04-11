(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
	typeof define === 'function' && define.amd ? define(['react'], factory) :
	(global.ReactShowMore = factory(global.React));
}(this, (function (React) { 'use strict';

React = React && React.hasOwnProperty('default') ? React['default'] : React;

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var GET_CAL_URL = function GET_CAL_URL(calID, key) {
  return 'https://www.googleapis.com/calendar/v3/calendars/' + calID + '/events?fields=items(summary,id,location,start)&key=' + key;
};

var formatTime = function formatTime(time) {
  time = time.substring(0, time.length - 6); // eslint-disable-line
  var parts = time.split(':');
  var hour = parts[0];
  var minutes = parts[1];
  if (hour > 12) {
    return time = hour - 12 + ':' + minutes + 'PM'; // eslint-disable-line
  } else if (hour === 0) {
    return time = 12 + ':' + minutes + 'AM'; // eslint-disable-line
  } else if (hour === 12) {
    return time += 'PM'; // eslint-disable-line
  }
  return time += 'AM'; // eslint-disable-line
};

var formatDate = function formatDate(date) {
  date = date.split('-'); // eslint-disable-line
  var eventYear = date.shift();
  date.push(eventYear);
  date = date.join('/'); // eslint-disable-line
  return date;
};

var Calendar = function (_React$PureComponent) {
  inherits(Calendar, _React$PureComponent);

  function Calendar() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, Calendar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = Calendar.__proto__ || Object.getPrototypeOf(Calendar)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      events: []
    }, _this.getEvents = fetch(GET_CAL_URL(_this.props.calendarID, _this.props.apiKey)).then(function (res) {
      return res.json();
    }), _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(Calendar, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (this.props.calendarID && this.props.apiKey) {
        this.getEvents.then(function (data) {
          _this2.setState(function (state) {
            return Object.assign({}, state, {
              events: data.items
            });
          });
        });
        return;
      }
      throw new Error('please provide an API key and Calendar ID');
    }
  }, {
    key: 'render',
    value: function render() {
      var events = this.state.events;

      return React.createElement(
        'div',
        { className: 'events' },
        React.createElement(
          'dl',
          { className: 'events__list' },
          events.filter(function (event) {
            return (event.start.dateTime || event.start.date) > new Date().toISOString();
          }).map(function (event) {
            return React.createElement(
              'div',
              { key: event.id, className: 'event' },
              React.createElement(
                'dt',
                { 'data-test': 'event-summary', className: 'event__title' },
                event.summary
              ),
              event.location && React.createElement(
                'span',
                { className: 'event__location' },
                React.createElement(
                  'span',
                  null,
                  event.location
                )
              ),
              React.createElement(
                'dd',
                { className: 'event__details' },
                React.createElement(
                  'time',
                  {
                    className: 'event__schedule',
                    dateTime: event.start.dateTime || event.start.date
                  },
                  React.createElement(
                    'span',
                    { className: 'event__date' },
                    event.start.dateTime ? formatDate(event.start.dateTime.split('T')[0]) : formatDate(event.start.date)
                  ),
                  event.start.dateTime && React.createElement(
                    'span',
                    { className: 'event__time' },
                    formatTime(event.start.dateTime.split('T')[1])
                  )
                )
              )
            );
          })
        )
      );
    }
  }]);
  return Calendar;
}(React.PureComponent);

return Calendar;

})));
