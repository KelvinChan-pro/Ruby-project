import React, { useState} from 'react';
import { withStuff } from '../hocs';
import { Form } from '../components';
import { newMarinaParams } from '../params';

const NewMarina = ({ api, state }) => {
	return(
	    <div className="container" style={{marginTop: '50px'}} >
	        <a className="back-btn" href="/admin/marinas" style={{marginBottom: '15px', display: 'block'}} >
	            <i className="fal fa-chevron-left" /> Back
	        </a>
	        <h2>New Marina</h2>
	        <Form
	            type="update_boat"
	            submitCopy="Save"
	            inputs={newMarinaParams(state.lakes)}
	            onSubmit={params => api.createMarina(params)}
	        >
	        </Form>
	    </div>
	);
};

export default withStuff(NewMarina, 
	{ 
		api: true, state: true,
		effect: ({ api }) => api.getMarinas(),
		loader: 'marinas',
	},
);