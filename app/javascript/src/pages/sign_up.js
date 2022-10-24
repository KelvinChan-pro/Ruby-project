import React, { useContext, useState } from 'react';
import { PasswordConditions, Form } from '../components';
import Context from '../context';
import Logo from '../assets/logo.png';
import { userParams } from '../params';

const SignUp = ({ match }) => {
    
    const { token } = match.params;
    const { api } = useContext(Context);

    const [password, setPassword] = useState('');
    const [passwordCopy, setPasswordCopy] = useState('');

    async function onSubmit(params) {        
        if (PasswordConditions.allConditionsPass(password, passwordCopy)) {
            params.password = password;
            const res = api.createUser(params);
            if(res) {
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
                const channelsOfUser = await api.connectUserForGetStreamAndUnreadMessages(user);
                console.log("Response for Signup => ", channelsOfUser);
            }
        }
    }

    return(
        <div className="auth-container" >
            <img 
                className="auth-logo"
                src={Logo} 
                alt="lake hop logo" 
            />
            <Form
                onSubmit={onSubmit}
                submitCopy="Sign up"
                type="login"
                col="12"
                inputs={[{
                    label: 'Email',
                    placeholder: 'your@email.com',
                    type: 'email',
                    key: 'email',
                }]}
            >
                <div className="col-md-12">
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
                    <PasswordConditions password={password} passwordCopy={passwordCopy} />
                </div>
            </Form>
        </div>
    )
}

export default SignUp;