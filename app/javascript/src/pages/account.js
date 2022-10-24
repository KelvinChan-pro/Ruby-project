import React, { useState, useRef } from 'react';
import { 
    Edit, Form, BankAccount, 
    PasswordConditions, ErrorBox, SuccessBox,
    CheckInput,
} from '../components';
import { userParams, addressParams } from '../params';
import { withStuff } from '../hocs';

const Account = ({ api, state }) => {
    const { user } = state;
    const story = useRef()
    const [editPassword, setEditPassword] = useState(false);
    const [editAccount, setEditAccount] = useState(false);
    const [editAddress, setEditAddress] = useState(false);

    async function updatePassword({ password, passwordCopy }) {
        const [pass, copy] =  PasswordConditions.allConditionsPass(password, passwordCopy);
        if (pass) {
            const res = await api.updateUser(user.id, { password }, false, false, 'update_password');
            setEditPassword(!res);
        } else {
            api.setError('update_password', copy);
        }
    }

    async function updateAccount(params, updateBankAccount) {
        const res = await updateBankAccount(params);
        setEditAccount(!res);
    }

    async function updateAddress(params) {
        const res = await api.updateUser(user.id, params, false, true, 'update_address');
        setEditAddress(!res);
    }

    return(
        <div className="container" style={{marginTop: '50px'}} >
            <div style={{maxWidth: '600px'}}>
                <ErrorBox error={state.errors.update_user} />
                <div className="title-small">Settings</div>
                <div style={{margin: '20px 0px 50px 0px'}}>
                    <CheckInput
                        name="first_guests_discount"
                        defaultValue={user.sms_enabled}
                        checkedIcon="far fa-toggle-on primary"
                        uncheckedIcon="far fa-toggle-off primary"
                        checkStyle={{fontSize: '30px'}}
                        onChange={sms_enabled => api.updateUser(user.id, { sms_enabled })}
                    >
                        <div className="greyPool body-light">SMS Text Notifications</div>
                    </CheckInput>
                </div>
                <div className="title-small">Personal Info</div>
                <Edit
                    label="Full Name"
                    value={user.first_name + ' ' + user.last_name}
                    type="update_user"
                    onUpdate={v => api.updateUser(user.id, { full_name: v }, false, true)}
                />
                <Edit
                    label="Email"
                    value={user.email}
                    type="update_user"
                    onUpdate={v => api.updateUser(user.id, { email: v }, true, true)}
                />
                <Edit
                    label="Date of Birth"
                    value={user.date_of_birth}
                    type="update_user"
                    inputType="date"
                    onUpdate={v => api.updateUser(user.id, { date_of_birth: v }, false, true)}
                />
                <Edit
                    label="Phone Number"
                    value={user.phone_number}
                    type="update_user"
                    onUpdate={v => api.updateUser(user.id, { phone_number: v }, false, true)}
                />
                <Edit
                    label="Social Security Number"
                    value={user.ssn}
                    type="update_user"
                    show={user.ssn ? `*****${user.ssn && user.ssn.slice(-4)}` : 'Not Provided'}
                    onUpdate={v => api.updateUser(user.id, { ssn: v }, false, true)}
                />
                <div style={{marginBottom: '50px'}} />
                <SuccessBox success={state.success.update_address} />
                <div className="title-small">Address</div>
                {
                    editAddress

                    ?   <div>
                            <div className="subheader-heavy link-btn float-right" onClick={() => setEditAddress(false)} >Cancel</div>
                            <Form
                                type="update_address"
                                col="12"
                                onSubmit={updateAddress}
                                submitCopy="Update Address"
                                submitStyle={{marginTop: '20px', width: '160px'}}
                                inputs={addressParams(user)}
                            />
                        </div>

                    :   <div className="edit-card">
                            <div>
                                <div className="subheader-heavy">Address</div>
                                <div className="subheader-light greyPool">{user.full_address || 'Not Provided'}</div>
                            </div>
                            <div className="subheader-heavy link-btn" onClick={() => setEditAddress(true)} >Update</div>
                        </div>
                }
                <div style={{marginBottom: '50px'}} />
                <SuccessBox success={state.success.update_password} />
                <div className="title-small">Login & Security</div>
                {
                    editPassword

                    ?   <div>
                            <div className="subheader-heavy link-btn float-right" onClick={() => setEditPassword(false)} >Cancel</div>
                            <Form
                                type="update_password"
                                col="12"
                                onSubmit={updatePassword}
                                submitCopy="Update Password"
                                submitStyle={{marginTop: '20px', width: '160px'}}
                                inputs={[
                                    {
                                        type: 'password',
                                        label: 'Password',
                                        key: 'password'
                                    },
                                    {
                                        type: 'password',
                                        label: 'Password Copy',
                                        key: 'passwordCopy'
                                    }
                                ]}
                            />
                        </div>

                    :   <div className="edit-card">
                            <div>
                                <div className="subheader-heavy">Password</div>
                            </div>
                            <div className="subheader-heavy link-btn" onClick={() => setEditPassword(true)} >Update</div>
                        </div>
                }
                <div style={{marginBottom: '50px'}} />
                <SuccessBox success={state.success.external_account} />
                <div className="title-small">Payments</div>
                {
                    editAccount

                    ?   <BankAccount>
                            {updateBankAccount =>
                                <div>
                                    <div className="subheader-heavy link-btn float-right" onClick={() => setEditAccount(false)} >Cancel</div>
                                    <Form
                                        type="external_account"
                                        col="12"
                                        onSubmit={(params) => updateAccount(params, updateBankAccount)}
                                        submitCopy="Update Bank Account"
                                        submitStyle={{marginTop: '20px', width: '160px'}}
                                        inputs={[
                                            {
                                                type: 'text',
                                                label: 'Account Holder Name',
                                                key: 'account_holder_name',
                                            },
                                            {
                                                type: 'text',
                                                label: 'Routing Number',
                                                key: 'routing_number',
                                            },
                                            {
                                                type: 'text',
                                                label: 'Confirm Routing Number',
                                                key: 'routing_number_copy',
                                            },
                                            {
                                                type: 'text',
                                                label: 'Account Number',
                                                key: 'account_number',
                                            },
                                            {
                                                type: 'text',
                                                label: 'Confirm Account Number',
                                                key: 'account_number_copy',
                                            },
                                        ]}
                                    />
                                </div>
                            }
                        </BankAccount>
                        
                    :   <div className="edit-card">
                            <div>
                                <div className="subheader-heavy">Bank Information</div>
                            </div>
                            <div className="subheader-heavy link-btn" onClick={() => setEditAccount(true)} >Update</div>
                        </div>
                }
                <div style={{marginBottom: '50px'}} />
            </div>
        </div>
    );
}

export default withStuff(Account, 
    { 
        api: true, state: true,
        effect: ({ api }) => {
            api.setHosting(false, false);
        }, 
    }
);
