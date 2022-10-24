import React, { useContext } from 'react';
import Context from '../context';

const MobileFooterNav = ({ location }) => {
	const { state } = useContext(Context);

	function current(path, match=null) {
	    if (path == '/') {
	        return location.pathname ==  path;
	    } else {
	        return location.pathname.includes(match || path);
	    }
	}

	if (state.hosting) return <div/>;

	return(
		<div className="mobile-footer-nav mobile-flex-around">
			<a href="/" className={`mfn-tab small-heavy ${current("/") ? "mfn-current" : ""}`}>
				<i className="fal fa-house" />
				<div>Home</div>
			</a>
			<a href="/bookings" className={`mfn-tab small-heavy ${current("/bookings") ? "mfn-current" : ""}`}>
				<i className="fal fa-calendar-check" />
				<div>Bookings</div>
			</a>
			<a href="/saved" className={`mfn-tab small-heavy ${current("/saved") ? "mfn-current" : ""}`}>
				<i className="fal fa-heart" />
				<div>Saved</div>
			</a>
			<a href="/nav/profile" className={`mfn-tab small-heavy ${current("/profile") ? "mfn-current" : ""}`}>
				<i className="fal fa-user" />
				<div>Profile</div>
			</a>
		</div>
	);
};

export default MobileFooterNav;