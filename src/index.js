import React from 'react';
import type Node from 'react';
import idx from 'idx.macro';

const GET_CAL_URL = (calID, key) =>
  `https://www.googleapis.com/calendar/v3/calendars/${calID}/events?fields=items(summary,id,location,start)&key=${key}`;

const formatTime = (time: string): string => {
  time = time.substring(0, time.length - 6); // eslint-disable-line
  const parts = time.split(':');
  const hour = parts[0];
  const minutes = parts[1];
  if (hour > 12) {
    return (time = `${hour - 12}:${minutes}PM`); // eslint-disable-line
  } else if (hour === 0) {
    return (time = `${12}:${minutes}AM`); // eslint-disable-line
  } else if (hour === 12) {
    return (time += 'PM'); // eslint-disable-line
  }
  return (time += 'AM'); // eslint-disable-line
};

const formatDate = (date) => {
  date = date.split('-'); // eslint-disable-line
  const eventYear = date.shift();
  date.push(eventYear);
  date = date.join('/'); // eslint-disable-line
  return date;
};

export type CalendarEventShape = {
  id: string,
  location?: string,
  summary: string,
  dateTime?: string,
  date?: string,
};

export type CalendarShape = {
  calendarID: string,
  apiKey: string,
  children: (Array<CalendarEventShape>) => Node,
};

export type CalendarStateShape = {
  events: Array<CalendarEventShape>,
};

class Calendar extends React.PureComponent<CalendarShape, CalendarStateShape> {
  state = {
    loading: false,
    events: [],
  };

  componentDidMount() {
    this.getEvents().then((data) => {
      this.setState(state => ({
        ...state,
        loading: false,
        events: idx(data, _ => _.items),
      }));
    });
  }

  getEvents = () => {
    this.setState(state => ({
      ...state,
      events: [],
      loading: true,
    }));
    return fetch(GET_CAL_URL(this.props.calendarID, this.props.apiKey)).then(
      res => res.json(),
    );
  };

  render() {
    const { children } = this.props;
    const { loading = false, events = [] } = this.state;
    const currentEvents = events.filter(
      event =>
        (idx(event, _ => _.start.dateTime) || idx(event, _ => _.start.date)) >
        new Date().toISOString(),
    );

    if (children && typeof children === 'function') {
      return children({ events: currentEvents, loading });
    }

    return (
      <div className="events">
        <dl className="events__list">
          {currentEvents.map(event => (
            <div key={event.id} className="event">
              <dt data-test="event-summary" className="event__title">
                {event.summary}
              </dt>
              {event.location && (
                <span className="event__location">
                  <span>{event.location}</span>
                </span>
              )}
              <dd className="event__details">
                <time
                  className="event__schedule"
                  dateTime={
                    idx(event, _ => _.start.dateTime) ||
                    idx(event, _ => _.start.date)
                  }
                >
                  <span className="event__date">
                    {event.start.dateTime
                      ? formatDate(
                          idx(event, _ => _.start.dateTime.split('T')[0]),
                        )
                      : formatDate(idx(event, _ => _.start.date))}
                  </span>
                  {idx(event, _ => _.start.dateTime) && (
                    <span className="event__time">
                      {formatTime(
                        idx(event, _ => _.start.dateTime.split('T')[1]),
                      )}
                    </span>
                  )}
                </time>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }
}

export default Calendar;
