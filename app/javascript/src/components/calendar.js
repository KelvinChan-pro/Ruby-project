import React, { useState, useEffect } from 'react';
import { months } from '../utils';

const td = new Date();
const month = td.getMonth();
const year = td.getFullYear();
const firstDay = new Date(year, month, 1);
const firstWeekday = firstDay.getDay();
const lastDay = new Date(year, month + 1, 0);
const lastWeekday = lastDay.getDay();
const lastDate = lastDay.getDate();

const weekdays = [
    'S', 'M', 'T',
    'W', 'T',
    'F', 'S'
];

const CalendarDay = ({ disabled, selected, date, add, remove }) => {

    return(
        <div
            className={`calendar-day pointer body-light ${selected ? 'selected-cd' : ''} ${disabled ? 'disabled-cd nohover' : ''}`}
            onClick={() => selected ? remove(date.toDateString()) : add(date.toDateString())}
        >
            {date.getDate()}
            {
                selected

                ?   <div className="cd-slash" />

                :   null
            }
        </div>
    );

};

function parse(dates=[]) {
    return (dates || []).map(date => new Date(date).toDateString());
}


const Calendar = ({ minDate, defaultValue=[], weekendsDisabled=true, weekdaysDisabled=true, className, show=true, multiple, disabled=[], onChange }) => {
    disabled = parse(disabled);
    const [dates, setDates] = useState(parse(defaultValue));
    const [currentYear, setCurrentYear] = useState(year);
    const [currentMonth, setCurrentMonth] = useState(month);
    const [currentFirstDay, setCurrentFirstDay] = useState(firstDay);
    const [currentFirstWeekday, setCurrentFirstWeekday] = useState(firstWeekday);
    const [currentLastDay, setCurrentLastDay] = useState(lastDay);
    const [currentLastWeekday, setCurrentLastWeekday] = useState(lastWeekday);
    const [currentLastDate, setCurrentLastDate] = useState(lastDate);
    

    useEffect(() => {
        setDates(parse(defaultValue));
    }, [ defaultValue ]);

    useEffect(() => {

        if (weekendsDisabled)
            removeWeekends()

    }, [ weekendsDisabled ]);

    useEffect(() => {

        if (weekdaysDisabled)
            removeWeekdays()

    }, [ weekdaysDisabled ]);

    function removeWeekends() {
        setDates(prev => {
            const np = prev.filter(date => {
                const d = new Date(date);
                return !isWeekend(d);
            });

            return Array.from(np);
        });
    };

    function removeWeekdays() {
        setDates(prev => {
            const np = prev.filter(date => {
                const d = new Date(date);
                return isWeekend(d);
            });

            return Array.from(np);
        });
    };

    function selectAll() {
        const nds = [];

        for (let d = new Date(currentFirstDay); d <= currentLastDay; d.setDate(d.getDate() + 1)) {

            if (!isDisabled(d) && !dates.includes(d.toDateString()))
                nds.push(d.toDateString());
        }

        setDates(prev => {
            const np = prev.concat(nds);
            return Array.from(np);
        });
    };

    function removeDate(date) {
        if (multiple) {
            setDates(prev => {
                const np = prev.filter(d => d != date);
                return Array.from(np);
            });
        } else {
            setDates([]);
            onChange(null);
        }
    };

    function addDate(date) {
        if (multiple) {
            setDates(prev => {
                prev.push(date);
                return Array.from(prev);
            });
        } else {
            setDates([date]);
            onChange(date);
        }
    };

    function isWeekend(date) {
        return [0, 6].includes(date.getDay());
    };

    function isWeekday(date) {
        return !isWeekend(date);
    };

    function isDisabled(date) {

        if (disabled.includes(date.toDateString()))
            return true;

        if (date < minDate)
            return true;

        if (weekendsDisabled && isWeekend(date))
            return true;

        if (weekdaysDisabled && isWeekday(date))
            return true;
    };

    function buildWeeks(date, weekdayStart=0, weekdayEnd=6, weeks=[]) {

        const days = [];
        let allEmpty = true;

        for (let i=0; i < 7; i++) {

            if (i >= weekdayStart && i <= weekdayEnd) {

                const dateObj = new Date(currentYear, currentMonth, date);

                days.push(
                    <CalendarDay
                        key={i}
                        disabled={isDisabled(dateObj)}
                        date={dateObj}
                        selected={dates.includes(dateObj.toDateString())}
                        add={addDate}
                        remove={removeDate}
                    />
                );

                date += 1;
                allEmpty = false;

            } else {

                days.push(<div key={i} className="empty-calendar-day calendar-day" />);

            };

        };

        if (!allEmpty)
            weeks.push(
                <div className="calendar-week" key={date} >
                    {days}
                </div>
            );

        if (date <= currentLastDate) {

            if (currentLastDate - 7 < date) {

                return buildWeeks(date, 0, currentLastWeekday, weeks);

            } else {

                return buildWeeks(date, 0, 6, weeks);

            }

        } else {

            return weeks;

        }

    }

    function lastMonth() {

        if (currentMonth === 0) {

            setCurrentYear(prev => prev - 1);
            setCurrentMonth(11);

        } else {

            setCurrentMonth(prev => prev - 1);

        }

        const newFirstDay = new Date(currentYear, currentMonth - 1, 1);
        setCurrentFirstDay(newFirstDay);
        setCurrentFirstWeekday(newFirstDay.getDay());
        const newLastDay = new Date(currentYear, currentMonth, 0);
        setCurrentLastDay(newLastDay);
        const newLastDate = newLastDay.getDate();
        setCurrentLastDate(newLastDate);
        setCurrentLastWeekday(newLastDay.getDay());

    };

    function nextMonth() {

        if (currentMonth === 11) {

            setCurrentYear(prev => prev + 1);
            setCurrentMonth(0);

        } else {

            setCurrentMonth(prev => prev + 1);

        }

        const newFirstDay = new Date(currentYear, currentMonth + 1, 1);
        const newLastDay = new Date(currentYear, currentMonth + 2, 0);
        const newLastDate = newLastDay.getDate();
        setCurrentLastDay(newLastDay);
        setCurrentLastDate(newLastDate);
        setCurrentLastWeekday(newLastDay.getDay());
        setCurrentFirstWeekday(currentLastWeekday + 1);
        setCurrentFirstDay(newFirstDay);

    };

    return(
        <div id="calendar" className={`calendar ${className}`} style={{display: show ? '' : 'none'}} >
            <div className="calendar-top">
                <div className="calendar-month">
                    <i className="far fa-angle-left pointer" onClick={lastMonth} />
                    <div className="subheader-heavy">{months[currentMonth]} {currentYear}</div>
                    <i className="far fa-angle-right pointer" onClick={nextMonth} />
                </div>
                {multiple && <div onClick={selectAll} className="subheader-light primaryPool pointer" >Block Month</div>}
            </div>
            <div className="calendar-week">
                {weekdays.map((weekday, i) =>
                    <div className="calendar-weekday" key={i} >
                        {weekday}
                    </div>
                )}
            </div>
            {buildWeeks(1, currentFirstWeekday)}
            <input type="hidden" name="dates" value={dates} />
        </div>
    );
};

export default Calendar;
