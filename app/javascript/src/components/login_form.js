import React, { useContext, useRef } from 'react';
import Context from '../context';
import Logo from '../assets/logo.png';
import { Submit, ErrorBox } from '../components';

const LoginForm = ({ toSignUp, toResetPassword, onSubmit }) => {
    const { api, state } = useContext(Context);
    const email = useRef();
    const password = useRef();

    async function handleSignUp(e) {
        e.preventDefault();
        const res = await api.login({
            email: email.current.value,
            password: password.current.value,
        });
        
        if (res) { 
            const id = localStorage.getItem('id');
            const first_name = localStorage.getItem('first_name');
            const last_name = localStorage.getItem('last_name');
            const email = localStorage.getItem('email');
            const user = {
                id: id,
                first_name: first_name,
                last_name: last_name,
                name: first_name + " " + last_name,
                full_name: first_name + " " + last_name,
                email: email
            }
            onSubmit();
            const channelsOfUser = await api.connectUserForGetStreamAndUnreadMessages(user);
            console.log('test....', channelsOfUser)
        }
    }

    const loading = state.loading.login;
    const error = state.errors.login;

    return(
        <div>
            <ErrorBox error={error} />
            <form 
                style={{
                    width: '100%',
                }}
                onSubmit={handleSignUp} 
            >
                <div className="input-primary">
                    <input ref={email} type="email" placeholder="Email" />
                </div>
                <div className="input-primary">
                    <input ref={password} type="password" placeholder="Password" />
                </div>
                <a
                    href="#"
                    style={{
                        fontSize: '15px',
                        margin: '20px 0px',
                        float: 'right',
                    }}
                    onClick={toResetPassword}
                >
                    Forgot password?
                </a>
                <Submit
                    copy="Login"
                    loading={loading}
                    style={{width: '100%'}}
                />
            </form>
            <div className="no-account-copy">Don't have an account? <span onClick={toSignUp} >Sign up</span></div>
        </div>
    )
}

export default LoginForm;