import React, { useContext, useState, useEffect } from 'react';
import Context from '../context';

const SearchInput = ({ query, _ref_, defaultValue='', defaultId }) => {
    const { api, state } = useContext(Context);
    const [firstLoad, setFirstLoad] = useState(true);
    const [term, setTerm] = useState(defaultValue);
    const [selected, setSelected] = useState(false);
    const [value, setValue] = useState(defaultId);

    useEffect(() => {
        if (!firstLoad && !selected) {
            api[query](term);
        };
    }, [term]);

    useEffect(() => {
        if (selected) {
            api.store.reduce({
                type: 'search_results',
                searchType: query,
                results: {},
            });
            setSelected(false);
        };
    }, [selected]);

    const results = state.searchResults[query] || {};

    return(
        <div className="search-input" >
            <input 
                value={term} 
                onChange={({ target }) => {
                    setFirstLoad(false);
                    setTerm(target.value);
                }}
            />
            <div className="search-results" >
                {Object.keys(results).map((key, i) =>
                    <div 
                        className="search-result" 
                        key={i} 
                        onClick={() => {
                            setValue(key);
                            setSelected(true);
                            setTerm(results[key]);
                        }} 
                    >
                        {results[key]}
                    </div>
                )}
            </div>
            <input
                type="hidden"
                ref={_ref_}
                value={value}
            />
        </div>
    );
};

export default SearchInput;