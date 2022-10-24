import React from 'react';
import { withStuff } from '../hocs';
import { Form } from '../components';

const NewDiscount = ({ api }) => {

	async function onSubmit(params) {
		const res = await api.createDiscount(params);

		if (res) {
			window.location.href = '/admin/discounts';
		};
	};

	return(
		<div className="container" style={{marginTop: '50px'}} >
		    <a className="back-btn" href="/admin/discounts" style={{marginBottom: '15px', display: 'block'}} >
		        <i className="fal fa-chevron-left" /> Back
		    </a>
		    <h2>New Discount</h2>
		    <Form
		        type="discounts"
		        submitCopy="Create"
		        inputs={[
		        	{
		        		key: 'percentage',
		        		type: 'number',
		        		label: 'Discount %',
		        	},
		        	{
		        		key: 'amount',
		        		type: 'number',
		        		label: 'Discount $',
		        	},
		        	{
		        		key: 'code',
		        		type: 'text',
		        		label: 'Code',
		        	}
		        ]}
		        onSubmit={onSubmit}
		    >
		    </Form>
		</div>
	);
};

export default withStuff(NewDiscount, { api: true });