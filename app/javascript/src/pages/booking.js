import React, { useState, Fragment } from 'react';
import { 
	ErrorBox, BookingEvent, CancelBooking, ReviewBooking,
	BookingMessage, TipModal,
} from '../components';
import { 
	parseDateString, fancyTimeOptions, bookingStatus,
	toUSD, buildStatus,
} from '../utils';
import { withStuff } from '../hocs';
import { Tooltip } from 'react-tippy';

const Booking = ({ state }) => {
	const { booking, boat } = state;
	const [cancelModal, setCancelModal] = useState(false);
	const [reviewModal, setReviewModal] = useState(false);
	const [tipModal, setTipModal] = useState(false);
	const events = state.hosting ? booking.host_events : booking.guest_events;
	const newEvent = events[0];

	return(
		<div className="booking-show container" style={{margin: '50px auto'}} >
			<CancelBooking show={cancelModal} onClose={() => setCancelModal(false)} />
			<ReviewBooking show={reviewModal} onClose={() => setReviewModal(false)} />
			<TipModal show={tipModal} onClose={() => setTipModal(false)} />
			<h2 className="pointer"  onClick={() => window.history.back()} >
				<i className="fal fa-angle-left" style={{marginRight: '15px'}} />
				Back to Bookings
			</h2>
			<div className="flex-between">
				<h1 style={{marginTop: '20px'}} >Booking Request</h1>
				{state.hosting && <Tooltip
			        title="Add booking to google calendar."
			        position= "right"
			        trigger= "mouseenter"
			        inertia= "true"
			        transitionFlip= "true"
			        delay='0'
			    >
					<a href={booking.calendar_link} target="_none">
						<i style={{fontSize: '30px'}} className="fal fa-calendar-plus primaryPool pointer" />
					</a>
				</Tooltip>}
			</div>
			<ErrorBox error={state.errors.update_booking} />
			{buildStatus(booking.status)}
			<div className="row">
				<div className="col-md-4 col-sm-12">
					<div className="card booking-left">
						{
							state.hosting

							? 	<div className="text-center">
									<img src={booking.user.profile_picture_url} className="booking-guest-photo" />
									<div className="subheader-heavy" style={{margin: '15px 0px'}} >{booking.user.full_name}</div>
								</div>

							: 	<Fragment>
									<img className="booking-cover-photo" src={boat.cover_photo} />
									<div className="title-small" style={{margin: '20px 0px'}} >{boat.title}</div>
									<div className="flex" style={{marginBottom: '15px'}}>
										<img className="host-avatar" src={boat.user.profile_picture_url} />
										<div>
											<div className="body-heavy">Meet your Host, {boat.pro_hopper ? booking.host.full_name : booking.host.first_name}</div>
											<div className="body-light greyPool">{boat.user.headline}</div>
										</div>
									</div>
								</Fragment>
						}
						<div className="subheader-heavy">Trip Details</div>
						<div className="flex" style={{padding: '20px 40px 0px 0px'}} >
							<div>
								<div className="body-light greyPool" style={{width: '200px'}} >
									Boat
								</div>
								<div className="body-light">
									{booking.boat.title}
								</div>
							</div>
						</div>
						<div className="flex" style={{padding: '20px 40px 0px 0px'}} >
							<div>
								<div className="body-light greyPool" style={{width: '200px'}} >
									Trip Date
								</div>
								<div className="body-light">
									{parseDateString(booking.date)}
								</div>
							</div>
							<div>
								<div className="body-light greyPool">
									Duration
								</div>
								<div className="body-light">
									{booking.duration_in_hours} Hours
								</div>
							</div>
						</div>
						<div className="flex" style={{padding: '20px 40px 0px 0px'}} >
							<div>
								<div className="body-light greyPool" style={{width: '200px'}}>
									Start Time
								</div>
								<div className="body-light">
									{fancyTimeOptions[booking.start_time]}
								</div>
							</div>
							<div>
								<div className="body-light greyPool">
									End Time
								</div>
								<div className="body-light">
									{fancyTimeOptions[booking.start_time + booking.duration_in_hours]}
								</div>
							</div>
						</div>
						<div className="flex-start" style={{padding: '20px 0px 0px 0px'}} >
							{!boat.pro_hopper &&
								<div>
									<div className="body-light greyPool" style={{width: '200px'}}>
										Guests
									</div>
									<div className="body-light">
										{booking.number_of_guests}
									</div>
								</div>
							}
							<div>
								<div className="body-light greyPool">
									Location
								</div>
								<div className="body-light">
									{booking.marina.full_name}
								</div>
							</div>
						</div>
						{boat.pro_hopper &&
							<div className="flex-start" style={{padding: '20px 0px 0px 0px'}} >
								<div>
									<div className="body-light greyPool" style={{width: '200px'}}>
										Address
									</div>
									<div className="body-light">
										{booking.marina.full_address}
									</div>
								</div>
							</div>
						}
						<div className="booking-payment-info">
							<div className="subheader-heavy">Payment</div>
							<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
								<div>
									{toUSD(boat.price)} x {booking.duration_in_hours} Hours
								</div>
								<div>
									{toUSD(boat.price * booking.duration_in_hours)}
								</div>
							</div>
							{
								booking.filet_package

								&&	<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
										<div>Filet/Clean Fish Package</div>
										<div>${boat.filet_package_price}</div>
									</div>
							}
							{
								booking.media_package

								&&	<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
										<div>Photo/Video Package</div>
										<div>${boat.media_package_price}</div>
									</div>
							}
							<div className="flex-between subheader-heavy" style={{marginTop: '20px'}} >
								<div>
									Subtotal
								</div>
								<div>
									{toUSD(booking.amount)}
								</div>
							</div>
							{
								!state.hosting

								&&	<Fragment>
										{
											!boat.pro_hopper &&
												<Fragment>
													<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
														<div>Security Deposit</div>
														<div>{toUSD(booking.security_deposit)}</div>
													</div>
													<div className="body-light greyPool text-right">
														*Placing hold on {parseDateString(booking.security_deposit_time)}
													</div>
													<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
														<div>Fuel</div>
														<div>Included</div>
													</div>
													<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
														<div>Driver</div>
														<div>Included</div>
													</div>
													<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
														<div>Insurance</div>
														<div>Included</div>
													</div>
												</Fragment>
										}
																				{
											!!booking.discount_code

											&&	<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
													<div>{booking.discount_code} Discount</div>
													<div>{toUSD(booking.discount_amount * -1)}</div>
												</div>
										}
									</Fragment>
							}
							{
								state.hosting

								?	<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
										<div>Booking Fee</div>
										<div>{toUSD(booking.listing_fee * -1)}</div>
									</div>

								: 	<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
										<div>Service Free</div>
										<div>{toUSD(booking.service_fee)}</div>
									</div>
							}
						</div>
						<div className="booking-payment-info">
							<div className="flex-between subheader-heavy" >
								<div>
									{state.hosting ? 'Your Earn' : 'Total Due'}
								</div>
								<div>
									{state.hosting ? toUSD(booking.host_amount) : toUSD(booking.amount_with_service_fee)}
								</div>
							</div>
							<div className="text-center">
								{booking.status === bookingStatus.approved && <button onClick={() => setCancelModal(true)} style={{marginTop: '15px'}} className="btn-secondary-teal">
									Cancel Booking
								</button>}
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-8 col-sm-12 booking-right">
					{
						booking.status === bookingStatus.requested &&

							<BookingMessage id={booking.id} >
								{({ setShow }) =>
									<div className="text-right">
										<button onClick={() => setShow(true)}className="btn-secondary-teal" style={{marginTop: '20px', maxWidth: '400px'}}>Message {state.hosting ? 'Guest' : 'Host'}</button>
									</div>
								}
							</BookingMessage>
					}
					{booking.status === bookingStatus.approved &&
						<div className="card trip-details">
							<div className="title-small">
								Details for your trip
							</div>
							<div className="body-light greyPool" style={{marginTop: '20px'}} >
								You can view all of the listing details on the <a href={`/boats/${boat.id}`}>listing page</a>, but some important things to keep in mind:
							</div>
							<div className="grey-divider" />
							<div className="subheader-heavy">{state.hosting ? booking.user.first_name + "'s" : 'Your'} goal for the trip:</div>
							<div className="body-light greyPool">{booking.goal_for_trip}</div>
							<div className="grey-divider" />
							{
								booking.filet_package || booking.media_package

								? 	<div>
										<div className="subheader-heavy">{state.hosting ? booking.user.first_name + "'s" : 'Your'} Packages:</div>
										{booking.filet_package && <div style={{marginTop: '5px'}} className="body-light greyPool">Filet/Clean Fish Package</div>}
										{booking.media_package && <div style={{marginTop: '5px'}} className="body-light greyPool">Photo/Video Package</div>}
										<div className="grey-divider" />
									</div>

								: 	null
							}
							{!state.hosting &&
								<div>
									<div className="subheader-heavy">What to bring:</div>
									<div className="body-light greyPool">{boat.guests_should_bring}</div>
									<div className="grey-divider" />
								</div>
							}
							<div className="subheader-heavy">Where to meet:</div>
							<div className="body-light greyPool">You've agreed to meet at this location:</div>
							<div className="subheader-heavy primaryPool" style={{marginTop: '10px'}}>{booking.marina.name}</div>
							<div className="body-light greyPool" style={{marginTop: '10px'}}>{booking.marina.address}</div>
							<div className="body-light greyPool" style={{marginTop: '10px'}}>{booking.marina.city}, {booking.marina.state} {booking.marina.zip}</div>
							<BookingMessage id={booking.id} >
								{({ setShow }) =>
									<button onClick={() => setShow(true)}className="btn-secondary-teal" style={{marginTop: '20px', maxWidth: '400px'}}>Message {state.hosting ? 'Guest' : 'Host'}</button>
								}
							</BookingMessage>
						</div>
					}

					{booking.status === bookingStatus.completed &&
						<div className="card trip-details">
							<div className="title-small">
								Trip completed!
							</div>
							<div className="body-light greyPool" style={{marginTop: '20px'}} >
								We hope you had a great time out on the water! The only thing left for you to do is leave a review.
								{
									state.hosting

									? 	` Reviews are important for future hosts to know what you thought about your time with ${booking.user.first_name}.` 

									:  	` Reviews are important for future guests to know what you thought about your time with ${booking.host.first_name}.`
								}
								{!state.hosting && ` If you loved your trip with ${booking.host.first_name}, feel free to leave them a tip!`}
							<br/><br/>
								If something went wrong, you have 24 hours from the end of the trip to contact support and report a problem. Otherwise, this booking will be finalized.
							</div>
							<div className="flex" style={{marginTop: '20px'}} >
								{!state.hosting && <button onClick={() => setTipModal(true)} style={{marginRight: '10px'}} className="btn-primary">Tip your Host</button>}
								<button onClick={() => setReviewModal(true)} style={{marginRight: '10px'}} className="btn-primary">Review your trip</button>
								<a href="mailto:support@lakehop.com" className="btn-secondary-teal">Contact Support</a>
							</div>
						</div>
					}
					<div className="title-small">New</div>
					{newEvent && <BookingEvent {...newEvent} noo={true} />}
					<div className="title-small">History</div>
					{events.slice(1, events.length).map((event, i) =>
						<BookingEvent key={i} {...event} />
					)}
				</div>
			</div>
		</div>
	);

};

export default withStuff(Booking,
	{
		api: true,
		state: true,
		query: true,
		effect: ({ api, match, query }) => {
			if (query.type === 'host')
				api.setHosting(true, false);

			if (query.type === 'guest')
				api.setHosting(false, false);
			
			api.getBooking(match.params.id);
		},
		loader: 'bookings',
	}
);
