import React, { useState } from 'react';

const SearchSelect = ({ label, name, key, defaultValue, options={}, onChange, placeholder }) => {
	const [show, setShow] = useState();
	const [value, setValue] = useState(defaultValue);
	const [term, setTerm] = useState(options[defaultValue]);

	function buildOnClick(value, copy=null) {
		return () => {
			setValue(value);
			setTerm(copy || value);
			setShow(false);
			onChange && onChange(value);
		};
	};

	function buildOptions() {
	    if (Array.isArray(options)) {
	        return options.filter(match).map((option, i) =>
	            <div key={i} onClick={buildOnClick(option)} >
	                {option}
	            </div>
	        )
	    } else {
	        return Object.keys(options).filter(key => match(options[key])).map((key, i) =>
	            <div key={i} onClick={buildOnClick(key, options[key])} >
	                {options[key]}
	            </div>
	        )
	    };
	};

	function match(option) {
		if (term && option) {
			return option.toLowerCase().includes(term.toLowerCase());
		} else {
			return true;
		};

	}

	return(
		<div className="input-primary search-select" >
			{label && <label>{label}</label>}
			<input
				placeholder={placeholder}
				onClick={() => setShow(true)}
				onChange={({ target }) => setTerm(target.value)}
				value={term}
			/>
			<input
				type="hidden"
				name={name || key}
				value={value}
			/>
			{
				show &&

				<div className="search-select-options">
					{buildOptions(options)}
				</div>
			}
		</div>
	);
};

export default SearchSelect;