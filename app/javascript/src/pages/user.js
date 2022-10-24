import React from 'react';
import { withStuff } from '../hocs';

const User = ({ state }) => {
	const { account } = state;

	return(
		<div className="container" style={{marginTop: '50px'}} >
			<div style={{marginBottom: '10px'}}>
				<div className="subheader-heavy" >
					Name
				</div>
				<div className="subheader-light greyPool">
					{account.full_name}
				</div>
			</div>
			<div style={{marginBottom: '10px'}}>
				<div className="subheader-heavy" >
					Email
				</div>
				<div className="subheader-light greyPool">
					{account.email}
				</div>
			</div>
			<div style={{marginBottom: '10px'}}>
				<div className="subheader-heavy">
					Date of Birth
				</div>
				<div className="subheader-light greyPool">
					{account.date_of_birth}
				</div>
			</div>
			<div style={{marginBottom: '10px'}}>
				<div className="subheader-heavy">
					Phone Number
				</div>
				<div className="subheader-light greyPool">
					{account.phone_number}
				</div>
			</div>
			<div style={{marginBottom: '10px'}}>
				<div className="subheader-heavy">
					SSN
				</div>
				<div className="subheader-light greyPool">
					{account.ssn}
				</div>
			</div>
			<div style={{marginBottom: '10px'}}>
				<div className="subheader-heavy">
					Address
				</div>
				<div className="subheader-light greyPool">
					{account.full_address}
				</div>
			</div>
		</div>
	);
};

export default withStuff(User,
    {
        api: true, state: true,
        effect: ({ api, match }) => api.getAccount(match.params.id),
        loader: 'account',
    }
);