import React, { useRef, useContext } from 'react';
import {
    ErrorBox,
    SuccessBox,
    Submit,
    Inputs,
} from '.';
import Context from '../context';

const Form = ({ inputs=[], onSubmit, submitCopy, submitStyle, type, col="12", children, bottomInputs=[] }) => {
    const { api, state } = useContext(Context);
    const refs = inputs.concat(bottomInputs).reduce((mem, { key }) => {
        mem[key] = useRef();
        return mem;
    }, {});

    function handleSubmit(e) {
        e.preventDefault();

        if (typeof onSubmit == "string")
            onSubmit = api[onSubmit];

        onSubmit(Object.keys(refs).reduce((mem, key) => {
            mem[key] = refs[key].current.value;
            return mem;
        }, {}));
    }

    function renderInputs(inputs) {
        inputs = inputs.map(input => {
            input._ref_ = refs[input.key];
            return input;
        });
        return <Inputs inputs={inputs} col={col} />;
    }



    const loading = state.loading[type];
    const error = state.errors[type];
    const success = state.success[type];

    return(
        <div className="form">
            <form onSubmit={handleSubmit} >
                <ErrorBox error={error} />
                <SuccessBox success={success} />
                {renderInputs(inputs)}
                <div className="row">
                  {children}
                </div>
                {renderInputs(bottomInputs)}
                <Submit
                    copy={submitCopy}
                    loading={loading}
                    style={submitStyle || {marginTop: '20px', width: '100%'}}
                />
            </form>
        </div>
    );
};

export default Form;
