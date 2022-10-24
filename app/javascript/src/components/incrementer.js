import React, { useState } from 'react';

const Incrementer = ({ defaultValue=0, name }) => {
	const [value, setValue] = useState(parseInt(defaultValue));

	return(
		<div className="flex-between incrementer">
			<i className="fal fa-minus-circle" onClick={() => setValue(prev => prev == 0 ? 0 : prev - 1)} />
			<div className="title-small">{value}</div>
			<i className="fal fa-plus-circle" onClick={() => setValue(prev => prev + 1)} />
			<input name={name} type="hidden" value={value} />
		</div>
	);
};

export default Incrementer;