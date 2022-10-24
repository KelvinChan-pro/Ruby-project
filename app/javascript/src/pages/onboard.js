import React, { useState, useRef, useEffect } from 'react';
import Logo from '../assets/logo.png';
import {
	Submit, Inputs, ErrorBox, Select,
	InsuranceUpload, RadioInput, ImageUpload,
	ActivityChecks, CheckboxList,
	DatePicker, BoatFeatures, BoatRules,
	BoatPricing, BoatPhotos, 
	VerifyIdentity, Availability,
    BoatLocations, CheckInput, Drawer,
} from '../components';
import { states, parseActivities, lakeConfig } from '../utils';
import { useStripe } from '@stripe/react-stripe-js';
import {
	specificationsParams, locationParams,
	externalAccountParams,
	identityParams, addressParams,
} from '../params';
import { withStuff } from '../hocs';
import SignaturePad from 'react-signature-pad-wrapper';

const Onboard = ({ state, api }) => {
	const stripe = useStripe();
    const [pageHeight, setPageHeight] = useState(window.innerHeight);
    const form = useRef();
    const name = useRef();
    const signature = useRef();
    const [showSideNav, setShowSideNav] = useState(false);
    const [currentStep, setStep] = useState(state.user.onboard_step);
    const [currentSubStep, setSubStep] = useState(state.user.onboard_sub_step);
    const completedCount = Object.keys(state.user.onboard_metadata || {}).length;
    const progress = `${(completedCount / stepCount) * 100}%`;
    const { boat, user } = state;
    const gift = user.gift || {};
    const [hearAboutUs, setHearAboutUs] = useState();

    useEffect(() => {
		window.onresize = () => {
	        setPageHeight(window.innerHeight);
	    };
    }, []);
    
    const steps = [
    	{
	    	name: 'Boat Basics',
	    	startCount: 1,
	    	boatOnly: true,
	    	steps: [
	    		{
	    			name: 'Boat Information',
	    			key: 'specifications',
	    			onSubmit: (params) => boat.id
    									? 	api.updateBoat(boat.id, params)
    									: 	api.createBoat(params),
	    			apiKey: boat.id ? 'update_boat' : 'create_boat',
	    			firstStep: true,
	    			completed: state.user.onboard_metadata['specifications'],
	    			inputs: (i) => (
	    				<div key={i} >
	    					<div className="title-small" style={{margin: '20px 0px 10px 0px'}}>First, tell us some specifications about your boat.</div>
	    					<Inputs inputs={specificationsParams(boat)} style={{margin: '0px'}} />
	    				</div>
	    			),
	    		},
	    		{
	    			name: 'Location',
	    			key: 'location',
	    			lastStep: true,
	    			onSubmit: async (params) => {
                    	const np = Object.keys(params).reduce((acc, key) => {
                       		const [a, b] = key.split('.');
                       		if (a === 'marina')
                       			acc[parseInt(b)] = params[key];
                       		return acc;
                       	}, []);

                       if (params.new_marina) {
                       		const marinaId = await api.createMarina(params, boat.id);
                       		if (marinaId) {
								np[parseInt(params.index)] = marinaId;
							} else {
								return false;
							}
                       };


                       if (np.length === 0 || np[0] === "") {
                       		api.setError('update_boat', 'You must add at least one boat location to continue.');
                       		return;
                       };

                       return await api.updateBoatLocations(boat.id, np.filter(Boolean));
                    },
	    			apiKey: 'update_boat',
	    			completed: user.onboard_metadata['location'],
	    			inputs: (i) => <BoatLocations key={i} />,
	    		},
	    	],
	    },
	    {
	    	name: 'Host Information',
	    	steps: [
	    		{
	    			name: 'About You',
	    			key: 'about_you',
	    			apiKey: 'update_user',
	    			proHopper: true,
	    			completed: user.onboard_metadata['about_you'],
	    			firstStep: true,
	    			lastStep: true,
	    			onSubmit: (params) => {
	    				if (!!user.profile_picture_url) {

	    					return api.updateUser(user.id, params);
	    					
	    				} else {

	    					api.setError('update_user', 'Your profile photo is required. You can edit this later.');

	    				}
	    			},
	    			inputs: (i) => (
	    				<div key={i} >
	    					<div className="title-small" style={{margin: '20px 0px 10px 0px'}}>Your Full Name</div>
	    					<Inputs
	    						inputs={[
	    							{
	    								label: 'First Name',
	    								name: 'first_name',
	    								type: 'text',
	    								defaultValue: user.first_name,
	    								col: '6'
	    							},
	    							{
	    								label: 'Last Name',
	    								name: 'last_name',
	    								type: 'text',
	    								defaultValue: user.last_name,
	    								col: '6'
	    							},
	    						]}
	    					/>
							<div className="title-small" style={{margin: '20px 0px 10px 0px'}}>Your Profile Photo</div>
							<ImageUpload
								defaultValue={user.profile_picture_url}
								imageClass="big-prof-p"
								edit={true}
								type='profile_picture'
								onRequestUpload={(image) => api.updateProfilePicture(user.id, image)}
								width={200}
								height={200}
								borderRadius={500}
							/>
							<div className="title-small" style={{margin: '20px 0px 10px 0px'}}>Your Story</div>
							<div className="body-light greyPool">What makes you uniquely qualified to host this experience? Tell guests why you’re passionate and knowledgeable about the subject matter.</div>
							<div className="input-primary">
								<textarea
									name="story"
									placeholder="Have you been doing this for years? Are you from the area? Don’t be afraid to brag!"
									rows="9"
									defaultValue={user.story}
								/>
							</div>
                            <div className="title-small" style={{margin: '20px 0px 10px 0px'}}>Your Headline</div>
                            <div className="body-light greyPool">Write a short headline describing yourself that will appear under your name for your listing. You can choose to highlight your experience with any activities, the boat, or with the area you’re hosting in.</div>
                            <br/>
                            <div className="body-light greyPool">Some examples: Fly fisherman since 2003, Sailing on Lake Cumberland since 2008, Grew up on Lake Cumberland</div>
                            <div className="input-primary">
                                <input
                                    name="headline"
                                    defaultValue={user.headline}
                                    placeholder="Start writing here..."
                                    onKeyUp={(e) => {
                                        if (e.key === 'Enter') e.preventDefault();
                                    }}
                                />
                            </div>
                            {/*<div className="title-small" style={{margin: '20px 0px 10px 0px'}}>Do you have a Captain’s License? (Optional)</div>
                            <div className="subheader-light">If you’d like to provide proof of your Captain’s License, enter the number here:</div>
                            <div className="input-primary">
                                <input
                                    name="license_number"
                                    defaultValue={user.license_number}
                                    placeholder="Enter Captain’s License Number"
                                    onKeyUp={(e) => {
                                        if (e.key === 'Enter') e.preventDefault();
                                    }}
                                />
                            </div>*/}
	    				</div>
	    			),
	    		}
	    	],
	    },
	    {
	    	name: 'Listing Page',
	    	startCount: 3,
	    	boatOnly: true,
	    	steps: [
	    		{
	    			name: 'Overview',
	    			key: 'experience_overview',
	    			apiKey: boat.id ? 'update_boat' : 'create_boat',
	    			proHopper: true,
	    			completed: user.onboard_metadata['experience_overview'],
	    			firstStep: true,
	    			onSubmit: async (params) => {
	    				if (params.description.length === 0 || params.title.length === 0) {
	    					api.setError('update_boat', 'Description and Title are required.');
	    					return false;
	    				};
	    				if (params.description.length > 500) {
	    					api.setError('update_boat', 'Description cannot exceed 500 characters.');
	    					return false;
	    				};
	    				if (params.title.length > 50) {
	    					api.setError('update_boat', 'Title cannot exceed 50 characters.');
	    					return false;
	    				};
	    				
    					if (boat.id) {
    						return api.updateBoat(boat.id, params);
    					} else {
    						params.pro_hopper = true;
    						return api.createBoat(params);
    					}
	    			},
	    			inputs: (i) => (
	    				<div key={i} >
	    					<div className="title-small" style={{margin: '20px 0px 10px 0px'}}>Create a title for your listing</div>
							<div className="body-light greyPool">Catch guests’ attention with a listing title that highlights what makes your experience special.</div>
							<div className="input-primary">
								<input
									name="title"
									defaultValue={boat.title}
									placeholder="Start writing here..."
								/>
							</div>
	    					<div className="title-small" style={{margin: '20px 0px 10px 0px'}}>
	    						{
	    							boat.pro_hopper

	    							?	'Describe the experience you’d like to offer to guests'
	    							
	    							: 	'Describe your boat and the experience you’d like to offer to guests'
	    						}
	    					</div>
							<div className="body-light greyPool">
								{
									boat.pro_hopper

									? 	'Mention the best aspects of your experience or what guests can do with you that makes your listing unique.'

									: 	'Mention the best features of your boat, any special amenities, or what guests can do on your boat that make it unique.'
								}
							</div>
							<div className="input-primary">
								<textarea
									name="description"
									placeholder="Start writing here..."
									rows="9"
									defaultValue={boat.description}
								/>
							</div>
	    				</div>
	    			),
	    		},
	    		{
	    			name: 'Activities',
	    			key: 'activities',
	    			apiKey: 'update_boat',
	    			proHopper: true,
	    			completed: user.onboard_metadata['activities'],
	    			onSubmit: (params) => api.updateBoat(boat.id, parseActivities(params)),
	    			inputs: (i) => (
	    				<div key={i} >
	    					<div className="title-small" style={{margin: '20px 0px 20px 0px'}}>What types of activites does this experience offer?</div>
	    					<ActivityChecks
	    						defaultChecked={boat.activities}
	    						sub_activities={boat.sub_activities}
	    						pro_hopper={boat.pro_hopper}
	    					/>
	    				</div>
	    			),
	    		},
	    		{
	    			name: 'Boat Features',
	    			key: 'boat_features',
	    			apiKey: 'update_boat',
	    			completed: user.onboard_metadata['boat_features'],
	    			onSubmit: async (params) => {
	    				const np = { features: {} };
	    				Object.keys(params).forEach(key => {
	    					const [a, b] = key.split('.');
                            if (b) {
	    					  np[a][b] = params[key] === '1';
                            } else {
                                np[a] = params[key];
                            }
	    				});
	    				return await api.updateBoat(boat.id, np);
	    			},
	    			inputs: (i) => (
	    				<div key={i} >
	    					<div className="title-small" style={{margin: '20px 0px 5px 0px'}}>Tell us more about what guests can use on your boat.</div>
	    					<div className="body-light greyPool" style={{marginBottom: '15px'}} >Select the features that your boat offers.</div>
	    					<BoatFeatures {...boat} />
	    				</div>
	    			),
	    		},
	    		{
	    			name: 'Boat Rules',
	    			key: 'boat_rules',
	    			apiKey: 'update_boat',
	    			completed: user.onboard_metadata['boat_rules'],
	    			onSubmit: async (params) => {
	    				const rules = {};
	    				Object.keys(params).forEach(key => {
                            if (key !== 'extra_rules') {
	    				       rules[key] = params[key] === "1";
                            }
	    				});
                        const extra_rules = JSON.parse(params.extra_rules);

	    				return await api.updateBoat(boat.id, { rules, extra_rules });
	    			},
	    			inputs: (i) => (
	    				<div key={i} >
	    					<div className="title-small" style={{margin: '20px 0px 5px 0px'}}>Tell us more about your boat’s rules.</div>
	    					<div className="body-light greyPool" style={{marginBottom: '15px'}}>Click on an option to toggle between allowed / not allowed.</div>
	    					<div className="subheader-heavy">Boat Rules</div>
	    					<BoatRules {...boat} />
	    				</div>
	    			),
	    		},
	    		{
	    			name: 'Guests should bring',
	    			key: 'guests_should_bring',
	    			apiKey: 'update_boat',
	    			proHopper: true,
	    			completed: user.onboard_metadata['guests_should_bring'],
	    			onSubmit: (params) => api.updateBoat(boat.id, params),
	    			inputs: (i) => (
	    				<div key={i} >
	    					<div className="title-small" style={{margin: '20px 0px 5px 0px'}}>What should guests bring?</div>
	    					<div className="input-primary">
	    						<textarea
	    							name="guests_should_bring"
	    							defaultValue={boat.guests_should_bring}
	    							placeholder="If guests need anything in order to enjoy your experience, this is the place to tell them. This list will be emailed to guests when they book your experience to help them prepare."
	    							rows="9"
	    						/>
	    					</div>
	    				</div>
	    			),
	    		},
	    		{
	    			name: 'Pricing',
	    			key: 'pricing',
	    			apiKey: 'update_boat',
	    			proHopper: true,
	    			completed: user.onboard_metadata['pricing'],
	    			onSubmit: (params) => {
	    				const np = { time_increments: {} };
	    				Object.keys(params).forEach(key => {
	    					const [a, b] = key.split('.');
	    					if (a === 'time_increments') {
	    						np.time_increments[b] = params[key] == "1";
	    					} else {
	    						np[a] = params[key];
	    					};
	    				});

	    				if (!np.price) {
	    					api.setError('update_boat', 'Please enter a price to continue.');
	    					return;
	    				};

	    				if (Object.keys(np.time_increments).filter(key => np.time_increments[key]).length === 0) {
	    					api.setError('update_boat', 'Please select at least one time increment to continue.');
	    					return;
	    				};

	    				return api.updateBoat(boat.id, np);
	    			},
	    			inputs: (i) => <BoatPricing key={i} {...boat} />,
	    		},
	    		{
	    			name: 'Availability',
	    			key: 'availability',
	    			apiKey: 'update_user',
	    			proHopper: true,
	    			completed: user.onboard_metadata['availability'],
	    			onSubmit: async (params) => {
                        params.available_weekdays = params.available_weekdays == "1";
                        params.available_weekends = params.available_weekends == "1";
                        params.dates = params.dates.split(',');
                        params.pro_hopper = boat.pro_hopper;
	    				return api.updateBoatDates(user.id, params);
	    			},
	    			inputs: (i) => (
    					<div key={i} >
	    					<div className="title-small" style={{margin: '20px 0px 5px 0px'}}>Set your availability</div>
	    					<div className="body-light greyPool" style={{marginBottom: '15px'}}>
	    						Editing your calendar is easy-- select your default availabilities below and set the time windows for each. If you’d like to block certain days or months, you can do so by clicking on the day or month in the calendar.
	    						<br/><br/>
	    						As a default, bookings cannot be made over a year in advance, so you’re calendar will be blocked out past then.
	    						<br/><br/>
	    						You can always make changes after you publish.
	    					</div>
	    					<div className="legend" style={{marginBottom: '15px'}} >
		    					<div className="flex">
		    						<div className="calendar-day body-light">
		    							1
		    						</div>
		    						<div className="body-light greyPool">Available</div>
		    					</div>
		    					<div className="flex">
		    						<div className="calendar-day body-light selected-cd">
		    							1
		    							<div className="cd-slash" />
		    						</div>
		    						<div className="body-light greyPool">Blocked</div>
		    					</div>
		    				</div>
                            <Availability
                            	user={user}
                            	proHopper={boat.pro_hopper}
                            />
	    				</div>
		    		),
	    		},
	    		{
	    			name: 'Photos',
	    			key: 'photos',
	    			apiKey: 'update_boat',
	    			lastStep: true,
	    			proHopper: true,
	    			completed: user.onboard_metadata['photos'],
	    			onSubmit: () => {
	    				if (boat.cover_photo && boat.preview_photo_1 && boat.preview_photo_2) {

	    					return true;

	    				} else {

	    					api.setError('update_boat', 'You must upload a cover photo and two preview photos to continue.');

	    					return false;
	    				}
	    			},
	    			inputs: () => <BoatPhotos />,
	    		},
	    	]
	    },
	    {
	    	name: 'Payment',
	    	steps: [
	    		{
	    			name: 'Personal information',
	    			key: 'identity_information',
	    			apiKey: 'update_user',
	    			proHopper: true,
	    			firstStep: true,
	    			completed: user.onboard_metadata['identity_information'],
	    			onSubmit: (params) => api.updateUser(user.id, params, false, true),
	    			inputs: (i) => (
	    				<div key={i} >
                            <div className="title-small">Personal information</div>
                            <div className="body-light greyPool" style={{marginTop: '10px'}} >We ask for the following information for tax purposes, for example if you make more than $20,000 on Lake Hop you would be able to receive a 1099 form through us.</div>
                            <br/>
							<div className="body-light greyPool" style={{marginBottom: '10px'}}>This information will also be used to run a backgroudn check to verify your identity prior to hosting guests. Your information will always be kept private. If you are looking for information regarding privacy, review our <a href="/privacy_policy">Privacy Policy</a>.</div>
	    					<Inputs inputs={identityParams(user)} style={{margin: '0px'}} />
	    				</div>
	    			),
	    		},
	    		{
	    			name: 'Bank information',
	    			key: 'bank_information',
	    			apiKey: 'external_account',
	    			proHopper: true,
	    			completed: state.user.onboard_metadata['bank_information'],
	    			onSubmit: async (params) => {

	    				if (state.user.onboard_metadata['bank_information']) {
	    					return true;
	    				};

	    				if (params.routing_number !== params.routing_number_copy) {
	    					api.setError('external_account', 'Routing numbers do not match.');
	    					return;
	    				};

	    				if (params.account_number !== params.account_number_copy) {
	    					api.setError('external_account', 'Account numbers do not match.');
	    					return;
	    				};

	    				const res = await stripe.createToken('bank_account', {
	    					country: 'US',
	    				    currency: 'usd',
	    				    routing_number: params.routing_number,
	    				    account_number: params.account_number,
	    				    account_holder_name: params.account_holder_name,
	    				    account_holder_type: 'individual',
	    				});

	    				if (res.token) return await api.attachExternalAccount(state.user.id, res.token.id);
	    			},
	    			inputs: (i) => {
	    				return <div key={i} >
	    					<div className="title-small" style={{margin: '20px 0px 10px 0px'}}>Your Bank information</div>
	    					<div className="body-light greyPool">Add your bank information below. We will direct deposit your earnings to this account.</div>
	    					<Inputs inputs={externalAccountParams()} style={{margin: '0px'}} />
	    				</div>
	    			},
	    		},
	    		{
	    			name: 'Payment Verification',
	    			key: 'stripe_terms_of_service',
	    			apiKey: 'stripe_terms_of_service',
	    			proHopper: true,
	    			lastStep: true,
	    			completed: user.onboard_metadata['stripe_terms_of_service'],
	    			onSubmit: (params) => !user.stripe_link,
	    			inputs: (i) => (
	    				<div key={i} >
                            <div className="title-small">Verify your account to receive payments</div>
                            <div className="body-light greyPool" style={{marginTop: '10px'}} >In order to connect your account for payment, we will need to verify your identity. Click on the link below to be redirected to our payment partner, Stripe.</div>
	    					<VerifyIdentity link={user.stripe_link} />
	    				</div>
	    			),
	    		},
	    	]
	    },
	    {
	    	name: 'Insurance',
	    	steps: [
	    		{
    				name: 'Insurance',
    				key: 'insurance',
    				lastStep: true,
    				firstStep: true,
    				onSubmit: () => true,
    				apiKey: 'upload_insurance',
    				completed: state.user.onboard_metadata['insurance'],
    				lastStep: true,
    				inputs: (i) => (
    					<InsuranceUpload key={i} />
    				)
	    		}
	    	],
	    },
	    {
	    	name: 'Review Policies',
	    	steps: [
	    		{
	    			name: 'Review',
	    			key: 'review',
	    			apiKey: 'update_user',
	    			proHopper: true,
	    			firstStep: true,
	    			completed: user.onboard_metadata['review'],
	    			onSubmit: async ({ a,b,c, hear_about_us, other }) => {
	    				if (signature.current.isEmpty()) {
	    					api.setError('update_user', 'Please provide your signature in the box provided.');
	    					return;
	    				};

	    				if (a == "1" && b == "1" && c == "1") {
		    				const f = await api.updateUser(user.id, {
		    					hear_about_us: other || hear_about_us || '',
		    				});

		    				return await api.backgroundCheck(user.id, signature.current.toDataURL());
		    			} else {
		    				api.setError('update_user', 'Please check the boxes to continue.');
		    			};
	    			},
	    			inputs: (i) => (
	    				<div key={i} >
	    					<div className="title-small" style={{margin: '20px 0px 5px 0px'}}>Where did you hear about us?</div>
	    					<Select
	    						name="hear_about_us"
	    						onChange={({ target }) => setHearAboutUs(target.value)}
	    						options={[
	    							'Facebook',
	    							'Instagram',
	    							'Tiktok',
	    							'Twitter',
	    							'A friend',
	    							'Other',
	    						]}
	    					/>
	    					{	
	    						hearAboutUs == 'Other'

	    						&&	<div className="input-primary">
			    						<input
			    							type="text"
			    							name="other"
			    							placeholder="Where did you hear about us?"
			    						/>
			    					</div>
			    			}
	    					<div className="title-small" style={{margin: '20px 0px 5px 0px'}}>Last steps to review</div>
	    					<div className="body-light greyPool" style={{marginBottom: '15px'}}>Review our policies before you publish your listing. Please review details provided in our <a href="/terms_of_service">Terms of Service</a> and <a href="privacy_policy">Privacy Policy</a>.</div>
	    					<div className="subheader-heavy">Service fees</div>
	    					<div className="body-light greyPool" style={{marginBottom: '15px'}}>Lake Hop takes 15% of each booking on top of the base price you set. Lake Hop handles payment processing and around the clock customer service. </div>
	    					<div className="subheader-heavy">Cancellation policy</div>
	    					<div className="body-light greyPool" style={{marginBottom: '15px'}}>
	    						All bookings abide by our Lake Hop cancellation policy:
	    						<ul>
									<li>If a guest makes a cancellation before 24 hours of the booking start time, they are granted a full refund for the trip.</li>
									<li>If a guest makes a cancellation within 24 hours of the booking start time, they are granted a partial refund of 50% for the trip.</li>
									<li>If a host makes a cancellation, the guest is always given a full refund.</li>
	    						</ul>
	    					</div>
	    					<div className="subheader-heavy">Exclusivity</div>
	    					<div className="body-light greyPool" style={{marginBottom: '15px'}}>Each experience you schedule through Lake Hop must only be attended by Lake Hop guests. No other guests should be allowed.</div>
	    					<div className="subheader-heavy">Background Check</div>
	    					<div className="body-light greyPool" style={{marginBottom: '15px'}}>All hosts go through a background check by our Lake Hop team to ensure safe boating & experiences. We need your signature below for that to happen. Your information will be kept private and your listing will only be approved once the background check is approved as well.</div>
	    					<div 
	    						style={{
	    							border: '1px #EAEAEA solid', 
	    							height: '200px', 
	    							borderRadius: '4px',
	    							marginBottom: '15px',
	    						}}>
	    						<SignaturePad ref={signature} />
	    					</div>
	    					<div className="subheader-heavy">By submitting, I confirm the following is true:</div>
	    					<CheckboxList
	    						list={{
	    							a: 'My experience complies with local and state laws.',
	    							b: 'I confirm that my descriptions and photos are my own, and accurately reflect my boat.',
	    							c: () => <span>I confirm that I have read and accept the Lake Hop <a href="/terms_of_service">Terms of Service</a> and <a href="privacy_policy">Privacy Policy</a>.</span>,
	    						}}
	    						col='12'
	    					/>
	    				</div>
	    			),
	    		},
	    		{
	    			name: 'Sign Up Gift',
	    			key: 'gift',
	    			apiKey: 'gifts',
	    			proHopper: true,
	    			lastStep: true,
	    			completed: user.onboard_metadata['gift'],
	    			onSubmit: (params) => gift.id
	    								?	api.updateGift(gift.id, params)
	    								: 	api.createGift(params),
	    			lastStep: true,
	    			inputs: (i) => (
	    				<div key={i} >
	    					<div className="title-small" style={{margin: '20px 0px 10px 0px'}}>Welcome to the Lake Hop family! Free shirt on us!</div>
	    					<div className="input-primary">
	    						<input
	    							name="gift_type"
	    							value="shirt"
	    							type="hidden"
	    						/>
	    					</div>
	    					<div className="input-primary">
	    						<label>Choose a Size</label>
	    						<Select
	    							name="size"
	    							defaultValue={gift.size}
	    							placeholder="Choose Size"
	    							options={['Small', 'Medium', 'Large', 'Extra Large']}
	    						/>
	    					</div>
	    					<div className="title-small" style={{margin: '20px 0px 10px 0px'}}>Where should we ship this to?</div>
	    					<Inputs inputs={addressParams(user)} style={{margin: '0px'}} />
	    				</div>
	    			),
	    		}
	    	]
	    }
    ].map(step => {
    	return {
    		...step,
    		steps: step.steps.filter(step =>
	    		!user.pro_hopper_onboard || step.proHopper
	    	),
	    }
    }).filter(step =>
    	step.steps.length && (!user.boat_only_onboard || step.boatOnly)
    );

    // ^^^^^^^
    // confusing af, I know
    // filters out steps and sub steps according
    // to if this is a boat only and or pro hopper onboard
    // -----------------------------------------------------

    const stepCount = steps.reduce((mem, step) => mem + step.steps.length, 0);

    function nextConf(step, subStep, lastStep) {
    	if (lastStep) {
    		return steps[step + 1] && steps[step + 1].steps[0] || {};
    	} else {
    		return steps[step].steps[subStep + 1] || {};
    	}
    };

    async function handleSubmit(e) {
    	e.preventDefault();

    	const next = nextConf(currentStep, currentSubStep, csConf.lastStep);

    	const formData = new FormData(form.current);
    	const params = {};
    	for (let pair of formData.entries()) {
    		params[pair[0]] = pair[1];
    	};
    	const res = await csConf.onSubmit(params);
    	if (res) {
    		if (currentStep === steps.length - 1 && csConf.lastStep) {
    			await api.updateOnboard({
    				completed: true,
    				boat_id: boat.id,
    			});
    			window.location.href = `/onboard_completed/${boat.id}`;
    		} else if (csConf.lastStep) {
    			api.updateOnboard({
    				step: currentStep + 1,
    				sub_step: 0,
    				key: csConf.key,
    				next: next.key,
    			});
    			setSubStep(0);
    			setStep(prev => prev + 1);
    		} else {
    			api.updateOnboard({
    				sub_step: currentSubStep + 1,
    				key: csConf.key,
    				next: next.key,
    			});
    			setSubStep(prev => prev + 1);
    		}
    	}
    };

    function prevStep(e) {
    	e.preventDefault();
    	if (csConf.firstStep) {
    			changeStep(currentStep - 1, steps[currentStep - 1].steps.length - 1);
		} else {
			changeStep(currentStep, currentSubStep - 1);
		}
    };

    function changeStep(h, l, close=true) {
    	if (close) setShowSideNav(false);
    	h = h >= 0 ? h : 0;
    	l = l >= 0 ? l : 0;
    	setSubStep(l);
    	setStep(h);
    	api.updateOnboard({ step: h, sub_step: l });
    };

    function onSideNavClose() {
    	form.current.focus();
    	setShowSideNav(false);
    };

    async function cancelOnboarding() {
    	if (window.confirm('Are you sure you want to cancel onboarding? Your progress will not be saved.')) {
	    	await api.updateOnboard({ completed: true });
	    	await api.destroyBoat(boat.id);
	    	window.location.href = '/';
	    };
    };


    const SideNav = () => (
    	<div>
	    	<div className="flex-between">
	    		<img
	    			width="50px"
	    		    src={Logo}
	    		    alt="Lake Hop Logo"
	    		/>
	    		<a href="/" className="save-exit subheader-heavy">
	    			Save and Exit
	    		</a>
	    	</div>
	    	<h2 style={{margin: '30px 0px'}} >Share your Boat</h2>
	    	<div className="onboard-tabs">
	    		{steps.map((step, i) =>
	    			<div key={i}>
	    				<div className="ob-tab subheader-light" >
	    					<i className={`ob-tab-icon fas fa-angle-${i === currentStep ? 'down' : 'up'}`} />
	    					{step.name}
	    				</div>
	    				{i === currentStep && step.steps.map((step, i) =>
	    					<div 
	    						key={i} 
	    						className="ob-tab ob-sub-tab subheader-light flex-between"
	    						style={{
	    							background: i === currentSubStep ? '#fff' : '', 
	    							fontWeight: i === currentSubStep ? 'bold' : '',
	    						}}
	    					>
	    						{step.name}
	    						{step.completed && <i className="fas fa-check-circle" />}
	    					</div>
	    				)}
	    			</div>
	    		)}
	    	</div>
	    	<div style={{marginTop: '25px'}} />
	    	<a  href="#" className="save-exit subheader-heavy" onClick={cancelOnboarding} >
    			Cancel Onboarding
    		</a>
	    </div>
    );

    const csConf = steps[currentStep].steps[currentSubStep];

	return(
		<div className="onboard-container" style={{height: pageHeight}} >
			<div className="side-nav non-mobile-only">
				<SideNav />

			</div>
			<div className="mobile-only">
				<Drawer 
					from="left"
					show={showSideNav} 
					onClose={onSideNavClose} 
					style={{padding: '50px 28px 28px 28px', width: '70%'}} 
				>
					<SideNav />
				</Drawer>
			</div>
			<div className="onboard" >
				<div style={{padding: '28px'}}>
					<div className="flex">
						<i onClick={() => setShowSideNav(true)} className="far fa-bars blackPool mobile-only" style={{fontSize: '25px'}} />
						<h3 style={{margin: '0px 15px'}} >
							{csConf.name}
						</h3>
					</div>
					<form onClick={onSideNavClose} className="onboard-form" style={{height: pageHeight - 200}} ref={form} onSubmit={handleSubmit} >
						{csConf.inputs((10 * currentStep) * (1 + currentSubStep))}
						<ErrorBox error={state.errors[csConf.apiKey]} />
						<div className="onboard-status">
							<div className="onboard-status-bar">
								<div className="onboard-progress" style={{width: progress}}/>
							</div>
							<div className="ob-btns flex-between">
								<div className="btn-secondary" onClick={prevStep} >
									Back
								</div>
								<div className="body-heavy non-mobile-only">{completedCount} of {stepCount} steps completed</div>
								<Submit copy="Continue" loading={state.loading[csConf.apiKey]} />
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default withStuff(Onboard,
	{
		state: true, api: true,
		effect: ({ api }) => {
		   	api.getOnboardBoat();

			history.pushState({}, 'onboarding', 'onboarding');
		},
		loader: 'boats',
	}
);
