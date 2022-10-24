import React from 'react';
import { withStuff } from '../hocs';
import { toUSD } from '../utils';

const Ambassador = ({ state }) => {
	const ap = state.ambassador_profile;

	function copyLink(link) {
		navigator.clipboard.writeText(link);
	}

	return(
		<div className="container">
			<h1 style={{marginTop: '50px'}}>
				Ambassador Dashboard
			</h1>
			<div className="card" style={{margin: '20px 0px'}}>
           		<h2>Your Links</h2>
       			<div style={{marginRight: '15%'}} >
       				<a href={`https://www.golakehop.com?ambassador=${ap.uid}`} >
       					{`https://www.golakehop.com?ambassador=${ap.uid}`}
       				</a>
           			<div className="flex">
	           			<div className="body-light">Guest Link</div>
	           			<div
	           				className="primaryPool pointer hover-underline"
	           				style={{marginLeft: '10px'}}
	           				onClick={() => copyLink(`https://www.golakehop.com?ambassador=${ap.uid}`)}
	           			>
	       					copy
	       				</div>
	       			</div>
           		</div>
       			<div style={{marginRight: '15%', marginTop: '10px'}}>
       				<a href={`https://www.golakehop.com/share-your-boat?ambassador=${ap.uid}`} >
       					{`https://www.golakehop.com/share-your-boat?ambassador=${ap.uid}`}
       				</a>
           			<div className="flex">
	           			<div className="body-light">Host Link</div>
	           			<div
	           				className="primaryPool pointer hover-underline"
	           				style={{marginLeft: '10px'}}
	           				onClick={() => copyLink(`https://www.golakehop.com/share-your-boat?ambassador=${ap.uid}`)}
	           			>
	       					copy
	       				</div>
	       			</div>
           		</div>
           	</div>
           	<div className="card">
           		<h2>Stats</h2>
           		<div className="flex">
           			<div style={{marginRight: '15%'}} >
	           			<div className="display-heavy">
	           				{ap.guest_count}
	           			</div>
	           			<div className="body-light">Total Guests</div>
	           		</div>
           			<div style={{marginRight: '15%'}}>
	           			<div className="display-heavy">
	           				{ap.host_count}
	           			</div>
	           			<div className="body-light">Total Hosts</div>
	           		</div>
           			<div>
	           			<div className="display-heavy">
	           				{ap.booking_count}
	           			</div>
	           			<div className="body-light">Total Bookings</div>
	           		</div>
           		</div>
           		<div className="grey-divider" />
           		<div className="flex">
           			<div style={{marginRight: '15%'}}>
	           			<div className="display-heavy">
	           				{toUSD(ap.guest_bookings_sum)}
	           			</div>
	           			<div className="body-light">Guest Earnings</div>
	           		</div>
           			<div>
	           			<div className="display-heavy">
	           				{toUSD(ap.host_bookings_sum)}
	           			</div>
	           			<div className="body-light">Host Earnings</div>
	           		</div>
           		</div>
			</div>
		</div>
	);
};

export default withStuff(Ambassador, {
	state: true, api: true,
	effect: ({ state, api }) => api.getAmbassadorProfile(state.user.id),
	loader: 'ambassadors',
})