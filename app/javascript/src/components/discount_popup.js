import React, { useRef, useState, useEffect } from 'react';
import { ErrorBox, Submit, Modal } from '../components';
import { withStuff } from '../hocs';

const DiscountPopup = ({ api, state, children }) => {
	const email = useRef();
	const seen = localStorage.getItem('discount_popup') == '1';
	const [show, setShow] = useState(false);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setShow(!seen);
		}, 4000)
	}, []);

	async function createEmail() {
		const res = await api.createEmail(email.current.value);
		if (res) {
			localStorage.setItem('discount_popup', '1');
			setSuccess(true);
		};
	};

	function onClose() {
		localStorage.setItem('discount_popup', '1');
		setShow(false);
	};

	return(
		<div>
			<Modal show={show} onClose={onClose} >
				<div style={{padding: '30px', textAlign: 'left'}}>
					<ErrorBox error={state.errors.email} />
					{
						success

						? 	<div className="text-center">
								<i className="fas fa-check-circle big-check" />
								<h2>Use code FIRSTTRIP10 to get 10% off!</h2>
								<div style={{margin: '20px 0px 20px 0px'}} className="body-light greyPool text-center">Enter code FIRSTTRIP10 in the discount section at checkout.</div>
								<button className="btn-primary" style={{width: '100%', marginBottom: '20px'}} onClick={() => setShow(false)}>Close</button>
							</div>

						: 	<div>
								<div className="input-primary">
									<h2>Get 10% off your first Lake Hop trip!</h2>
									<input
										placeholder="Enter your email"
										ref={email}
										type="text"
										style={{margin: '20px 0px'}}
									/>
								</div>
								<Submit
									loading={state.loading.email}
									copy="Get Discount"
									onClick={createEmail}
									style={{float: 'right', marginBottom: '20px'}}
								/>
							</div>
					}
					
				</div>
			</Modal>
		</div>
	);
};

export default withStuff(DiscountPopup, { state: true, api: true });
