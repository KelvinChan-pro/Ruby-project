import React, { useRef, useState } from 'react';
import { ErrorBox, Submit, Modal } from '../components';
import { withStuff } from '../hocs';

const CustomCancellationPolicy = ({ api, state, children, ...props }) => {
	const cp = useRef();
	const [show, setShow] = useState(false);

	async function create() {
		const res = api.createCancellationPolicy(props.id, cp.current.value);
		if (res) props.onClose();
	};

	return(
		<div>
			{children({ setShow })}
			<Modal show={show} onClose={() => setShow(false)} {...props}>
				<div style={{padding: '30px', textAlign: 'left'}}>
					<ErrorBox error={state.errors.update_boat} />
					<div className="input-primary">
						<label>Add Custom Cancellation Policy</label>
						<textarea
							ref={cp}
							rows="15"
							defaultValue={props.custom_cancellation_policy}
						/>
					</div>
					<Submit
						loading={state.loading.update_boat}
						copy="Save"
						onClick={create}
						style={{float: 'right', marginBottom: '20px'}}
					/>
				</div>
			</Modal>
		</div>
	);
};

export default withStuff(CustomCancellationPolicy, { state: true, api: true });