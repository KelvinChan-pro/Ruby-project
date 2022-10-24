import React from 'react';
import { 
    SearchInput, 
    InfoTooltip,
    Select,
    RadioInput,
} from '.';

const Inputs = ({ inputs, col="12", style }) => {

	function buildInputGroup(input, i) {
	    return(
	    	<div className={`col-md-${input.col || col} col-xs-12`} key={i} style={input.style} >
		        <div className="input-primary">
		            {input.label && <label>
		                {icon(input.icon)}
		                {input.label}
		                {info(input.info)}
		            </label>}
		            {buildInput(input)}
		        </div>
		    </div>
	    );
	};

	function buildInput(input) {
	    if (input.type === 'search') {
	        return <SearchInput {...input} _ref_={input._ref_} />;
	    } else if (input.type === 'select') {
	        return(
	            <Select
	                _ref_={input._ref_}
	                {...input}
	            />
	        );
	    } else if (input.type === 'radio') {
	        return <RadioInput {...input} _ref_={input._ref_} />;
	    } else if (input.type === 'textarea') {
	    	return(
	    		<textarea
		    		name={input.name || input.key}
		    		placeholder={input.placeholder}
		    		rows={input.rows}
		    		defaultValue={input.defaultValue}
		    		ref={input._ref_}
	    		/>
	    	);
		} else {
	        return(
	            <input
	                name={input.name || input.key}
	                ref={input._ref_} 
	                type={input.type} 
	                defaultValue={input.defaultValue}
	                onChange={input.onChange}
	                placeholder={input.placeholder}
	            />
	        );
	    }
	}

	function icon(i) {
	    if (i) return(
	        <span>
	           <i className={i} />
	           &nbsp;&nbsp;
	        </span>
	    );
	}

	function info(i) {
	    if (i) {
	        return(
	            <InfoTooltip copy={i} pad={true} />
	        );
	    }
	}

	return(
		<div className="row" style={style} >
			{inputs.map((input, i) => buildInputGroup(input, i))}
		</div>
	);

};

export default Inputs;