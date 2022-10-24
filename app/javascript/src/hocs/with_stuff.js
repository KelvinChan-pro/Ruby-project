import React, { useContext, useEffect } from 'react';
import { Loader, ErrorBox } from '../components';
import Context from '../context';
import { parseQuery } from '../utils';


const withStuff = (Component, config) => {
	return (props) => {
		const { state, api } = useContext(Context);
		const newProps = { ...props };
		if (config.state) newProps.state = state;
		if (config.api) newProps.api = api;
		if (config.query) newProps.query = parseQuery(props.location.search);

		useEffect(() => {
			if (config.effect)
				config.effect(newProps);
		}, []);

		if (config.loader) {
			const loading = state.loading[config.loader];
			const error = state.errors[config.loader];

			if (loading) return(
				<div className="container">
					<Loader />
				</div>
			);

			if (error) return(
				<div className="container">
					<ErrorBox error={error} {...config.error} />
				</div>
			);
		};

		return <Component {...newProps} />;

	};
};

export default withStuff;