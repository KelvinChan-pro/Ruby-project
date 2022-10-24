import React, { useState, Fragment } from 'react';

const Toggler = ({ Head, Body }) => {
	const [show, setShow] = useState(false);

	return(
		<Fragment>
			<div onClick={() => setShow(prev => !prev)}>
				<Head show={show} />
			</div>
			{show && <Body/>}
		</Fragment>
	);
};

export default Toggler;