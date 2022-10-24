import React from 'react';
import Spinner from '../assets/animation.gif';

const Loader = () => (
	<div className="container">
	    <div style={{ textAlign: 'center' }} className="spinner" >
	        <img src={Spinner} alt="loading" />
	    </div>
	</div>
);

export default Loader;