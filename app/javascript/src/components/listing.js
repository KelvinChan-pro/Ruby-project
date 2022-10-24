import React, { useState } from 'react';
import {
	SideTabs, EditForm, ActivityChecks,
	InsuranceUpload, Submit, SimpleForm,
	BoatFeatures, BoatRules,
	SuccessBox, BoatPricing,
	BoatPhotos, BoatLocations, Tabs,
} from '../components';
import { specificationsParams, locationParams } from '../params';
import { parseActivities } from '../utils';
import { withStuff } from '../hocs';

const Listing = ({ state, api, back, ...boat }) => {
	const [lake, setLake] = useState(boat.lake && boat.lake.id);

	function updateBoat(params) {
		return api.updateBoat(boat.id, params);
	};

	const Form = ({ onSubmit, children }) => (
		<SimpleForm onSubmit={onSubmit}>
			<SuccessBox success={state.success.update_boat} />
			{children}
			<Submit
				copy="Save"
				loading={state.loading.update_boat}
			/>
		</SimpleForm>
	);

	return(
		<div id="listing" style={{ marginTop: '20px' }}>
			<div className="flex title-small pointer" onClick={back} style={{marginBottom: '20px'}} >
				<i className="fal fa-angle-left" style={{fontSize: '30px', marginRight: '10px'}} />
				<div>Back</div>
			</div>
			<div className="non-mobile-flex-between" style={{marginBottom: '20px'}}>
				<h2>{boat.title}</h2>
				<div className="flex subheader-heavy">
					<i style={{fontSize: '12px'}} className={`fas fa-circle ${boat.public ? 'greenPool' : 'yellowPool'}`} />
					<div style={{marginLeft: '8px'}} className="underlined pointer" onClick={() => updateBoat({ public: !boat.public })} >{ boat.public ? 'Listed' : 'Unlisted'}</div>
					<a style={{marginLeft: '20px'}} href={`/boats/${boat.id}`} className="btn-secondary">Preview Listing</a>
				</div>
			</div>
			<SideTabs
				onChange={() => api.clearSuccess()}
				tabs={[
					{
						name: 'Listing Page',
						tabs: [
							{
								name: 'Boat Information',
								child: (i) => (
									<EditForm
										key={i}
										label="Boat"
										onSubmit={updateBoat}
										form={{
											type: 'update_boat',
											submitCopy: 'Save',
						                    submitStyle: { marginTop: '20px', width: '160px' },
						                    inputs: specificationsParams(boat),
										}}
									/>
								),
							},
							{
								name: 'Locations',
								child: (i) => (
									<EditForm
										key={i}
										label="Locations"
										onSubmit={async params => {
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


											return await api.updateBoatLocations(boat.id, np.filter(Boolean));

                                        }}
                                       	customPreview={boat.locations.map(location =>
                                       		`${location.lake_name} - ${location.marina_name}`
                                       	)}
										form={{
											type: 'update_boat',
											submitCopy: 'Save',
						                    submitStyle: { marginTop: '20px', width: '160px' },
						                    inputs: locationParams(boat, state, ({ target }) => setLake(target.value), lake),
										}}
									>
                                        <BoatLocations />
                                    </EditForm>
								),
							},
							{
								name: 'Overview',
								proHopper: true,
								child: (i) => (
									<div>
										<EditForm
											key={i}
											label="Listing Title"
											onSubmit={updateBoat}
											form={{
												type: 'update_boat',
												submitCopy: 'Save',
							                    submitStyle: { marginTop: '20px', width: '160px' },
							                    inputs: [{
							                    	key: 'title',
							                    	defaultValue: boat.title,
							                    	type: 'text',
							                    	label: 'Listing Title',
							                    	placeholder: 'Start writing here...',
							                    	editShow: true,
							                    }],
											}}
										/>
										<EditForm
											key={i}
											label="Description"
											onSubmit={updateBoat}
											form={{
												type: 'update_boat',
												submitCopy: 'Save',
							                    submitStyle: { marginTop: '20px', width: '160px' },
							                    inputs: [{
							                    	key: 'description',
							                    	placeholder: 'Start writing here...',
							                    	defaultValue: boat.description,
							                    	type: 'textarea',
							                    	rows: '9',
							                    	label: 'Description',
							                    	editShow: true,
							                    }],
											}}
										/>
									</div>
								),
							},
							{
								name: 'Photos',
								proHopper: true,
								child: (i) => <BoatPhotos key={i} />,
							},
							{
								name: 'Pricing',
								proHopper: true,
								child: (i) => (
									<Form key={i} onSubmit={params => {
										const np = { time_increments: {} };
										Object.keys(params).forEach(key => {
											const [a, b] = key.split('.');
											if (a === 'time_increments') {
												np.time_increments[b] = params[key] == "1";
											} else {
												np[a] = params[key];
											};
										});
										updateBoat(np);
									}} >
										<BoatPricing {...boat} />
										<div style={{marginTop: '30px'}} />
									</Form>
								),
							},
							{
								name: 'Activities',
								proHopper: true,
								child: (i) => (
									<Form key={i} onSubmit={params => updateBoat(parseActivities(params))} >
										<ActivityChecks
				    						defaultChecked={boat.activities}
				    						sub_activities={boat.sub_activities}
				    						pro_hopper={boat.pro_hopper}
				    					/>
				    				</Form>
				    			),
							},
							{
								name: 'Boat Features',
								child: (i) => (
									<Form
										key={i}
										onSubmit={params => {
											const np = { features: {} };
    				                      Object.keys(params).forEach(key => {
                                                const [a, b] = key.split('.');
                                                if (b) {
                                                  np[a][b] = params[key] === '1';
                                                } else {
                                                    np[a] = params[key];
                                                }
                                            });
						    				updateBoat(np);
										}}
									>
										<BoatFeatures {...boat} />
										<div style={{marginTop: '30px'}} />
									</Form>

								),
							},
							{
								name: 'Boat Rules',
								child: (i) => (
									<Form
										key={i}
										onSubmit={params => {
											const rules = {};
						    				Object.keys(params).forEach(key => {
                                                if (key !== 'extra_rules') {
                                                   rules[key] = params[key] === "1";
                                                }
                                            });
                                            const extra_rules = JSON.parse(params.extra_rules);
						    				updateBoat({ rules, extra_rules });
										}}
									>
										<BoatRules {...boat} />
										<div style={{marginTop: '30px'}} />
									</Form>
								),
							},
							{
								name: 'What guests should bring',
								proHopper: true,
								child: (i) => (
									<Form key={i} onSubmit={updateBoat} >
										<div className="input-primary">
											<textarea
												name="guests_should_bring"
												defaultValue={boat.guests_should_bring}
												placeholder="If guests need anything in order to enjoy your experience, this is the place to tell them. This list will be emailed to guests when they book your experience to help them prepare."
												rows="9"
											/>
										</div>
									</Form>
								),
							},
							{
								name: 'Insurance',
								child: (i) => (
									<InsuranceUpload key={i} />
								),
							}
						].filter(tab => !boat.pro_hopper || tab.proHopper)
					}
				]}
			/>
		</div>
	);
};

export default withStuff(Listing,
	{
		api: true, state: true,
	}
);
