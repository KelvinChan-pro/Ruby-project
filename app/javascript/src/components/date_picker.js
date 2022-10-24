import React, { useRef, useState, useContext } from 'react';
import { Calendar } from '../components';
import Context from '../context';

const DatePicker = ({ children, onChange, ...calendarProps }) => {
	const { api, state } = useContext(Context);
	const input = useRef();
	const overlay = useRef();
	const [show, setShow] = useState(false);
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);

	return(
		<div style={{position: 'relative'}} >
			{show && <div ref={overlay} className="clear-overlay" onClick={() => setShow(false)} />}
			{children({ date: state.date, setShow })}
			<Calendar
				className="small-calendar"
				minDate={yesterday}
				show={show}
				onChange={date => { 
					api.setDateString(date); 
					setShow(false); 
					onChange && onChange(date); 
				}}
				weekendsDisabled={false}
				weekdaysDisabled={false}
				{...calendarProps}
				defaultValue={[]}
			/>
		</div>
	);
};

export default DatePicker;