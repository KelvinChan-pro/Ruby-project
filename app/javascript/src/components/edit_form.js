import React, { useState } from 'react';
import { Form, SimpleForm, Submit, ErrorBox } from '../components';
import { withStuff } from '../hocs';

const EditForm = ({ state, label, form, onSubmit, children, customPreview }) => {
	const [edit, setEdit] = useState(false);

	async function handleSubmit(params) {
		const res = await onSubmit(params);
		setEdit(!res);
	};

	form.onSubmit = handleSubmit;

	function preview(input, i) {
		let v = input.defaultValue;

		if (input.type === 'select')
			v = input.options[input.defaultValue];

		if (input.type === 'radio')
			v = input.labels[input.defaultValue];

		return(
			<div key={i} className="subheader-light greyPool">{v + (!!input.editSuffix ? input.editSuffix : '')}</div>
		)
	};

	if (edit) {
        if (children) {
            return(
                <SimpleForm onSubmit={handleSubmit} submit={form.type} >
                    <div className="subheader-heavy link-btn" style={{marginTop: '20px'}} onClick={() => setEdit(false)} >Cancel</div>
                    {children}
                    <ErrorBox error={state.errors[form.type]} />
                </SimpleForm>
            );
        } else {
    		return(
    			<div>
    				<div className="subheader-heavy link-btn" style={{marginTop: '20px'}} onClick={() => setEdit(false)} >Cancel</div>
    				<Form {...form} />
    			</div>
    		);
        };
	} else {
		return(
			<div className="edit-card">
				<div>
				    <div className="subheader-heavy">{label}</div>
				    {
				    	customPreview

				    	? 	customPreview.map((v, i) =>
						    	<div key={i} className="subheader-light greyPool">{v}</div>
						    )

				    	: 	form.inputs.filter(({ editShow }) => editShow).map((input, i) =>
						    	preview(input, i)
						    )
				    }
				</div>
				<div className="subheader-heavy link-btn" onClick={() => setEdit(true)} >Edit</div>
			</div>
		);
	}
};

export default withStuff(EditForm, { state: true });
