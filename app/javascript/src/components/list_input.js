import React, { useState, useRef, useEffect } from 'react';

const ListInput = ({ _ref_, name, placeholder, defaultValue=[], children, bool=false }) => {
	const [list, setList] = useState(defaultValue);
	const input = useRef();

	const Item = ({ value }) => {

		return(
			<div className="list-input">
				<div>{value}</div>
				<i className="fal fa-trash-can" />
			</div>
		);
	};

	function addItem(e) {
		e.preventDefault();
        if (!!input.current.value) {
    		setList(prev => {
    			prev.push(input.current.value);
    			input.current.value = '';
    			return Array.from(prev);
    		});
        };
		return false;
	};

	function removeItem(i) {
		return () => {
			setList(prev => {
				prev.splice(i, 1);
				return Array.from(prev);
			});
		};
	}


	return(
		<div style={{margin: '30px 0px'}} >
			{list.map((value, i) =>
				<div key={i}>
                    {
                        !!children

                        ?   children(value, removeItem(i))

                        :   <div className="list-input flex">
                                <div className="li-value subheader-light greyPool flex-grow">{value}</div>
                                <i className="fal fa-trash-alt" onClick={removeItem(i)} />
                            </div>
                    }
                </div>
			)}
			<div className="list-input-new flex">
				<input
                    ref={input}
                    placeholder={placeholder}
                    className="flex-grow"
                />
				<button onClick={addItem} >Add</button>
			</div>
			<input type='hidden' name={name} ref={_ref_} value={list} />
		</div>
	);
};

export default ListInput;
