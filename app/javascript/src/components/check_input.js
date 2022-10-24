import React,{ useState, useEffect } from 'react';

const CheckInput = ({ _ref_, name, copy, children, defaultValue=false, forceCheck=false, controlled=false, onClick, checkedIcon="fas fa-check-square", uncheckedIcon="fal fa-square greyPool", checkChild=false, checkStyle, onChange, style }) => {
	const [checked, setChecked] = useState(defaultValue);

	if (forceCheck || controlled) useEffect(() => {
		setChecked(defaultValue);
	}, [ defaultValue ]);

	function buildOnClick(v) {
		return () => {
			if (!controlled) {
				setChecked(v);
				onChange && onChange(v);
			};
		};
	}

	return(
		<div className="flex" onClick={onClick} style={style} >
			{
				!!children && checkChild

                ?   children(checked, setChecked)

                :   checked

    				? 	<i className={`${checkedIcon} primaryPool check-input`} onClick={buildOnClick(false)} style={checkStyle} />

    				: 	<i className={`${uncheckedIcon} check-input`} onClick={buildOnClick(true)} style={checkStyle} />
			}
			{!checkChild && children || copy}
			<input type="hidden" name={name} ref={_ref_} value={checked ? 1 : 0} />
		</div>
	);
};

export default CheckInput;
