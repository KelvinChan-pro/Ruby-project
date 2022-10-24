import React, { useContext, useState } from 'react';
import { PasswordConditions, Form } from '../components';
import Context from '../context';
import { userParams } from '../params';

const SignUp = ({ handleSubmit }) => {
    const { api } = useContext(Context);

    const [password, setPassword] = useState('');
    const [passwordCopy, setPasswordCopy] = useState('');

    async function onSubmit(params) {
        const [pass, copy] =  PasswordConditions.allConditionsPass(password, passwordCopy);
        if (pass) {
            params.password = password;
            const res = await api.createUser(params);
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
                handleSubmit()
                const channelsOfUser = await api.connectUserForGetStreamAndUnreadMessages(user);
                console.log("Connected User Check on Sign up => ", channelsOfUser);
            };
        } else {
            api.setError('login', copy);
        }
    }

    return(
        <Form
            onSubmit={onSubmit}
            submitCopy="Sign up"
            type="login"
            col="12"
            inputs={[
                {
                    placeholder: 'First Name',
                    type: 'text',
                    key: 'first_name',
                },
                {
                    placeholder: 'Last Name',
                    type: 'text',
                    key: 'last_name',
                },
                {
                    placeholder: 'Email',
                    type: 'email',
                    key: 'email',
                }
            ]}
        >
            <div className="col-md-12">
                <div className="input-primary">
                    <input
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        type="password"
                        placeholder="Create Password"
                    />
                </div>
                <div className="input-primary">
                    <input
                        value={passwordCopy}
                        onChange={({ target }) => setPasswordCopy(target.value)}
                        type="password"
                        placeholder="Confirm Password"
                    />
                </div>
                <PasswordConditions password={password} passwordCopy={passwordCopy} />
            </div>
        </Form>
    )
}

export default SignUp;
