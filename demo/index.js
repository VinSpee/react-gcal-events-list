/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render } from 'react-dom';
/* eslint-enable import/no-extraneous-dependencies */

import Calendar from '../src';

const App = () => (
  <React.Fragment>
    <div>
      <h2>Function as children</h2>
      <Calendar
        calendarID="en.orthodox_christianity%23holiday%40group.v.calendar.google.com"
        apiKey="AIzaSyAunY2R4utMXaWe1uAxIRdcRsbUlI8yhL8"
      >
        {({ loading, events }) =>
          (loading ? <div>loading</div> : <div>{JSON.stringify(events)}</div>)
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
  </React.Fragment>
);

render(<App />, document.querySelector('[data-app]'));
