import React from 'react';
import { RadioInput } from '../components';

const BoatCancellationPolicy = ({ cancellation_policy }) => (
	<RadioInput
		name="cancellation_policy"
		defaultValue={cancellation_policy}
		options={{
			flexible: () => (
				<div>
					<div className="subheader-heavy">Flexible</div>
					<div className="small-light">100% payout for cancellations made within 24 hours of the booking start time.</div>
				</div>
			),
			moderate: () => (
				<div>
					<div className="subheader-heavy">Moderate</div>
					<div className="small-light">100% payout for cancellations made within 2 days of the booking start time.<br/>50% payout for cancellations made within 2-5 days of the booking start time.</div>
				</div>
			),
			strict: () => (
				<div>
					<div className="subheader-heavy">Strict</div>
					<div className="small-light">100% payout for cancellations made within 14 days of the booking start time.<br/>50% payout for cancellations made within 14-30 days of the booking start time.</div>
				</div>
			),
		}}
	/>
);

export default BoatCancellationPolicy;