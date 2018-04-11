import React from 'react';

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

export type CalendarShape = {
  calendarID: string,
  apiKey: string,
};

export type CalendarStateShape = {
  events: Array<{
    id: string,
    location?: string,
    summary: string,
    dateTime?: string,
    date?: string,
  }>,
};

class Calendar extends React.PureComponent<CalendarShape, CalendarStateShape> {
  state = {
    events: [],
  };

  componentDidMount() {
    if (this.props.calendarID && this.props.apiKey) {
      this.getEvents.then((data) => {
        this.setState(state => ({
          ...state,
          events: data.items,
        }));
      });
      return;
    }
    throw new Error('please provide an API key and Calendar ID');
  }

  getEvents = fetch(GET_CAL_URL(this.props.calendarID, this.props.apiKey)).then(
    res => res.json(),
  );

  render() {
    const { events } = this.state;
    return (
      <div className="events">
        <dl className="events__list">
          {events
            .filter(
              event =>
                (event.start.dateTime || event.start.date) >
                new Date().toISOString(),
            )
            .map(event => (
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
                    dateTime={event.start.dateTime || event.start.date}
                  >
                    <span className="event__date">
                      {event.start.dateTime
                        ? formatDate(event.start.dateTime.split('T')[0])
                        : formatDate(event.start.date)}
                    </span>
                    {event.start.dateTime && (
                      <span className="event__time">
                        {formatTime(event.start.dateTime.split('T')[1])}
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
