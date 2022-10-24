import React, { useState, useContext } from 'react';
import { Modal, SimpleForm, Submit, ErrorBox } from '../components';
import Context from '../context';

const MissingLakeModal = (props) => {
	const { state, api } = useContext(Context);
	const [success, setSuccess] = useState(false);

	async function handleSubmit(params) {
		const res = await api.createLakeQuery(params);
		setSuccess(res);
	};

	return(
		<Modal {...props} >
			<div className="missing-lake" style={{padding: '40px 20px'}}>
				{
					success

					? 	<div>
							<i className="fas fa-check-circle big-check" />
							<h2>Lake Submitted</h2>
							<div style={{margin: '20px 0px 20px 0px'}} className="p-copy text-center">Thanks for sharing!</div>
							<button className="btn-primary" style={{width: '100%', marginBottom: '20px'}} onClick={props.onClose}>Close</button>
						</div>

					: 	<div>
							<ErrorBox error={state.errors.lake_queries} />
							<h2>Don't see your lake?</h2>
							<br/>
							<div className="body-light greyPool">
								Sorry about that! We’re working really hard to make Lake Hop available to everyone who’s interested. 
							</div>
							<br/>
							<div className="body-light greyPool">
								Fill in the lake name you’re looking for below and your email. We’ll notify you when your lake has listings available!
							</div>
							<SimpleForm onSubmit={handleSubmit} >
								<div className="input-primary">
									<input name="lake" type="text" placeholder="Enter your lake i.e. Lake Cumberland" />
									{
										state.loggedIn

										?	<input type="hidden" name="email" value={state.user.email} />

										: 	<input name="email" type="email" placeholder="Enter your email" />
									}
								</div>
								<Submit style={{width: '100%'}} copy="Send" loading={state.loading.lake_queries} />
							</SimpleForm>
						</div>
				}
			</div>
		</Modal>
	);
};

export default MissingLakeModal;