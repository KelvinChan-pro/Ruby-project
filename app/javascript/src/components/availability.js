import React, { useState, useRef } from 'react';
import { Calendar, CheckInput, Select } from '../components';
import { timeOptions } from '../utils';

const Availability = ({ user, proHopper }) => {
    console.log(proHopper);
    const [weekdays, setWeekdays] = useState(user.available_weekdays);
    const [weekends, setWeekends] = useState(user.available_weekends);
    
    return(
        <div>
            <div className="subheader-heavy" style={{marginBottom: '15px'}}>Set any default availabilities below:</div>
            <CheckInput
                name="available_weekdays"
                defaultValue={weekdays}
                onClick={() => setWeekdays(prev => !prev)}
                controlled={true}
            >
                <div className="subheader-light">I'm available weekdays</div>
            </CheckInput>
            <div className="flex" style={{ paddingLeft: '40px', margin: '20px 0px'}} >
                <Select
                    name="weekday_start"
                    options={timeOptions}
                    placeholder="Select a time"
                    defaultValue={user.weekday_start}
                />
                <div style={{margin: '0px 20px'}} className="subheader-light">To</div>
                <Select
                    name="weekday_end"
                    placeholder="Select a time"
                    options={timeOptions}
                    defaultValue={user.weekday_end}
                />
            </div>
            <CheckInput
                name="available_weekends"
                defaultValue={weekends}
                onClick={() => setWeekends(prev => !prev)}
                controlled={true}
            >
                <div className="subheader-light">I'm available weekends</div>
            </CheckInput>
            <div className="flex" style={{ paddingLeft: '40px', margin: '20px 0px'}} >
                <Select
                    name="weekend_start"
                    options={timeOptions}
                    placeholder="Select a time"
                    defaultValue={user.weekend_start}
                />
                <div style={{margin: '0px 20px'}} className="subheader-light">To</div>
                <Select
                    name="weekend_end"
                    placeholder="Select a time"
                    options={timeOptions}
                    defaultValue={user.weekend_end}
                />
            </div>
            <div style={{padding: '20px 0px'}}>
                <Calendar
                    defaultValue={proHopper ? user.pro_hopper_dates : user.dates}
                    weekdaysDisabled={!weekdays}
                    weekendsDisabled={!weekends}
                    minDate={new Date()}
                    className="big-calendar"
                    multiple={true}
                />
            </div>
        </div>
    );
};

export default Availability;
