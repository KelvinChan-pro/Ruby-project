import React, { useMemo } from 'react';
import {
	Listing, ListingCard,
} from '../components';
import { withStuff } from '../hocs';

const Listings = ({ api, state }) => {

	async function newBoat() {
		if (window.confirm('Are you sure you want to create a new listing?')) {
			const res = await api.updateOnboard({
				completed: false,
				step: 0, sub_step: 0,
				boat_only_onboard: true,
				pro_hopper_onboard: false,
			});

			if (res) window.location.reload();
		};
	};

	async function proHopper() {
		if (window.confirm('Are you sure you want to start the Pro Hopper onboarding?')) {
			const res = await api.updateOnboard({
				completed: false,
				step: 0, sub_step: 0,
				boat_only_onboard: true,
				pro_hopper_onboard: true,
			});

			if (res) window.location.reload();
		};
	};

	const hasProHopper = state.boats.find(boat => boat.pro_hopper);

	if (Object.keys(state.boat).length != 0) {
		return(
			<Listing 
				{...state.boat} 
				back={() => api.store.reduce({
					type: 'set_boat',
					boat: {}, force: true,
				})}
			/>
		)
	} else {
		return(
			<div style={{marginTop: '25px'}} >
				<div className="flex-between">
					<h2>Listings</h2>
					<div className="flex">
						<button className="btn-primary" onClick={newBoat} >
							New Listing
							<i className="fal fa-plus-circle" style={{marginLeft: '10px'}} />
						</button>
						{!hasProHopper &&
							<button style={{marginLeft: '10px'}} className="btn-primary" onClick={proHopper} >
								Become a Pro
								<i className="fal fa-star" style={{marginLeft: '10px'}} />
							</button>
						}
					</div>
				</div>
				<div className="row" >
					{state.boats.map((boat, i) =>
						<ListingCard 
							key={i}
							{...boat}
							onClick={() => api.store.reduce({
								type: 'set_boat',
								boat,
							})}
						/>
					)}
				</div>
			</div>
		);
	};
	
};

export default withStuff(Listings,
	{
		api: true, state: true,
		effect: ({ api }) => api.getMarinas(),
	}
);
