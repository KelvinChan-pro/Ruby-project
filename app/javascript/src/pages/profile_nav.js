import React from 'react';
import { withStuff } from '../hocs';

const ProfileNav = ({ api, state }) => (
	<div className="container profile-nav">
		<a href="/profile" className="pn-profile pn-link" >
		    <img src={state.user.profile_picture_url} />
		    <div>
		        <div className="subheader-heavy" >
		            {state.user.full_name}
		        </div>
		        <div className="very-small-light greyPool">View my profile</div>
		    </div>
		</a>
		<a href="#" className="pn-link subheader-light pn-switch" onClick={() => { api.setHosting(true); window.location.href = '/';}} >
            <i className="fal fa-exchange" />
            <span>Switch to hosting</span>
        </a>
		<a href="/account" className="pn-link subheader-light" >
            <i className="fal fa-credit-card" />
            <span>Account</span>
        </a>
	    <a className="pn-link pn-logout redPool" onClick={() => {
	        api.signOut();
	        window.location.href = '/';
	    }}>
	        <i className="fal fa-sign-out" />
	        <span>Sign Out</span>
	    </a>
	</div>
);

export default withStuff(ProfileNav, { api: true, state: true });
