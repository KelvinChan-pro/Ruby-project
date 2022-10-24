import React from 'react';
const numbers = [1,2,3,4,5,6,7,8,9];
const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
const caps = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

const conditions = [
    {
        condition: ({ password }) => password.length > 7,
        copy: '8+ Characters',
        error: 'Password must be at least 8 characters long.',
    },
    {
        condition: ({ password }) => numbers.some((n) => password.includes(n)),
        copy: '1 Number',
        error: 'Password must contain at least one number.',
    },
    {
        condition: ({ password }) => letters.some((n) => password.includes(n)),
        copy: '1 Letter',
        error: 'Password must contain at least 1 lettter.',
    },
    {
        condition: ({ password }) => caps.some((n) => password.includes(n)),
        copy: '1 Capital Letters',
        error: 'Password must contain at least 1 capital letter.'
    },
    {
        condition: ({ password, passwordCopy }) => password.length > 0 && password === passwordCopy,
        copy: 'Passwords Match',
        error: 'Passwords do not match.',
    }
];

const Conditional = ({ condition, copy }) => (
    condition 
        ?   <div
                className="password-condition"
            >
                <i className="far fa-check icon greenPool"/>
                <span>{copy}</span>
            </div>

        :   <div 
                className="password-condition"
            >
                <i className="far fa-times icon redPool"/>
                <span>{copy}</span>
            </div>
);

const PasswordConditions = ({ password, passwordCopy }) => (
    <div>
        {
            conditions.map((condition, i) => 
                <Conditional 
                    key={i}
                    copy={condition.copy} 
                    condition={condition.condition({password, passwordCopy})} 
                />
            )
        }
    </div>
);

function allConditionsPass(password, passwordCopy) {
    const i = conditions.findIndex(({ condition }) => !condition({ password, passwordCopy }));
    if (i >= 0) {
        return [false, conditions[i].error];
    } else {
        return [true, null];
    }
}

PasswordConditions.allConditionsPass = allConditionsPass;

export default PasswordConditions;