import React, { useRef, useContext } from 'react';
import { Submit } from '../components';
import Context from '../context';

const SimpleForm = ({ onSubmit, children, submit, _ref_ }) => {
    const { state } = useContext(Context);
	const form = useRef();

	function handleSubmit(e) {
		e.preventDefault();
		const formData = new FormData(_ref_ ? _ref_.current : form.current);
		let params = {};
		for (let pair of formData.entries()) {
			params[pair[0]] = pair[1];
		};
		return onSubmit(params);
	};

	return(
		<form onSubmit={handleSubmit} ref={_ref_ || form} >
			{children}
            {submit && <Submit loading={state.loading[submit]} copy="Save" />}
		</form>
	);
};

export default SimpleForm;
