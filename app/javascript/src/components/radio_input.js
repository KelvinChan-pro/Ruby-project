import React, { useState } from 'react';
import { isFunction } from '../utils';

const RadioInput = ({ _ref_, onChange, ...input }) => {
	const [value, setValue] = useState(input.defaultValue);

	function parseOptions(options, render) {
		if (Array.isArray(options)) {
			return options.map((option, i) => render(option, option, i));
		} else {
			return Object.keys(options).map((key, i) => {
				if (isFunction(options[key])) {
					const func = options[key];
					return render(func(), key, i);
				} else {
					return render(options[key], key, i);
				};
			});
		}
	};

	return(
		<div>
			<input name={input.name} type="hidden" ref={_ref_} value={value} />
			{parseOptions(input.options, (n, v, i) =>
				<div className="radio-option flex body-light" onClick={() => { onChange && onChange(v); setValue(v); }} key={i} >
					<i className={`${v === value ? 'fas' : 'far'} fa-circle radio-icon ${v === value ? 'selected-radio' : ''}`} />
					{n}
				</div>
			)}
		</div>
	);
};

export default RadioInput;
