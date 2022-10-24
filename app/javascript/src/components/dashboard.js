import React from 'react';
import { withStuff } from '../hocs';
import { bookingStatus, fancyTimeOptions, toUSD, months } from '../utils';

const DBR = ({ id, number_of_guests, date, duration_in_hours, start_time, user }) => (
	<div className="dashboard-booking-request flex-between pointer" onClick={() => window.location.href = `/bookings/${id}`} >
		<div>
			<div className="title-small primary">Booking Request • {user.full_name}</div>
			<div className="body-light greyPool">
				{number_of_guests} Guests • {date} • {duration_in_hours} Hours • {fancyTimeOptions[start_time]} - {fancyTimeOptions[start_time + duration_in_hours]}
			</div>
		</div>
		<img className="host-avatar" src={user.profile_picture} />
    </div>
);

const Dashboard = ({ state }) => {
	const requests = state.bookings.filter(booking => booking.status === bookingStatus.requested);
	const completed = state.bookings.filter(booking => booking.status === bookingStatus.completed);

	return(
		<div id="dashboard" style={{marginTop: '40px'}} >
			<h1>Dashboard</h1>
			<div className="row">
				<div className="col-md-8 col-sm-12">
		           	<div className="card">
		           		<h2>Requests</h2>
		           		{requests.map((booking, i) => 
		           			<DBR {...booking} key={i} />
		           		)}
		           	</div>
		           	<div className="card">
		           		<h2>Stats</h2>
		           		<div className="flex">
		           			<div style={{marginRight: '15%'}} >
		           				<a href="/manage-boat/reivews" className="no-decoration">
				           			<div className="display-heavy">
				           				{state.user.host_review_meta.rating}
				           			</div>
				           			<div className="body-light">Overall Rating</div>
				           		</a>
			           		</div>
		           			<div style={{marginRight: '15%'}}>
		           				<a href="/manage-boat/reivews" className="no-decoration">
				           			<div className="display-heavy">
				           				{state.user.host_review_meta.count}
				           			</div>
				           			<div className="body-light">Total Reviews</div>
				           		</a>
			           		</div>
		           			<div>
		           				<a href="/manage-boat/bookings" className="no-decoration">
				           			<div className="display-heavy">
				           				{completed.length}
				           			</div>
				           			<div className="body-light">Total Bookings</div>
				           		</a>
			           		</div>
		           		</div>
		           		<div className="grey-divider" />
		           		<div className="flex">
		           			<div style={{marginRight: '15%'}}>
			           			<div className="display-heavy">
			           				{toUSD(state.user.monthly_earnings)}
			           			</div>
			           			<div className="body-light">{months[new Date().getMonth()]} Earnings</div>
			           		</div>
		           			<div>
			           			<div className="display-heavy">
			           				{toUSD(state.user.total_earnings)}
			           			</div>
			           			<div className="body-light">Total Earnings</div>
			           		</div>
		           		</div>
		           	</div>
		        </div>
           	</div>
		</div>
	);
};

export default withStuff(Dashboard, {
	api: true, state: true,
	effect: ({ state, api }) => {
		if (state.bookings.length == 0)
			api.getBookings();
	},
	loader: 'bookings',
});
