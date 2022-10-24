import React, { useState } from 'react';
import { Modal, ErrorBox, Submit, RadioInput } from '../components';
import { withStuff } from '../hocs';
import { toUSD } from '../utils';

const TipModal = ({ api, state, ...props }) => {
	const [success, setSuccess] = useState(false);
	const { booking } = state;
	const [tip, setTip] = useState();
	const [customTip, setCustomTip] = useState();

	async function sendTip() {
		let amount;
		if (tip === 'custom') {
			amount = customTip;
		} else {
			amount = tip;
		};

		if (window.confirm(`Are you sure you want to send your host $${amount}?`)) {
			const res = await api.sendTip(booking.id, amount);
			setSuccess(res);
		};
	};

	return(
		<Modal {...props} >
			<div style={{padding: '30px'}}>
			<ErrorBox error={state.errors.tips} />
			{
				success

				? 	<div className="text-center">
						<i className="fas fa-check-circle big-check" />
						<h2>Your tip has been sent to your host!</h2>
						<button className="btn-primary" style={{width: '100%', marginBottom: '20px'}} onClick={props.onClose}>Close</button>
					</div>

				: 	<div className="text-left" >
						<h2>Tip your Host</h2>
						<div className="body-light greyPool">
							Leave a tip for {booking.host.first_name}
						</div>
						<div className="input-primary">
							<RadioInput
								onChange={(v) => setTip(v)}
								options={{
									20: () => (
									    <div>
									        <div className="subheader-heavy">$20</div>
									    </div>
									),
									40: () => (
									    <div>
									        <div className="subheader-heavy">$40</div>
									    </div>
									),
									60: () => (
									    <div>
									        <div className="subheader-heavy">$60</div>
									    </div>
									),
									custom: () => (
										<div>
										    <div className="subheader-heavy">Custom</div>
										    <div className="body-light greyPool">Anything you want!</div>
										</div>
									),
								}}
							/>
							{
								tip === 'custom' && 

								<input
									style={{marginTop: '15px'}}
									placeholder="Enter a custom tip amount"
									type="number" 
									value={customTip} 
									onChange={({ target }) => setCustomTip(parseInt(target.value))}
								/>
							}
						</div>
						<div className="text-right">
							<Submit
								loading={state.loading.tips}
								copy="Send Tip"
								onClick={sendTip}
							/>
						</div>
					</div>
			}
			</div>
		</Modal>
	);
};

export default withStuff(TipModal, { state: true, api: true });
