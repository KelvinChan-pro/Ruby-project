import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Routes from "../src/routes";
import { store } from '../src/store';
import { api } from '../src/api';
import Context from '../src/context';
import 'react-bnb-gallery/dist/style.css'
import 'react-tippy/dist/tippy.css';
import { Loader } from '../src/components';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { parseQuery } from '../src/utils';

// const stripePromise = loadStripe(window.stripe_public_key);

class Root extends Component {
	constructor(props) {
		super(props);
		this.store = store;
		this.state = this.store.state;
		this.store.setStateHandler(this.setState.bind(this));
		this.query = parseQuery(window.location.search);	
		this.google_map_key;
		this.stripe_public_key;
		this.stripePromise;
	}

	componentDidMount() {
		api.getHerokuConfigurations();
		api.setDate(this.query.date);
		api.setAmbassador(this.query.ambassador || localStorage.getItem('ambassador'));
		api.getUser();		
	}

	render() {
		if (this.state.loading.user) return <Loader />;

		this.stripe_public_key = this.state.configs.Stripe_Public_Key;
		this.google_map_key = this.state.configs.Google_Map_Key;
		if(this.stripe_public_key && this.google_map_key) {
			// '#{ENV["STRIPE_PUBLIC_KEY"]}'
			this.stripePromise = loadStripe(`${this.stripe_public_key}`)

			return (
				<Context.Provider value={{ api, state: this.state, google_key: this.google_map_key }} >
					<Elements stripe={this.stripePromise}>
						<Routes />
					</Elements>
				</Context.Provider>
			);
		} else return <Loader />;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	ReactDOM.render(
		<Root />,
		document.getElementById('root'),
	)
});
