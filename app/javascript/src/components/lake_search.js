import React, { useState, useEffect } from 'react';
import Context from '../context';
import { MissingLakeModal } from '../components';
import { withStuff } from '../hocs';

const LakeSearch = ({ state, api, onChange, label, placeholder, defaultValue='' }) => {
	const [firstLoad, setFirstLoad] = useState(true);
	const [term, setTerm] = useState(defaultValue);
	const [timeout, saveTimeout] = useState(null);
	const [selected, setSelected] = useState(defaultValue);
	const [show, setShow] = useState(false);

	function clearResults() {
	    api.store.reduce({
	        type: 'set_lakes',
	        lakes: [],
	    });
	}

	function select(name, id) {
		return () => {
			setTerm(name);
			setSelected(name);
			clearResults();
			onChange && onChange(id);
		};
	}
	
	useEffect(() => {
		if (term == '')
			onChange('');

		if (term == '' || selected == term || firstLoad) {
			clearResults();
			return;
		};

        if (timeout) clearTimeout(timeout);

        saveTimeout(
            setTimeout(() => api.searchLakes(term), 500)
        );

	}, [ term ]);

	return(
		<div>
			<MissingLakeModal show={show} onClose={() => setShow(false)} />
			<div className="home-search-input lake-search">
				{label && <label>
					{label}
				</label>}
				<input
					className="search-input"
					placeholder={placeholder}
					value={term} 
					onChange={({ target }) => {
	                    setFirstLoad(false);
	                    setTerm(target.value);
	                }}
				/>
				<div className="lake-results">
					{state.lakes.map((lake, i) =>
						<div 
							className="body-light" 
							key={i} 
							onClick={select(lake.name, lake.id)}
						>
							{lake.name}
						</div>
					)}
					{term && selected != term && <div onClick={() => setShow(true)}><a className="body-light">Don't see your lake?</a></div>}
				</div>
			</div>
		</div>
	);
};

export default withStuff(LakeSearch, { state: true, api: true });
