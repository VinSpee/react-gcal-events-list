# React Google Calendar Events List

## Setting it up w/ your calendar

Pass the prop `apiKey` to your [Google API
Key](https://console.developers.google.com/project), then set the prop
`calendarId` to your desired calendar's ID (find this from calendar.google.com
-> my calendars -> settings -> the calendar you want to map -> Calendar Address
-> Calendar ID).

## Example

https://codesandbox.io/s/93j03m637p

```jsx
import React from 'react';
import { render } from 'react-dom';
import Calendar from 'react-google-calendar-events-list';

render(
  <React.Fragment>
    <div>
      <h2>Function as children</h2>
      <Calendar
        calendarID="en.orthodox_christianity%23holiday%40group.v.calendar.google.com"
        apiKey="AIzaSyAunY2R4utMXaWe1uAxIRdcRsbUlI8yhL8"
      >
        {({ loading, events }) =>
          loading ? <div>loading</div> : <div>{JSON.stringify(events)}</div>
        }
      </Calendar>
    </div>
    <div>
      <h2>Default output</h2>
      <Calendar
        calendarID="en.orthodox_christianity%23holiday%40group.v.calendar.google.com"
        apiKey="AIzaSyAunY2R4utMXaWe1uAxIRdcRsbUlI8yhL8"
      />
    </div>
  </React.Fragment>,
  document.getElementById('root'),
);
```
