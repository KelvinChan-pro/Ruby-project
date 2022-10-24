import React from 'react';
import Image from '../assets/404.png';

const _404_ = () => (
    <div className="container four-zero-four" style={{margin: '50px auto'}} >
       	<div className="flex">
       		<div>
       			<img src={Image} className="mobile-only" alt="404 image" style={{ maxWidth: '400px'}} />
       			<h2>Shoot! Something went wrong.</h2>
       			<div className="subheader-heavy">
       				The page you’re looking for might have been removed, have it’s name changed or is temporarily unavailable.
       			</div>
       			<button onClick={() => window.history.back()} style={{marginTop: '25px', width: '150px'}} className="btn-primary">Go back</button>
       		</div>
       		<img src={Image} className="non-mobile-only" alt="404 image" style={{ maxWidth: '600px', marginLeft: '40px'}} />
       	</div>
    </div>
);

export default _404_;