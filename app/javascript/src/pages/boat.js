import React, { useState, useEffect, Fragment } from 'react';
import { 
	ErrorBox, GoogleMap, RadioInput, 
	Gallery, DatePicker, Submit,
	Drawer, Reviews, BookmarkBtn,
	Select, QuestionModal,
} from '../components';
import { activities, lakeConfig, capitalize,
		 boatFeatures, boatRules,
		 cancellationPolicies, toUSD,
		 timeOptions, isWeekend, parseDateString,
		 listingType,
} from '../utils';
import { boatTypes } from '../params';
import { withStuff } from '../hocs';

const Boat = ({ match, api, state }) => {
	const [galleryIsOpen, setGalleryIsOpen] = useState(false);
	const [galleryIndex, setGalleryIndex] = useState(0);
	const [mobileDates, setMobileDates] = useState(false);
	const [duration, setDuration] = useState();
	const [marina, setMarina] = useState();

	useEffect(() => {
		if (state.date)
			api.getBoatTimes(state.boat.id, state.date);
	}, [ state.date ]);

	function openGallery(index=0) {
		return () => {
			setGalleryIsOpen(true);
			setGalleryIndex(index);
		};
	};

	const { boat } = state;
	const { user } = boat;

	async function createBooking() {
		if (state.date && duration && (boat.pro_hopper || marina)) {

			api.createBooking({
				duration_in_hours: duration,
				marina_id: marina,
				date: state.date,
				boat_id: boat.id,
			});

		} else {

			if (!state.date) {

				api.setError('bookings', 'Please select a date.');

			} else if (!duration) {

				api.setError('bookings', 'Please select a duration.');

			} else if (!boat.pro_hopper) {

				api.setError('bookings', 'Please select a location.');

			}
		};
	};

    const features = Object.keys(boat.features || {}).filter(key => boat.features[key] && !!boatFeatures[key]) // hack ?
                                               .map(key => boatFeatures[key])
                                               .concat(boat.extra_features || []);

	function timeRange(min, max) {
		if (min == max) {
			return `Start Times: ${timeOptions[min]}`;
		} else {
			return `Start Times: ${timeOptions[min]} - ${timeOptions[max]}`;
		};
	};

	function available(timeIncrements) {
		if (!state.date) {
			return timeIncrements.reduce((tis, inc) => {
				tis.push({ duration: inc });
				return tis;
			}, []);
		} else {
			return timeIncrements.reduce((tis, inc) => {
				const btms = state.boat_times[inc];
				if (btms && btms.length > 0)
					tis.push({
						duration: inc,
						min: Math.min(...btms),
						max: Math.max(...btms),
					});
				return tis;
			}, []);
		};
	};

	function timeSlots() {
		const timeIncrements = Object.keys(boat.time_increments).filter(key => boat.time_increments[key]);
		return available(timeIncrements).reduce((acc, { duration, min, max }) => {
			acc[duration] = () => (
				<div style={{width: '100%'}}>
					<div className="booking-time-increment flex-between" >
						<div className="subheader-heavy">{duration} Hours</div>
						<div className="subheader-heavy flex-grow text-right">{toUSD(boat.price * duration)}</div>
					</div>
					<div className="small-light greyPool" style={{marginTop: '10px'}} >
						{state.date ? timeRange(min, max) : 'Start Times: (Select Date)'}
					</div>
				</div>
			);
			return acc;
		}, {});
	};

	const BookingBox = ({ style }) => (
		<div style={style} >
			<div className="subheader-heavy" style={{marginBottom: '15px'}} >From {toUSD(boat.price)}<span className="subheader-light greyPool"> / hour</span></div>
			{!boat.pro_hopper &&
				<Select
					defaultValue={marina}
					onChange={({ target }) => setMarina(target.value)}
					options={boat.marinas.reduce((acc, marina) => {
						acc[marina.id] = `${marina.lake_name} - ${marina.name}`;
						return acc;
					}, {})}
					placeholder="Select a location"
					style={{ marginBottom: '15px'}}
				/>
			}
			<DatePicker 
				disabled={boat.dates}
				weekendsDisabled={!boat.available_weekends} 
				weekdaysDisabled={!boat.available_weekdays}
			>
				{({ date, setShow }) =>
					<div className='boat-date-picker flex-between pointer' onClick={() => setShow(true)}>
						<div className="caption-heavy">Date</div>
						<div className="caption-light">{date && parseDateString(date)}</div>
						<i className="far fa-calendar" />
					</div>
				}
			</DatePicker>
			<div style={{marginBottom: '15px'}} />
			<RadioInput
				options={timeSlots()}
				onChange={(v) => setDuration(v)}
				defaultValue={duration}
			/>
			<Submit
				loading={state.loading.create_booking}
				style={{width: '100%', marginTop: '30px'}}
				copy="Continue Booking"
				onClick={createBooking}
			/>
		</div>
	);

	return(
		<div id="boat" >
			<div className="mobile-boat-header mobile-flex-between subheader-heavy" onClick={() => window.history.back()} >
				<div className="flex">
					<i className="fal fa-angle-left" />
					<div >Search Results</div>
				</div>
				<BookmarkBtn id={boat.id} bookmarked={boat.bookmarked}>
					{bookmarked =>
						<i className={`${bookmarked ? 'fas' : 'far'} fa-heart primaryPool pointer`} style={{marginLeft: 'auto', fontSize: '18px'}} />
					}
				</BookmarkBtn>
			</div>
			<div className="mobile-footer-nav mobile-flex-between" style={{padding: '20px'}}>
				<div className="subheader-heavy" >{toUSD(boat.price)}<span className="subheader-light greyPool"> / hour</span></div>
				<button className="btn-primary" onClick={() => setMobileDates(true)} >Check Availability</button>
			</div>
			<Drawer
				from="bottom"
				style={{
					height: '550px', 
					overflowY: 'scroll', 
					borderRadius: '8px',
					border: '#EAEAEA 1px solid',
					padding: '30px',
				}}
				show={mobileDates}
				onClose={() => setMobileDates(false)}
			>
				<ErrorBox error={state.errors.bookings} />
				<BookingBox style={{marginBottom: '60px'}} />
			</Drawer>
			<div className="boat-show">
				<div className="non-mobile-only float-right">
					<BookmarkBtn id={boat.id} bookmarked={boat.bookmarked}>
						{bookmarked =>
							<div className="flex text-right pointer" style={{marginRight: '25px'}} >
								<i className={`${bookmarked ? 'fas' : 'far'} fa-heart primaryPool`} style={{fontSize: '18px', marginRight: '10px'}} />
								<div className="subheady-heavy">{bookmarked ? 'Saved' : 'Save Listing'}</div>
							</div>
						}
					</BookmarkBtn>
				</div>
				<div className="boat-photos non-mobile-boat-pad">
					<div className="cover-photo boat-photo">
						<img src={boat.cover_photo} onClick={openGallery(0)} />
					</div>
					<div className="preview-photos">
						<div className="preview-photo boat-photo non-mobile-only">
							<img src={boat.preview_photo_1} onClick={openGallery(1)} />
						</div>
						<div className="preview-photo boat-photo non-mobile-only">
							<img src={boat.preview_photo_2} onClick={openGallery(2)} />
						</div>
					</div>
					<div className="gallery-btn non-mobile-only" onClick={openGallery(3)}>
			            +{boat.misc_photos.length ? boat.misc_photos.length - 1 : 0}
			        </div>
	        		<div className="gallery-btn mobile-only" onClick={openGallery(0)}>
	                    1 / {boat.misc_photos.length + 3}
	                </div>
                    <Gallery
                        photos={[
                            boat.cover_photo,
                            boat.preview_photo_1,
                            boat.preview_photo_2,
                        ].concat(boat.misc_photos)}
                        open={galleryIsOpen}
                        index={galleryIndex}
                        onClose={() => setGalleryIsOpen(false)}
                    />
				</div>
				<div className="text-right">
					<ErrorBox error={state.errors.bookings} />
				</div>
				<div className="flex-start boat-pad">
					<div>
						<h2>{boat.title}</h2>
						<div style={{marginTop: '10px'}} className="subheader-heavy">{listingType(boat)}</div>
						<h2>Locations</h2>
						{
							boat.pro_hopper

							?	<div className="subheader-heavy" style={{marginTop: '10px'}} >TBD</div>

							: 	boat.marinas.map((marina, i) =>
									<div className="subheader-heavy" style={{marginTop: '10px'}} key={i}>{marina.name}, {marina.lake_name}, {marina.city}, {marina.state}</div>
								)
						}
						<div className="subheader-heavy" style={{marginBottom: '20px', marginTop: '40px'}} >Overview</div>
						<div className="caption-light greyPool">{boat.description}</div>
						<div className="host-info" style={{marginTop: '40px'}} >
							<img className="host-avatar" src={user.profile_picture_url} />
							<div>
								<div className="subheader-heavy">Meet your Host, {user.first_name}</div>
								<div className="subheader-light greyPool">{user.headline}</div>
							</div>
						</div>
						<div className="caption-light greyPool" style={{marginTop: '20px'}} >{user.story}</div>
						{!boat.pro_hopper &&
							<Fragment>
								<div className="subheader-heavy" style={{marginTop: '40px'}}>Boat Details</div>
								<div style={{maxWidth: '600px'}}>
									<div className="flex-between">
										<div style={{padding: '16px 0px', width: '33%'}} >
											<div className="caption-light greyPool">Year</div>
											<div className="body-heavy">{boat.year}</div>
										</div>
										<div style={{padding: '16px 0px', width: '33%'}} >
											<div className="caption-light greyPool">Length</div>
											<div className="body-heavy">{boat.length} ft.</div>
										</div>
										<div style={{padding: '16px 0px', width: '33%'}} >
											<div className="caption-light greyPool">Capacity</div>
											<div className="body-heavy">Up to {boat.guest_count} people</div>
										</div>
									</div>
									<div className="flex-between">
										<div style={{padding: '16px 0px', width: '33%'}} >
											<div className="caption-light greyPool">Make</div>
											<div className="body-heavy">{boat.make}</div>
										</div>
										<div style={{padding: '16px 0px', width: '33%'}} >
											<div className="caption-light greyPool">Model</div>
											<div className="body-heavy">{boat.model}</div>
										</div>
										<div style={{padding: '16px 0px', width: '33%'}} >
											<div className="caption-light greyPool">Boat Type</div>
											<div className="body-heavy">{boatTypes[boat.boat_type]}</div>
										</div>
									</div>
								</div>
							</Fragment>
						}
					</div>
					<div style={{height: '100%', marginLeft: '50px'}} className="non-mobile-only">
						<QuestionModal>
							{({ displayQuestionModal }) =>
								<div className="text-center">
									<button onClick={() => {										
										displayQuestionModal();
									}} className="btn-secondary-teal">
										{boat.pro_hopper ? 'Ask this pro a question' : 'Have a question about this boat?'}
									</button>
								</div>
							}
						</QuestionModal>
						<div className="booking-box">
							<BookingBox />
						</div>
					</div>
				</div>
				<div style={{maxWidth: '600px'}} className="boat-pad" >
					<div className="subheader-heavy" style={{marginTop: '40px', marginBottom: '20px'}}>Activities</div>
					<div className="row"  style={{maxWidth: '600px'}}>
						{Object.keys(boat.activities).filter(key => boat.activities[key] && !activities[key].hideOnFilter).map((key, i) =>
							<div key={i} className="col-md-4 col-sm-6 col-6">
								<div className="flex">
									{activities[key].icon()}
									<div style={{marginLeft: '15px'}}>{activities[key].title}</div>
								</div>
								<div style={{marginTop: '10px'}}>
									{Object.keys(boat.sub_activities[key]).filter(kk => boat.sub_activities[key][kk]).map((kk, i) =>
										<div key={i} className="body-light greyPool" style={{marginTop: '4px'}} >{activities[key].checkboxes[kk]}</div>
									)}
								</div>
							</div>
						)}
					</div>
					{!boat.pro_hopper &&
						<Fragment>
							<div className="subheader-heavy" style={{marginTop: '40px', marginBottom: '20px'}} >Boat Features</div>
							<div className="row"  style={{flexWrap: 'wrap'}}>
								{features.map((v, i) =>
									<div key={i} className="flex col-md-4 col-sm-6 col-6" style={{paddingBottom: '25px'}} >
										<i className="fas fa-clipboard-check greyPool" />
										<div style={{marginLeft: '20px'}}>{v}</div>
									</div>
								)}
							</div>
							<div className="subheader-heavy" style={{marginTop: '40px', marginBottom: '20px'}} >Boat Rules</div>
							<div className="row" >
								{Object.keys(boat.rules).filter(k => !!boatRules[k]).sort((a, b) => boat.rules[a] === boat.rules[b] ? 0 : boat.rules[a] ? -1 : 1).map((key, i) =>
									<div key={i} className="flex col-md-4 col-sm-6 col-6" style={{paddingBottom: '25px'}}>
										{
											boat.rules[key]

											?	<i className="fas fa-check-circle" style={{color: '#86EFAC'}} />

											: 	<i className="fas fa-times-circle redPool" />
										}
										<div style={{marginLeft: '20px'}}>{boatRules[key]}</div>
									</div>
								)}
			                    {Object.keys(boat.extra_rules).map((key, i) =>
			                        <div key={i} className="flex col-md-4 col-sm-6 col-6" style={{paddingBottom: '25px'}}>
			                            {
			                                boat.extra_rules[key]

			                                ?   <i className="fas fa-check-circle" style={{color: '#86EFAC'}} />

			                                :   <i className="fas fa-times-circle redPool" />
			                            }
			                            <div style={{marginLeft: '20px'}}>{key}</div>
			                        </div>
			                    )}
			            	</div>
			            </Fragment>
			        }
					<div className="subheader-heavy" style={{marginTop: '40px', marginBottom: '20px'}} >Cancellation Policy</div>
					{
						!!boat.custom_cancellation_policy

						? 	<div className="caption-light greyPool">
								This boat contains a custom cancellation policy:
								<br/><br/>
								{boat.custom_cancellation_policy}
							</div>

						: 	<div className="caption-light greyPool">
								All bookings abide by our Lake Hop cancellation policy:
								<ul>
									<li>If a guest makes a cancellation before 24 hours of the booking start time, they are granted a full refund for the trip.</li>
									<li>If a guest makes a cancellation within 24 hours of the booking start time, they are granted a partial refund of 50% for the trip.</li>
									<li>If a host makes a cancellation, the guest is always given a full refund.</li>
								</ul>
							</div>
					}
					{
						!boat.pro_hopper

						&& 	<Fragment>
								<div className="subheader-heavy" style={{marginTop: '40px', marginBottom: '20px'}} >Security Deposit</div>
								<div className="caption-light greyPool">A security deposit hold (not a charge) will be placed on your credit card 48 hours before your booking starts to cover any incidental damage that may occur during your rental. This hold is released 48 hours after the booking is complete, if no claims are made. The security deposit amount for the boat you are booking will be outlined during the check-out process.</div>
							</Fragment>
					}
					<div className="subheader-heavy" style={{marginTop: '40px', marginBottom: '20px'}} >
						{boat.review_meta.rating} ({boat.review_meta.count} review{boat.review_meta.count == 1 ? '' : 's'})
					</div>
					<Reviews reviews={boat.reviews} />
					<div className="mobile-only" style={{marginTop: '40px'}}>
						<QuestionModal>
							{({ displayQuestionModal }) =>
								<button onClick={() => {
									displayQuestionModal();
								}} className="btn-secondary-teal">Have a question about this boat?</button>
							}
						</QuestionModal>
					</div>
				</div>
			</div>
            <div style={{marginTop: '50px'}} />
		</div>
	);
};

export default withStuff(Boat, 
	{
		state: true, 
		api: true,
		effect: ({ state, api, match }) => api.getBoat(match.params.id),
		loader: 'boats',
	}
);
