import React, { useRef, useState } from 'react';
import { withStuff } from '../hocs';
import { Submit, ErrorBox } from '../components';

const Reply = ({ state, api }) => {
	const message = useRef();
	const [success, setSuccess] = useState(false);

	async function reply() {
		const res = await api.message(state.booking.id, message.current.value, true);
		if (res) setSuccess(true);
	};

	return(
		<div className="container" style={{marginTop: '40px'}}>
			<ErrorBox error={state.errors.message} />
			{
				success

				? 	<div className="text-center">
						<i className="fas fa-check-circle big-check" />
						<h2>Your {state.hosting ? 'guest' : 'host'} has received your message!</h2>
					</div>

				: 	<div>
						<div className="input-primary">
							<h2>Reply to your {state.hosting ? 'guest' : 'host'}</h2>
							<textarea
								ref={message}
								rows="10"
								placeholder={`Write a reply to your ${state.hosting ? 'guest' : 'host'}`}
							/>
						</div>
						<Submit
							loading={state.loading.message}
							copy="Reply"
							onClick={reply}
							style={{float: 'left', marginBottom: '20px'}}
						/>
					</div>
			}
		</div>
	);
};

export default withStuff(Reply,
	{
		api: true,
		state: true,
		query: true,
		effect: ({ api, match, query }) => {
			if (query.type === 'host')
				api.setHosting(true, false);

			if (query.type === 'guest')
				api.setHosting(false, false);
			
			api.getBooking(match.params.id);
		},
		loader: 'bookings',
	}
);