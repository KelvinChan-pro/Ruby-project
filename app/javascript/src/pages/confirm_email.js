import React, { useContext, useEffect } from 'react';
import Context from '../context';
import { Loader, ErrorBox } from '../components';

const ConfirmEmail = ({ match }) => {
	const { api, state } = useContext(Context);

	useEffect(() => {
		(async function(token) {
			const res = await api.confirmEmail(token);
			if (res) window.location.href = "/";
		})(match.params.token);
	}, []);

	const error = state.errors.confirm_email;
	if (error) return <div className="container"><ErrorBox error={error} /></div>;

	return(
		<Loader />
	);
}

export default ConfirmEmail;
