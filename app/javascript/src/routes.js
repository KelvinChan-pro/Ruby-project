import React, { useContext, Fragment } from 'react';
import * as Pages from "./pages";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { 
	PrivateRoute, ErrorBox, NavBar, 
	Footer, MobileNav, MobileFooterNav, 
	LoginModal, StripeBanner, DiscountPopup, ScrollButton
} from './components';
import Context from './context';
import Logo from './assets/mobile_nav_logo.png';

const routes = [
	{
		path: '/',
		page: 'Home',
		preonboard: true,
		mobileNavContainer: false,
	},
	{
		path: '/login',
		page: 'Home',
		preonboard: true,
	},
	{
		path: '/how_it_works',
		page: 'HowItWorks',
		preonboard: true,
	},
	{
		path: '/change_password/:token',
		page: 'ChangePassword',
		preonboard: true,
		nav: false,
		mobileNav: false,
		footer: false ,
		mobileFooter: false,
	},
	{
		path: '/verify_email/:token',
		page: 'ConfirmEmail',
		preonboard: true,
		nav: false,
		mobileNav: false,
		footer: false ,
		mobileFooter: false,
	},
	{
		path: '/s',
		page: 'Search',
		preonboard: true,
		mobileNav: false,
	},
	{
		path: '/saved',
		page: 'SavedListings',
		preonboard: true,
	},
	{
		path: '/boats/:id',
		page: 'Boat',
		preonboard: true,
		mobileNav: false,
		mobileFooter: false,
	},
	{
		path: '/profile',
		page: 'Profile',
		private: true,
		preonboard: true,
	},
	{
		path: '/profile/:id',
		page: 'Profile',
		private: false,
		preonboard: true,
	},
	{
		path: '/nav/profile',
		page: 'ProfileNav',
		private: true,
		preonboard: true,
	},
	{
		path: '/account',
		page: 'Account',
		private: true,
		preonboard: true,
	},
	{
		path: '/account/:id',
		page: 'Account',
		private: true,
		preonboard: true,
	},
	{
		path: '/admin/users/:id/',
		page: 'User',
		private: true,
		preonboard: true,
	},
	{
		path: '/admin/:tab?',
		page: 'Admin',
		private: true,
		preonboard: true,
	},
	{
		path: '/admin/lakes/new',
		page: 'Lake',
		private: true,
		preonboard: true,
	},
	{
		path: '/admin/lakes/:id',
		page: 'Lake',
		private: true,
		preonboard: true,
	},
	{
		path: '/admin/marinas/new',
		page: 'NewMarina',
		private: true,
		preonboard: true,
	},
	{
		path: '/admin/marinas/:id',
		page: 'Marina',
		private: true,
		preonboard: true,
	},
	{
		path: '/admin/discounts/new',
		page: 'NewDiscount',
		private: true,
		preonboard: true,
	},
	{
		path: '/bookings/:id/new',
		page: 'NewBooking',
		private: true,
		preonboard: true,
	},
	{
		path: '/bookings/:id',
		page: 'Booking',
		private: true,
		preonboard: true,
	},
	{
		path: '/bookings',
		page: 'Bookings',
		private: true,
		preonboard: true,
	},
	{
		path: '/share-your-boat',
		page: 'ShareYourBoat',
	},
	{
		path: '/pro-hopper',
		page: 'ProHopper',
	},
	{
		path: '/onboard_completed/:id',
		page: 'OnboardCompleted',
		private: true,
		preonboard: true,
	},
	{
		path: '/manage-boat/:tab?',
		page: 'EditBoat',
		private: true,
	},
	{
		path: '/boats/:id/edit/:tab?',
		page: 'EditBoat',
		private: true,
	},
	{
		path: '/ambassador',
		page: 'Ambassador',
		private: true,
		preonboard: true,
	},
	{
		path: '/cancel_booking/:id',
		page: 'ConfirmCancel',
		private: true,
		preonboard: true,
	},
	{
		path: '/faq',
		page: 'FAQ',
		preonboard: true,
	},
	{
		path: '/bookings/:id/reply',
		page: 'Reply',
		preonboard: true,
	},
	{
		path: "/message",
		page: 'Messaging',
		private: true,
		preonboard: false,
	}
];

const buildComponent = ({ path, page, nav=true, mobileNav=true, mobileNavContainer=true, footer=true, mobileFooter=true, stripeBanner=true }) => {
	const Page = Pages[page];
	return (props) => {
		
		const { state, api } = useContext(Context);

		return(
			<div id="main">
				{mobileNav && <Route exact component={MobileNav} />}
				{nav && <Route exact component={NavBar} />}
				{mobileNav && mobileNavContainer && <div className="mobile-nav-container mobile-only" ><a href='/'><img src={Logo} /></a></div>}
				{<ErrorBox error={state.errors.standard} />}
				{<LoginModal show={state.loginModal} onClose={api.closeLoginModal} />}
				{stripeBanner && <StripeBanner />}
				<ScrollButton />
				<Page {...props} />
				{mobileFooter && <Route exact component={MobileFooterNav} />}
				{page !== 'Messaging' && footer && <Footer />}
			</div>
		);
	};
};

const buildRoutes = (routes) => {

	routes = routes.map(route => {
		route.Component = buildComponent(route);
		return route;
	});

	const [preonboard, postonboard] = routes.reduce((mem, route) => {
		route.preonboard ? mem[0].push(route) : mem[1].push(route);
		return mem;
	}, [[],[]]);

	const Onboarding = buildComponent({ 
		page: 'Onboard', 
		nav: false,
		mobileNav: false,
		footer: false ,
		mobileFooter: false,
		stripeBanner: false,
	});

	const _404_ = buildComponent({ 
		page: '_404_',
		stripeBanner: false,
	});

	return () => {
		const { state } = useContext(Context);

		console.log("State => ", state.user);

		return(
			<Router>
				<Switch>
					{preonboard.map((route, i) =>
						route.private

						?   <PrivateRoute key={i} path={route.path} exact component={route.Component} />

						:   <Route key={i} path={route.path} exact component={route.Component} />
					)}
					{state.user.requires_onboarding && <Route component={Onboarding} />}
					{postonboard.map((route, i) =>
						route.private

						?   <PrivateRoute key={i} path={route.path} exact component={route.Component} />

						:   <Route key={i} path={route.path} exact component={route.Component} />
					)}
					<Route component={_404_} />
				</Switch>
			</Router>
		)
	};
}

export default buildRoutes(routes);
