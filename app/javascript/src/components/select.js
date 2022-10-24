import React from 'react';

const Select = ({ _ref_, style, onChange, options, defaultValue, name, placeholder }) => {

	function buildOptions() {
	    if (Array.isArray(options)) {
	        return options.map((option, i) =>
	            <option key={i} selected={defaultValue == option}>
	                {option}
	            </option>
	        )
	    } else {
	        return Object.keys(options).map((key, i) =>
	            <option key={i} value={key} selected={defaultValue == key}>
	                {options[key]}
	            </option>
	        )
	    };
	}

	return(
		<select 
			style={style}
		    ref={_ref_} 
		    onChange={onChange}
		    name={name}
		>
		    <option disabled selected={!defaultValue} >{placeholder}</option>
		    {buildOptions()}
		</select>
	);
};

export default Select;