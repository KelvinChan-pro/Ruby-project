import React, { useState, useRef, useContext, useEffect } from 'react';
import Context from '../context';
import { 
	parseTimeStamp, months, bookingStatus,
	getHours, getMinutes,
} from '../utils';
import { Submit } from '../components';

const BookingEvent = ({ noo=false, ...event }) => {
	const { api, state } = useContext(Context);
	const { booking } = state;
	const [confirm, setConfirm] = useState(false);
	const declineMessage = useRef();

	useEffect(() => {
		document.querySelectorAll('[data-time]').forEach(e => {
			const v = e.getAttribute('data-time');
			const date = new Date(parseInt(v));
			const timeString = `${getHours(date)}:${getMinutes(date)} ${date.getHours() < 12 ? 'AM' : 'PM'}`;
			e.innerHTML = timeString;
		});

		document.querySelectorAll('[data-date]').forEach(e => {
			const v = e.getAttribute('data-date');
			const date = new Date(parseInt(v));
			const dateString = `${months[date.getMonth()]} ${date.getDate()}`;
			e.innerHTML = dateString;
		});
	}, [ event ]);

	function approve() {
		api.updateBooking(booking.id, {
			status: bookingStatus.approved,
		});
	};

	function decline() {
		api.updateBooking(booking.id, {
			status: bookingStatus.declined,
			decline_message: declineMessage.current.value,
		});
	};

	function buildAction(action) {
		const actions = {
			approve: (

				confirm

				? 	<div style={{marginTop: '15px'}} >
						<div className="title-small">Would you like to send a note to your guest?</div>
						<div className="body-light greyPool">optional:</div>
						<div className="input-primary">
							<input ref={declineMessage} type="text" placeholder="If you’d like to tell your guest why you are declining, write your message here." />
						</div>
						<div className="flex float-right text-right" style={{marginLeft: 'auto', marginTop: '15px'}} >
							<div onClick={() => setConfirm(false)} className="link-btn" style={{marginRight: '20px'}} >
								Cancel
							</div>
							<Submit
								copy="Confirm Decline"
								loading={state.loading.update_booking}
								onClick={decline}
							/>
						</div> 
					</div>

				: 	<div className="flex" style={{marginLeft: 'auto', marginTop: '15px'}} >
						<Submit
							copy="Approve"
							loading={state.loading.update_booking}
							onClick={approve}
							style={{marginRight: '20px'}}
						/>
						<button onClick={() => setConfirm(true)} className="btn-secondary-teal">
							Decline
						</button>
					</div>
					
			),
		};

		return actions[action];
	}

	return(
		<div className={`booking-event card ${noo ? 'new-event' : null}`}>
			<div className="body-heavy">{parseTimeStamp(event.timestamp)}</div>
			<div className="title-small">{event.title}</div>
			<div className="body-light greyPool" style={{marginTop: '15px'}} dangerouslySetInnerHTML={{__html: event.description}} />
			{noo && event.action && buildAction(event.action)}
		</div>
	);
};

export default BookingEvent;