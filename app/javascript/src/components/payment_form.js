import React, { useState, useRef, Fragment } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ErrorBox, SuccessBox, Submit, PaymentCards } from '../components';
import { withStuff } from '../hocs';

const PaymentForm = ({ state, api, onSubmit, clientSecret, _ref_, paymentMethods=[] }) => {
    const stripe = useStripe();
    const elements = useElements();
    const paymentMethod = useRef();
    const [loading, setLoading] = useState(false);
    const [localError, setError] = useState(false);
    const [newCard, setNewCard] = useState(!paymentMethods.length)
    const error = state.errors.payment_method;
    const success = state.success.payment_method;

    async function handleSubmit(e) {
        e.preventDefault();
        setError(false);
        setLoading(true);
        api.setLoading('payment_form');
        if (!stripe || !elements) return;

        let res;

        if (newCard) {
            // res = await stripe.confirmCardPayment(clientSecret);
            const cardElement = elements.getElement(CardElement);

            res = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

        } else {

            res = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.current.value,
            });

        }
        
        setLoading(false);
        api.stopLoading('payment_form');

        if (res.error) {
            console.log(res);
            setError(res.error.message);
        } else {
            onSubmit(res);
            
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <ErrorBox error={localError || error} />
            <SuccessBox success={success} />
            {paymentMethods.length > 0 && 
                <Fragment>
                    <PaymentCards 
                        _ref_={paymentMethod}
                        paymentMethods={paymentMethods} 
                    />
                    <div style={{marginTop: '15px'}} className="link-btn" onClick={() => setNewCard(prev => !prev)}>
                        {newCard ? 'Cancel' : 'Pay with a new card'}
                    </div>
                </Fragment>
            }
            {newCard &&
                <div className="input-primary">
                    <CardElement 
                        className="payment-card-form" 
                        options={{
                            style: {
                                base: {
                                    fontWeight: '400',
                                    fontSize: '15px',
                                    lineHeight: '22px'
                                }
                            }
                        }}
                    />
                </div>
            }
            <div className="text-right" >
                {
                    _ref_

                    ?   <input type="submit" style={{display: 'none'}} ref={_ref_} />

                    :   <Submit
                            copy="Submit"
                            loading={loading}
                            style={{marginTop: '10px'}}
                        />
                }
            </div>
        </form>
    );
};

export default withStuff(PaymentForm, { state: true, api: true });
