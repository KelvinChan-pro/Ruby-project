import React, { useState, useRef, useEffect } from 'react';

const BoolListInput = ({ _ref_, name, placeholder, defaultValue={}, children, bool=false, onChange }) => {
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
        if (!!input.current.value && (!onChange || onChange(input.current.value))) {
            setList(prev => {
                const np = {};
                np[input.current.value] = true;
                input.current.value = '';
                return { ...prev, ...np };
            });
        };
        return false;
    };

    function removeItem(key) {
        return () => {
            setList(prev => {
                delete prev[key];
                return { ...prev };
            });
        };
    }

    function setChecked(i) {
        return (checked) => {
            setList(prev => {
                const np = {};
                const key = Object.keys(prev)[i];
                np[key] = checked;
                return { ...prev, ...np };
            });
        }
    }


    return(
        <div style={{margin: '30px 0px'}} >
            {Object.keys(list).map((key, i) =>
                <div key={i}>
                    {children(key, removeItem(key), list[key], setChecked(i))}
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
            <input type='hidden' name={name} ref={_ref_} value={JSON.stringify(list)} />
        </div>
    );
};

export default BoolListInput;
