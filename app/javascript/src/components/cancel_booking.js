import React, { useState, useContext } from 'react';
import { ErrorBox, Submit, Modal } from '../components';
import Context from '../context';
import { bookingStatus, toUSD, parseDateString } from '../utils';

const CancelBooking = (props) => {
	const { api, state } = useContext(Context);
	const { booking, boat } = state;
	const [message, setMessage] = useState();
	const [step, setStep] = useState('cancel');
	const guestRefund = booking.hours_until_start > 23 ? booking.amount : booking.amount / 2;

	async function cancel() {
		const res = await api.updateBooking(booking.id, {
			cancel_message: message,
			status: state.hosting ? bookingStatus.cancelled_by_host : bookingStatus.cancelled_by_guest,
		});
		if (res) setStep('success');
	};

	async function guestContinue() {
		if (!boat.custom_cancellation_policy) {
			setStep('confirm');
		} else {
			const res = await api.updateBooking(booking.id, {
				status: bookingStatus.cancellation_requested,
			});
			if (res) setStep('custom_success');
		};
	};

	function guestComp() {
		switch (step) {
			case 'cancel':
				return(
					<div>
						<h2>Cancel Booking</h2>
						<div className="body-light greyPool">
							Are you looking to cancel your booking? Keep in mind that you will need to adhere to the cancellation policy.
						</div>
						<div className="subheader-heavy" style={{margin: '10px 0px'}} >Cancellation Policy</div>
						<div className="body-light greyPool" style={{margin: '10px 0px'}}>Today’s date: {parseDateString(new Date())} <span className="redPool">({booking.days_until_start < 3 ? `${booking.hours_until_start} hours` : `${booking.days_until_start} days`} before booking start time)</span></div>
						{
							!!boat.custom_cancellation_policy

							? 	<div className="caption-light greyPool">
									{boat.custom_cancellation_policy}
								</div>

							: 	<ul className="body-light greyPool">
									<li>If a guest makes a cancellation before 24 hours of the booking start time, they are granted a full refund for the trip.</li>
									<li>If a guest makes a cancellation within 24 hours of the booking start time, they are granted a partial refund of 50% for the trip.</li>
									<li>If a host makes a cancellation, the guest is always given a full refund.</li>
								</ul>
						}
						<div className="text-right">
							<button className="btn-primary" onClick={() => guestContinue()} >
								Continue
							</button>
						</div>
					</div>
				);
				break;
			case 'confirm':
				return(
					<div>
						<h2>Confirm Cancellation</h2>
						<div className="subheader-heavy">Refund Details</div>
						<div className="body-light greyPool flex-between" style={{marginTop: '10px'}} >
							<div>{toUSD(boat.price)} x {booking.duration_in_hours} Hours</div>
							<div>{toUSD(guestRefund)}</div>
						</div>
						{
							booking.hours_until_start < 24

							? 	<div className="body-light greyPool">50% Refund</div>

							: 	<div className="body-light greyPool">Full Refund</div>
						}
						<div className="body-light greyPool flex-between" style={{marginTop: '10px'}}>
							<div>Service Fee</div>
							<div>{toUSD(booking.service_fee)}</div>
						</div>
						<div className="body-light greyPool">Full Refund</div>
						<div className="small-grey-divider" />
						<div className="body-light greyPool flex-between">
							<div>Total Refund</div>
							<div>{toUSD(guestRefund + booking.service_fee)}</div>
						</div>
						<div className="body-light greyPool" style={{marginTop: '10px'}}>
							Your booking will be canceled immediately and you will be refunded within 10 business days.
						</div>
						<div className="body-light greyPool" style={{margin: '10px 0px'}} >{message}</div>
						<div className="text-right">
							<button className="btn-secondary-teal" style={{marginRight: '15px'}} onClick={() => setStep('cancel')}>
								Go Back
							</button>
							<Submit
								loading={state.loading.update_booking}
								copy="Yes, Cancel"
								onClick={cancel}
							/>
						</div>
					</div>
				);
				break;
			case 'success':
				return(
					<div className="text-center">
						<i className="fas fa-check-circle big-check" />
						<h2>Your booking was canceled</h2>
						<div style={{margin: '20px 0px 20px 0px'}} className="body-light greyPool text-center">You and your guest have been sent email confirmation of the cancellation.</div>
						<button className="btn-primary" style={{width: '100%', marginBottom: '20px'}} onClick={props.onClose}>Close</button>
					</div>
				);
				break;
			case 'custom_success':
				return(
					<div className="text-center">
						<i className="fas fa-check-circle big-check" /> 
						<h2>Cancellation Requested</h2>
						<div style={{margin: '20px 0px 20px 0px'}} className="body-light greyPool text-center">You and your guest will be sent email confirmation of the cancellation.</div>
						<button className="btn-primary" style={{width: '100%', marginBottom: '20px'}} onClick={props.onClose}>Close</button>
					</div>
				);
				break;
		}
	}


	function hostComp() {
		switch (step) {
			case 'cancel':
				return(
					<div>
						<h2>Cancel Booking</h2>
						<div className="body-light greyPool">
							Are you looking to cancel your booking? Keep in mind that the guest will be fully refunded for the trip.
						</div>
						<br/>
						<div className="body-light greyPool">
							Would you like to send a note to {booking.user.first_name}?
						</div>
						<div className="input-primary">
							<textarea
								value={message}
								onChange={({ target }) => setMessage(target.value)}
								placeholder={`Optionally, enter a note to ${booking.user.first_name} explaining why you are cancelling.`}
								rows="5"
							/>
						</div>
						<div className="text-right">
							<button className="btn-primary" onClick={() => setStep('confirm')} >
								Continue
							</button>
						</div>
					</div>
				);
				break;
			case 'confirm':
				return(
					<div>
						<h2>Confirm Cancellation</h2>
						<div className="subheader-heavy">Refund Details</div>
						<div className="body-light greyPool flex-between" style={{margin: '10px 0px'}}>
							<div>{toUSD(boat.price)} x {booking.duration_in_hours} Hours</div>
							<div>{toUSD(booking.amount)}</div>
						</div>
						<div className="body-light greyPool">Full Refund</div>
						<div className="body-light greyPool" style={{margin: '10px 0px'}}>
							Your booking will be canceled immediately and your guest will be refunded within 10 business days.
						</div>
						{message && <div className="subheady-heavy">Your Message to {booking.user.first_name}</div>}
						<div className="body-light greyPool" style={{margin: '10px 0px'}} >{message}</div>
						<div className="text-right">
							<button className="btn-secondary-teal" style={{marginRight: '15px'}} onClick={() => setStep('cancel')} >
								Go Back
							</button>
							<Submit
								loading={state.loading.update_booking}
								copy="Yes, Cancel"
								onClick={cancel}
							/>
						</div>
					</div>
				);
				break;
			case 'success':
				return(
					<div className="text-center">
						<i className="fas fa-check-circle big-check" />
						<h2>Your booking was canceled</h2>
						<div style={{margin: '20px 0px 20px 0px'}} className="body-light greyPool text-center">You and your guest have been sent email confirmation of the cancellation.</div>
						<button className="btn-primary" style={{width: '100%', marginBottom: '20px'}} onClick={props.onClose}>Close</button>
					</div>
				);
				break;
		}
	}

	return(
		<Modal {...props}>
			<div style={{padding: '30px', textAlign: 'left'}}>
				<ErrorBox error={state.errors.update_booking} />
				{state.hosting ? hostComp() : guestComp()}
			</div>
		</Modal>
	);
};

export default CancelBooking;