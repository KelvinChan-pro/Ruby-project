import React, { useContext } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import Context from '../context';

const BankAccount = ({ children }) => {
	const stripe = useStripe();
	const { api, state } = useContext(Context);

	async function updateBankAccount(params) {
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
		
		if (res.token) {
			return await api.attachExternalAccount(state.user.id, res.token.id);
		} else {
			return false;
		}
	};

	return children(updateBankAccount);
};

export default BankAccount;