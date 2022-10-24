import React, { useContext, useState } from 'react';
import { PasswordConditions } from '../components'
import Context from '../context';
import Logo from '../assets/logo.png';
import { Submit, ErrorBox } from '../components';
// import '../style/auth.css';


const ChangePassword = ({ match }) => {
    const token = match.params.token;    
    const { api, state } = useContext(Context);

    const [password, setPassword] = useState('');
    const [passwordCopy, setPasswordCopy] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        const [pass, copy] =  PasswordConditions.allConditionsPass(password, passwordCopy);
        if (pass) {

            const res = await api.changePassword({
                password, token
            });
            
            if (res.success) window.location.href = "/";
            
        } else {

            api.setError('login', copy);

        }
    }

    const loading = state.loading.login;
    const error = state.errors.login;

    return(
        <div className="auth-container" >
            <img 
                className="auth-logo"
                src={Logo} 
                alt="[app name] logo" 
            />
            <ErrorBox error={error} />
            <form 
                style={{
                    width: '100%',
                    margin: 'auto',
                }}
                onSubmit={handleSubmit} 
            >
                <div className="input-primary">
                    <label>New Password</label>
                    <input 
                        value={password} 
                        onChange={({ target }) => setPassword(target.value)} 
                        type="password"
                    />
                </div>
                <div className="input-primary">
                    <label>Verify Password</label>
                    <input 
                        value={passwordCopy} 
                        onChange={({ target }) => setPasswordCopy(target.value)} 
                        type="password"
                    />
                </div>
                <PasswordConditions 
                    password={password} 
                    passwordCopy={passwordCopy} 
                />
                <div style={{
                    marginTop: '15px',
                }}>
                    <Submit 
                        copy="Reset" 
                        loading={loading} 
                        style={{
                            float: 'right',
                        }}
                    />
                </div>
            </form>
        </div>
    )
}

export default ChangePassword;