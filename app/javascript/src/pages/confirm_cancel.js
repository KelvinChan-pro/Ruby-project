import React, { useRef } from 'react';
import { withStuff } from '../hocs';
import { SuccessBox, ErrorBox, Submit } from '../components';
import { parseDateString, toUSD, bookingStatus } from '../utils';

const ConfirmCancel = ({ state, api }) => {
	const { user, booking, boat } = state;
	const transferAmount = useRef();

	async function cancelBooking() {
		const res = await api.customRefund(booking.id, {
			amount: transferAmount.current.value ? parseInt(transferAmount.current.value) : 0,
		});
	};

	if (!user.admin) {
		return(
			<div className="container">
				<ErrorBox error="Not authorized" />
			</div>
		);
	} else {
		return(
			<div className="container">
				<h2 style={{marginTop: '20px'}} >Cancel Booking</h2>
				<div className="subheader-heavy">Trip date</div>
				<div className="subheader-light greyPool" style={{marginBottom: '10px'}}>{parseDateString(booking.date)}</div>
				<div className="subheader-heavy">Trip date</div>
				<div className="subheader-light greyPool" style={{marginBottom: '10px'}}>{parseDateString(new Date())} <span className="redPool">({booking.days_until_start < 3 ? `${booking.hours_until_start} hours` : `${booking.days_until_start} days`} before booking start time)</span></div>
				<div className="subheader-heavy">Amount</div>
				<div className="subheader-light greyPool" style={{marginBottom: '10px'}}>{toUSD(booking.amount)}</div>
				<div className="subheader-heavy">Cancellation policy</div>
				<div className="subheader-light greyPool" style={{marginBottom: '10px'}}>{boat.custom_cancellation_policy}</div>
				<SuccessBox success={state.success.bookings} />
				<ErrorBox error={state.errors.update_booking} />
				{
					booking.status == bookingStatus.cancellation_requested

					&&	<div>
							<div className="input-primary">
								<input
									type="number"
									placeholder="Enter custom transfer amount ($)"
									ref={transferAmount}
								/>
							</div>
							<Submit
								style={{marginTop: '20px'}} 
								className="btn-secondary-teal" 
								onClick={cancelBooking} 
								loading={state.loading.update_booking} 
								copy="Cancel Booking" 
							/>
						</div>
				}
			</div>
		);
	};
};

export default withStuff(ConfirmCancel,
	{
		api: true,
		state: true,
		query: true,
		effect: ({ api, match }) => {
			api.getBooking(match.params.id);
		},
		loader: 'bookings',
	}
);