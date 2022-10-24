import React from 'react';
import { Tabs, BookingCard, Table } from '../components';
import { 
	bookingStatus, buildStatus, fancyTimeOptions, 
	parseDateString, toUSD,
} from '../utils';
import { withStuff } from '../hocs';
import { Tooltip } from 'react-tippy';

const hostSchema = {
	status: {
		children: ({ datum }) => buildStatus(datum.status, "body-heavy", false),
	},
	guests: {
		children: ({ datum }) => (
			<div>
				<div className="caption-heavy primaryPool">
					{datum.user.full_name}
				</div>
				<div className="caption-light greyPool">
					{datum.number_of_guests} Guests
				</div>
			</div>
		),
	},
	date: {
		label: 'Trip Date',
		defaultSort: true,
	},
	range: {
		label: 'Trip Start/End Time',
		children: ({ datum }) => (
			<div>{fancyTimeOptions[datum.start_time]} - {fancyTimeOptions[datum.start_time + datum.duration_in_hours]}</div>
		),
	},
	duration: {
		children: ({ datum }) => (
			<div>{datum.duration_in_hours} Hours</div>
		),
	},
	submitted: {},
	payout: {
		label: 'Total Payout',
		children: ({ datum }) => (
			<div>
				{toUSD(datum.host_amount)}
			</div>
		),
	},
	details: {
		label: ' ',
		children: ({ datum }) => (
			<a className="btn-secondary-teal" href={`/bookings/${datum.id}`}>
				Details
			</a>
		),
	},
	calendar_link: {
		label: ' ',
		children: ({ datum }) => (
			<a href={datum.calendar_link} target="_none">
				<i style={{fontSize: '20px'}} className="fal fa-calendar-plus primaryPool" />
			</a>
		),
	},
};

const Bookings = ({ state }) => {

	const Filter = ({ bookings, status }) => {
		if (Array.isArray(status)) {
			bookings = bookings.filter(booking => status.includes(booking.status));
		} else if (!!status) {
			bookings = bookings.filter(booking => booking.status === status);
		}

		if (state.hosting) {
			return(
				<Table
					schema={hostSchema}
					data={bookings}
					style={{marginTop: '25px'}}
				/>
			);
		} else {
			return(
				<div className="row" style={{marginTop: '25px'}} >
					{bookings.map((booking, i) =>
						<BookingCard key={i} {...booking} />
					)}
				</div>
			);
		};
		
	};

	return(
		<div className="container" style={{margin: '40px auto'}}>
			<h1>Bookings</h1>
		    <Tabs
                bookings={state.bookings}
		    	tabs={{
		    		requests: {
		    			name: 'Requests',
		    			child: ({ bookings }) => <Filter bookings={bookings} status="requested" />,
		    		},
		    		upcoming: {
		    			name: 'Upcoming',
		    			child: ({ bookings }) => <Filter bookings={bookings} status="approved" />,
		    		},
		    		completed: {
		    			name: 'Completed',
		    			child: ({ bookings }) => <Filter bookings={bookings} status="completed" />,
		    		},
		    		cancelled: {
		    			name: 'Cancelled',
		    			child: ({ bookings }) => <Filter bookings={bookings} status={["cancelled_by_host", "cancelled_by_guest"]}  />,
		    		},
		    		all: {
		    			name: 'All',
		    			child: ({ bookings }) => <Filter bookings={bookings} />,
		    		},
		    	}}
		    />
		</div>
	);
};

export default withStuff(Bookings,
	{
		api: true,
		state: true,
		effect: ({ state, api }) => {
			if (state.bookings.length == 0)
				api.getBookings(state.profile.id);
		},
		loader: 'bookings',
	}
);
