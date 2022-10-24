import React from 'react';
import { buildStatus } from '../utils';

const BookingCard = (booking) => {

	function go() {
		window.location.href = `/bookings/${booking.id}`;
	};

	return(
		<div className="col-md-4 col-sm-6 col-xs-12">
			<div className="booking-card pointer" onClick={go} >
				<img className="bc-cover" src={booking.boat.cover_photo} />
				<div className="bc-description">
					<div className="body-heavy greyPool">{booking.date}</div>
					<div className="subheader-heavy" style={{margin: '5px 0px'}} >{booking.boat.title}</div>
					{buildStatus(booking.status)}
				</div>
			</div>
		</div>
	);
};

export default BookingCard;