import React from 'react';
import BtnSpinner from './btn_spinner.js';

const Submit = ({ copy, loading, style, onClick, className }) => {
    if (loading) return <BtnSpinner style={style} />;

    return(
        <input
        	onClick={onClick}
            className={className || "btn-primary"}
            type="submit"
            value={copy}
            style={style}
        />
    );
}

export default Submit;