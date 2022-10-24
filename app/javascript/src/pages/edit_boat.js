import React, { useEffect, useState } from 'react';
import { 
	Tabs, Dashboard, Listings, 
	Loader, ErrorBox, Availability, 
	SimpleForm, Reviews, 
} from '../components';
import { Bookings } from '../pages';
import { withStuff } from '../hocs';

const EditBoat = ({ match, api, state }) => {

	function onSubmit(params) {
		api.updateBoat(state.boat.id, params);
	}

	return(
		<div style={{marginBottom: '50px'}} >
		    <Tabs
		    	tabClass="nav-secondary non-mobile-only"
		    	compClass="container"
		    	path={match.params.id ? `/boats/${match.params.id}/edit` : '/manage-boat'}
		    	defaultTab={match.params.tab}
		    	tabs={{
		    		home: {
		    			name: 'Home',
		    			icon: 'fal fa-house',
		    			child: Dashboard,
		    		},
		    		listings: {
		    			name: 'Listings',
		    			icon: 'fal fa-ship',
		    			child: Listings,
		    		},
		    		bookings: {
		    			name: 'Bookings',
		    			icon: 'fal fa-tasks',
		    			child: Bookings,
		    		},
                    calendar: {
                        name: 'Calendar',
                        icon: 'fal fa-calendar',
                        child: () => {

                            const user = state.profile && Object.keys(state.profile).length ? state.profile : state.user;

                            const hasBoat = state.boats.find(boat => !boat.pro_hopper);
                            const hasProHopper = state.boats.find(boat => boat.pro_hopper);

                            const [proHopper, setProHopper] = useState(hasProHopper && !hasBoat);

                            function onSubmit(params) {
                                params.available_weekdays = params.available_weekdays == "1";
                                params.available_weekends = params.available_weekends == "1";
                                params.dates = params.dates.split(',');
                                params.pro_hopper = proHopper;
                                return api.updateBoatDates(user.id, params);
                            };

                            return(
                                <div style={{margin: '30px 0px'}}>
                                	{
                                		hasProHopper && hasBoat &&

                                		<div className="flex" style={{marginBottom: '20px'}} >
                                			<div
                                				className={`title-small pointer ${!proHopper && 'primaryPool'}`} 
                                				onClick={() => setProHopper(false)}
                                				style={{
                                					textDecoration: proHopper ? 'none' : 'underline',
                                				}}
                                			>
                                				Boats
                                			</div>
                                			<div 
                                				style={{
                                					marginLeft: '10px',
                                					textDecoration: proHopper ? 'underline' : 'none',
                                				}} 
                                				className={`pointer title-small ${proHopper && 'primaryPool'}`} 
                                				onClick={() => setProHopper(true)}
                                			>
                                				Pro-Hopper
                                			</div>
                                		</div>
                                	}
                                    <SimpleForm onSubmit={onSubmit} >
                                        <Availability
                                        	user={user}
                                        	proHopper={proHopper}
                                        />
                                        <input type="submit" className="btn-primary" value="Save" style={{marginLeft: '20px', marginTop: '15px'}} />
                                    </SimpleForm>
                                </div>
                            );
                        },
                    },
                    reivews: {
                        name: 'Reviews',
                        icon: 'fal fa-star',
                        child: () => (
                        	<div style={{marginTop: '25px'}}>
                        		<h2>Reviews</h2>
                        		<Reviews reviews={state.user.host_reviews} />
                        	</div>
                        )
                    },
		    	}}
		    />
		</div>
	);
};

export default withStuff(EditBoat,
	{
		api: true,
		state: true,
		effect: ({ api, match }) => {
			api.setHosting(true, false);
			if (match.params.id) {
				api.getProfile(match.params.id);
				api.getBoats(match.params.id);
			} else {
				api.getMyBoats();
			};
		},
		loader: 'boats',
	}
);
