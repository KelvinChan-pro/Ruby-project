import React, { useContext } from 'react';
import Context from '../context';

const SuccessBox = ({ success }) => {
    const { api } = useContext(Context);

    if (success) return(
        <div className="card card-success">
            <div className="card-header-wrapper">
                <div className="card-text card-text-icon">
                    <i className="fas fa-shield-check"></i>
                </div>
                <div className="flex-grow">{success}</div>
                <i className="fal fa-times greyPool pointer" onClick={api.clearSuccess} />
            </div>
        </div>
    );

    return <div></div>;
}

export default SuccessBox;