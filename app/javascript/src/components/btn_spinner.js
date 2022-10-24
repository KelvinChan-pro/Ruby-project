import React from 'react';
import src from '../assets/spinner.svg';


const BtnSpinner = ({ style }) => (
    <button className="spinner-bg" style={style} >
        <img 
            src={src}
            alt="loading"
            width="24px"
        />
    </button>
);

export default BtnSpinner;