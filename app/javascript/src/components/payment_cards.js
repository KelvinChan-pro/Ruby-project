import React from 'react';
import { capitalize } from '../utils';
import { Select } from '../components';

const PaymentCards = ({ _ref_, paymentMethods }) => {
	function buildOptions() {
		return paymentMethods.reduce((mem, pm) => {
			mem[pm.id] = `Card ending in ${pm.card.last4}`;
			return mem;
		}, {});
	};

	return(
		<Select
			_ref_={_ref_}
			options={buildOptions()}
			placeHolder="Select card"
			defaultValue={paymentMethods[0] && paymentMethods[0].id}
		/>
	);
};

export default PaymentCards;