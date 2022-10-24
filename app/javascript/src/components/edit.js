import React, { useState, useRef, useContext } from 'react';
import Context from '../context';
import { BtnSpinner } from '../components';

const Edit = ({ label, value, show, onUpdate, type, inputType="text" }) => {
	const { state } = useContext(Context);
	const [edit, setEdit] = useState(false);
	const input = useRef();

	async function handleUpdate(e) {
		e.preventDefault();
		const res = await onUpdate(input.current.value);
		setEdit(!res);
	};

	if (edit) {
		return(
			<div className="edit-card">
				<form onSubmit={handleUpdate} style={{width: '100%'}} >
					<div className="flex-between">
						<div className="input-primary" style={{margin: '0px', width: '90%'}}>
							<input
								type={inputType}
								defaultValue={value}
								ref={input}
							/>
						</div>
						{
							state.loading[type]

							? 	<BtnSpinner />

							: 	<div className="flex">
									<div style={{margin: '0px 10px'}} className="subheader-heavy link-btn" onClick={handleUpdate} >Save</div>
									<div className="subheader-heavy link-btn" onClick={() => setEdit(false)} >Cancel</div>
								</div>
						}
					</div>
				</form>
			</div>
		)
	} else {
		return(
			<div className="edit-card">
				<div>
					<div className="subheader-heavy">{label}</div>
					<div className="subheader-light greyPool">{show || value || 'Not Provided'}</div>
				</div>
				<div className="subheader-heavy link-btn" onClick={() => setEdit(true)} >Edit</div>
			</div>
		);
	}
};

export default Edit;