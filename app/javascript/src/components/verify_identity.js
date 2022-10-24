import React from 'react';

const VerifyIdentity = ({ link }) => {
    return(
        <div>
            <div className="verify-identity">
                <div className="body-light greyPool">
                    You'll be redirected to stripe to verify the identification information you've provided and accept their terms of service.
                </div>
                {
                    !!link

                    ?   <a href={link} className="btn-primary">
                            Review
                        </a>

                    :   <button className="btn-secondary-teal">
                            <i className="fas fa-check-circle" style={{marginRight: '10px'}} />
                            Verification Pending
                        </button>
                }
            </div>
            <div style={{marginTop: '30px'}} className="body-light greyPool">Thank you for submitting! Once your verification is approved, we’ll send you a notification.</div>
        </div>
    );
};

export default VerifyIdentity;
