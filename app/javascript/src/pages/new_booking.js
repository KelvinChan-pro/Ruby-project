import React, { useEffect, useRef, useState, Fragment } from 'react';
import { 
	ErrorBox, Select, SimpleForm, 
	Submit, PaymentForm, CheckInput,
	CheckboxList, Inputs,
} from '../components';
import { 
	fancyTimeOptions, isWeekend, activities, 
	parseDateString, bookingStatus, toUSD,
} from '../utils';
import { withStuff } from '../hocs';
import { guestBoatParams, guestLocationParams } from '../params';

const NewBooking = ({ api, state }) => {
	const { booking, boat, user, discount } = state;
	const bookingSubmit = useRef();
	const paymentSubmit = useRef();
	const [filet, setFilet] = useState(false);
	const [media, setMedia] = useState(false);
	const guestBoat = (state.boats || []).find(boat => !boat.pro_hopper) || {};
	const guestLocation = guestBoat.locations && guestBoat.locations[0];

	useEffect(() => {
		if (booking && booking.status === bookingStatus.requested) 
			window.location.href = `/bookings/${booking.id}`;
	}, [ booking ]);

	useEffect(() => {
		api.getBoatTimes(boat.id, booking.date);
	}, [ booking.duration_in_hours ]);


	function subtotal() {
		return booking.amount + (filet ? boat.filet_package_price : 0) + (media ? boat.media_package_price : 0);
	};

	function serviceFee() {
		return subtotal() * 0.1;
	};

	function discountAmount() {
		if (discount.amount) {
			return discount.amount * -1;
		} else if (discount.percentage) {
			return subtotal() * discount.percentage * -1;
		} else {
			return 0;
		};
	};

	function total() {
		return subtotal() + serviceFee() + discountAmount();
	};

	function startTimeOptions() {
		if (state.boat_times[booking.duration_in_hours]) {
			return Object.keys(fancyTimeOptions).reduce((acc, key) => {
				if (state.boat_times[booking.duration_in_hours].includes(parseInt(key)))
					acc[key] = fancyTimeOptions[key];
				return acc;
			}, {});
		} else {
			return {};
		}
	};

	function guestOptions() {
		return Array.from(Array(boat.guest_count), (_, index) => index + 1);
	};

	async function handleSubmit(params) {

		if (params.confirm !== "1") {
			api.setError('update_booking', 'Please confirm you have read our Terms of Service and Privacy Policy.')
			return;
		};

		if (!boat.rental && !boat.pro_hopper && params.assign !== "1") {
			api.setError('update_booking', 'Please assign your boat host as the designated driver during your booked trip.')
			return;
		};

		// change booking date to include start time
		if (params.start_time) {
			const nd = new Date(booking.date_string);
			nd.setHours(params.start_time);
			params.date = nd;
		};

		params.filet_package = params.filet_package == '1';
		params.media_package = params.media_package == '1';

		if (boat.pro_hopper) {
			params.guest_location_attributes = {
				lake_name: params.lake_name,
				address: params.address,
				city: params.city,
				state: params.state,
				zip: params.zip,
			};

			params.guest_boat_attributes = {
				boat_type: params.boat_type,
				make: params.make,
				model: params.model,
				year: params.year,
				length: params.length,
			};
		};

		const res = await api.updateBooking(booking.id, {
			...params,
			status: bookingStatus.payment_required,
		});

		if (res)
			paymentSubmit.current.click();
	};

	async function handlePaymentSubmit({ paymentIntent }) {
		const res = await api.updateBooking(booking.id, {
			status: bookingStatus.requested,
		});
		if (res)
			window.location.href = `/bookings/${booking.id}`;
	};
	
	return(
		<div className="new-booking container" style={{margin: '50px auto'}} >
			<div className="text-center">
				<h2>Confirm & Pay</h2>
				<div className="subheader-light greyPool">Confirm your Booking</div>
			</div>
			<div className="row">
				<div className="col-md-4 col-sm-12">
					<div className="card booking-left">
						<img className="booking-cover-photo" src={boat.cover_photo} />
						<div className="title-small" style={{margin: '20px 0px'}} >{boat.title}</div>
						<div className="booking-payment-info">
							<div className="subheader-heavy">Payment</div>
							<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
								<div>
									{toUSD(boat.price)} x {booking.duration_in_hours} Hours
								</div>
								<div>
									{toUSD(booking.amount)}
								</div>
							</div>
							{
								filet

								&&	<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
										<div>Filet/Clean Fish Package</div>
										<div>${boat.filet_package_price}</div>
									</div>
							}
							{
								media

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
									{toUSD(subtotal())}
								</div>
							</div>
							{
								!boat.pro_hopper &&
									<Fragment>
										<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
											<div>Security Deposit</div>
											<div>{toUSD(booking.security_deposit)}</div>
										</div>
										<div className="body-light greyPool text-right">
											*Placing hold on {booking.security_deposit_date}
										</div>
										<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
											<div>Fuel</div>
											<div>Included</div>
										</div>
										<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
											<div>Captain</div>
											<div>Included</div>
										</div>
										<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
											<div>Insurance</div>
											<div>Included</div>
										</div>
									</Fragment>
							}
							<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
								<div>Service Fee</div>
								<div>{toUSD(serviceFee())}</div>
							</div>
							{
								!!discount.code

								&&	<div className="flex-between body-light greyPool" style={{marginTop: '20px'}}>
										<div>{discount.code} Discount ({discount.string})</div>
										<div>{toUSD(discountAmount())}</div>
									</div>
							}
						</div>
						<div className="booking-payment-info">
							<div className="flex-between subheader-heavy" >
								<div>
									Total Due
								</div>
								<div>
									{toUSD(total())}
								</div>
							</div>
							<div className="body-light greyPool" style={{marginTop: '5px'}} >(When booking is approved)</div>
						</div>
					</div>
				</div>
				<div className="col-md-8 col-sm-12 booking-right">
					<div style={{marginTop: '30px'}} className="title-small">Your Experience</div>
					<div className="subheader-heavy" style={{marginTop: '15px'}} >Date</div>
					<div className="subheader-light greyPool">{parseDateString(booking.date_string)}</div>
					{
						!boat.pro_hopper

						&&	<Fragment>
								<div className="subheader-heavy" style={{marginTop: '15px'}} >Location</div>
								<div className="subheader-light greyPool">{booking.marina.lake_name} - {booking.marina.name}</div>
							</Fragment>
					}
					<SimpleForm onSubmit={handleSubmit} >
						<div className="non-mobile-flex-between" style={{marginTop: '15px'}}>
							<div className="input-primary" style={{width: '100%', paddingRight: '20px'}}>
								<label>Start Time</label>
								<Select
									name="start_time"
									defaultValue={booking.start_time}
									options={startTimeOptions()}
								/>
							</div>
							{
								!boat.pro_hopper &&
									<div className="input-primary" style={{width: '100%', paddingRight: '20px'}}>
										<label>Number of Guests</label>
										<Select
											name="number_of_guests"
											defaultValue={booking.number_of_guests}
											options={guestOptions()}
										/>
									</div>
							}
						</div>
						{
							boat.filet_package || boat.media_package

							? 	<div>
									<div style={{marginTop: '30px'}} className="title-small">Packages</div>
									<div className="row">
										{boat.filet_package && <div className="col-sm-6">
											<CheckInput
												style={{marginTop: '10px'}}
												name="filet_package"
												copy={`Filet/Clean Fish Package | $${boat.filet_package_price}`}
												onChange={(v) => setFilet(v)}
											/>
										</div>}
										{boat.media_package && <div className="col-sm-6">
											<CheckInput
												style={{marginTop: '10px'}}
												name="media_package"
												copy={`Photo/Video Package | $${boat.media_package_price}`}
												onChange={(v) => setMedia(v)}
											/>
										</div>}
									</div>
								</div>

							: 	null
						}
						<div style={{marginTop: '15px'}} className="subheader-light greyPool">Write a short message explaining your goal for the trip, whether it’s a specific activity or something you’d like to learn. This is important for the host to make the right preparations to make this trip great!</div>
						<div style={{marginTop: '15px'}} className="subheader-light greyPool">As a reminder, your host provides these activities:</div>
						<div className="row" style={{margin: '15px 0px'}} >
							{Object.keys(boat.activities).filter(key => boat.activities[key]).map((key, i) =>
								<div key={i} className="flex col-md-4 col-sm-6 col-6">
									{activities[key].icon()}
									<div style={{marginLeft: '15px'}}>{activities[key].title}</div>
								</div>
							)}
						</div>
						<div style={{marginTop: '30px'}} className="title-small">Your goal for the Trip</div>
						<div className="input-primary">
							<textarea
								name="goal_for_trip"
								type="text"
								defaultValue={booking.goal_for_trip}
								placeholder="Start writing here..."
								row="5"
							/>
						</div>
						<input type="submit" style={{display: 'none'}} ref={bookingSubmit} />
						{
							boat.pro_hopper

							?	<div style={{marginBottom: '30px'}} />

							:	<Fragment>
									<div className="subheader-heavy" style={{marginTop: '15px'}} >Security Deposit</div>
									<div className="body-light greyPool" style={{marginTop: '5px', marginBottom: '25px'}} >If confirmed, a hold of {toUSD(booking.security_deposit)} will be placed on your card 48 hours before the experience.</div>
								</Fragment>
						}
						{
							boat.pro_hopper &&

								<Fragment>
									<div style={{marginTop: '30px'}} className="title-small">Your Boat</div>
									<Inputs
										inputs={guestBoatParams(guestBoat)}
									/>
									<div style={{marginTop: '30px'}} className="title-small">Your Location</div>
									<Inputs
										inputs={guestLocationParams(guestLocation)}
									/>
								</Fragment>
						}
						<div style={{marginTop: '30px'}} className="title-small">Things to know</div>
						{
							!boat.pro_hopper &&

								<Fragment>
									<div className="subheader-heavy" style={{marginTop: '15px'}} >Guest Requirements</div>
									<div className="body-light greyPool" style={{marginTop: '5px'}} >Up to {boat.guest_count} guests can attend.</div>
								</Fragment>
						}
						<div className="subheader-heavy" style={{marginTop: '15px'}} >Cancellation Policy</div>
						<div className="body-light greyPool" style={{marginTop: '5px', marginBottom: '20px '}} >If confirmed, you are able to cancel for a full refund up to 24 hours before the experience.</div>
						<div style={{marginTop: '20px'}} />
						<div style={{marginTop: '30px'}} className="title-small">Discount</div>
						<div className="subheader-light greyPool" style={{margin: '15px 0px'}} >Enter a discount code if you have one.</div>
						<div className="input-primary">
							<input
								name="discount_code"
								type="text"
								placeholder="Enter discount code"
								onChange={({ target }) => {
									api.getDiscount(target.value);
								}}
							/>
							{discount.missing && <div style={{marginTop: '10px', marginBottom: '-15px'}} className="subheader-light greyPool">No discount found with that code.</div>}
							{discount.code && <div style={{marginTop: '10px', marginBottom: '-15px'}} className="subheader-light greyPool">{discount.code} discount: {discount.string} off</div>}
						</div>
						<CheckInput name="confirm" style={{marginTop: '25px'}} >
							<div className="body-light greyPool">
								I confirm that I have read and accept the <a href="/terms_of_service">Lake Hop Terms of Service</a> and <a href="/privacy_policy">Privacy Policy</a>.
							</div>
						</CheckInput>
						{!boat.rental && !boat.pro_hopper &&
							<CheckInput name="assign" style={{marginTop: '15px'}}>
								<div className="body-light greyPool">
									I assign {booking.host.full_name} as the designated boat operator during my booked trip.
								</div>
							</CheckInput>
						}
					</SimpleForm>
					<div style={{marginTop: '30px'}} className="title-small">Pay with</div>
					<div className="subheader-light greyPool" style={{margin: '15px 0px'}} >A hold will be placed on your card. Once the host confirms, you will be charged in full.</div>
					<PaymentForm 
						clientSecret={booking.client_secret}
						_ref_={paymentSubmit}
						onSubmit={handlePaymentSubmit}
						paymentMethods={user.payment_methods}
					/>
					<ErrorBox error={state.errors.update_booking} />
					<Submit
						loading={state.loading.update_booking || state.loading.payment_form}
						copy="Confirm and Pay"
						style={{ marginTop: '20px' }}
						onClick={() => bookingSubmit.current.click()}
					/>
				</div>
			</div>
		</div>
	);
};

export default withStuff(NewBooking,
    {
        api: true, state: true,
        effect: ({ api, match }) => {
        	api.getBooking(match.params.id);
        	api.setHosting(false, false);
        	api.getBoats();
        },
        loader: 'bookings',
    }
);