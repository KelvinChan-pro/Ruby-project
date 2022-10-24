import React, { useState, useRef, useEffect } from 'react';
import { Modal, LoginForm, ResetPassword, SignUpForm } from '../components';

const LoginModal = (props) => {
	const self = useRef();

	useEffect(() => {

		if (props.show)
			self.current.scrollIntoView();

	}, [ props.show ]);

	function comp(state) {
		switch (state) {
			case 'login':
				return(
					<LoginForm
						toSignUp={toSignUp}
						toResetPassword={toResetPassword}
						onSubmit={props.onClose}
					/>
				);
				break;
			case 'signup':
				return(
					<SignUpForm handleSubmit={toAccountCreated} />
				);
				break;
			case 'resetpassword':
				return(
					<ResetPassword toLogin={toLogin} />
				);
				break;
			case 'accountcreated':
				return(
					<div>
						<i className="fas fa-check-circle big-check" />
						<h2>Account Created</h2>
						<div style={{margin: '20px 0px 20px 0px'}} className="p-copy text-center">Check your email to validate your account and get started.</div>
						<button className="btn-primary" style={{width: '100%', marginBottom: '20px'}} onClick={props.onClose}>Close</button>
					</div>
				);
				break;
		}
	}

	const [state, setState] = useState('login');

	function toLogin() {
		setState('login');
	};

	function toSignUp() {
		setState('signup');
	};

	function toResetPassword() {
		setState('resetpassword');
	};

	function toAccountCreated() {
		setState('accountcreated');
	};

	return(
        <div className="login-modal" ref={self} >
    		<Modal {...props} >
    			{state !== 'accountcreated' && <div className="flex login-tabs">
    				<div className={"login-tab" + (state === 'login' ? " current-lt" : "")} onClick={toLogin} >
    					Log In
    				</div>
    				<div className={"login-tab" + (state === 'signup' ? " current-lt" : "")} onClick={toSignUp}>
    					Sign Up
    				</div>
    			</div>}
    			<div style={{padding: '20px 40px'}} >
    				{comp(state)}
    			</div>
    		</Modal>
        </div>
	);
};

export default LoginModal;
