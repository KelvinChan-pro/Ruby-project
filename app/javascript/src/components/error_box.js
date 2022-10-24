import React, { useContext, useRef, useEffect } from 'react';
import Context from '../context';

const ErrorBox = ({ error, clearable=true }) => {
    const ths = useRef();
    const { api } = useContext(Context);

    useEffect(() => {
        ths.current && ths.current.scrollIntoView();
    }, [ error ]);

    if (error) return(
        <div className="card card-error" ref={ths} >
            <div className="card-header-wrapper">
                <div className="card-text card-text-icon">
                    <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div className="flex-grow">{error}</div>
                {clearable && <i className="fal fa-times greyPool pointer" onClick={api.clearErrors} />}
            </div>
        </div>
    );

    return <div></div>;
}

export default ErrorBox;
