import React from 'react';
import { withStuff } from '../hocs';

const StripeBanner = ({ state }) => {
	return(
		<div>
			{
				state.user.stripe_link &&

				<div className="stripe-banner">
					More information is needed on your stripe account before you can receive payouts.
					<a href={state.user.stripe_link}> Edit your account here.</a>
				</div>
			}
		</div>
	);
};

export default withStuff(StripeBanner, { state: true });