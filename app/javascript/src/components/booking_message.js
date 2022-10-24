import React, { useRef, useState } from 'react';
import { ErrorBox, Submit, Modal } from '../components';
import { withStuff } from '../hocs';

const BookingMessage = ({ api, state, children, id }) => {
	const message = useRef();
	const [show, setShow] = useState(false);
	const [success, setSuccess] = useState(false);
	const receiver = state.hosting ? 'guest' : 'host';

	async function sendMessage() {
		const res = await api.message(id, message.current.value);
		if (res) setSuccess(true);
	};

	return(
		<div>
			{children({ setShow })}
			<Modal show={show} onClose={() => setShow(false)} >
				<div style={{padding: '30px', textAlign: 'left'}}>
					<ErrorBox error={state.errors.message} />
					{
						success

						? 	<div className="text-center">
								<i className="fas fa-check-circle big-check" />
								<h2>Your {receiver} has received your message!</h2>
								<button className="btn-primary" style={{width: '100%', marginBottom: '20px'}} onClick={() => setShow(false)}>Close</button>
							</div>

						: 	<div>
								<div className="input-primary">
									<label>Send a message to your {receiver}</label>
									<textarea
										ref={message}
										rows="10"
									/>
								</div>
								<Submit
									loading={state.loading.message}
									copy={`Message ${receiver}`}
									onClick={sendMessage}
									style={{float: 'right', marginBottom: '20px'}}
								/>
							</div>
					}
					
				</div>
			</Modal>
		</div>
	);
};

export default withStuff(BookingMessage, { state: true, api: true });