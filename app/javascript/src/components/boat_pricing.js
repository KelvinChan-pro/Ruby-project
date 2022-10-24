import React, { useState} from 'react';
import { CheckboxList, CheckInput, Select } from '../components';
import { toUSD } from '../utils';

const BoatPricing = (boat) => {
    const [price, setPrice] = useState(boat.price);

	return(
		<div style={{marginBottom: '15px'}} >
			<div className="title-small" style={{margin: '20px 0px 5px 0px'}}>How much do you want to charge per hour?</div>
			<div className="body-light greyPool" style={{marginBottom: '15px'}}>A 15% listing fee is deducted from every host's price—but sometimes the amount will vary, depending on the length of the trip.</div>
			<div className="input-primary">
				<label>Base Price per Hour ($)</label>
                <div className="flex-between">
    				<input
                        style={{width: '80%'}}
    					type='number'
    					name='price'
    					value={price}
                        onChange={({ target }) => setPrice(target.value)}
    				/>
                    <div className="subheader-heavy">You Earn: {toUSD((price || 0) * .85)}</div>
                </div>
			</div>
			<div className="input-primary" style={{marginBottom: '20px'}}>
				<label>Select which time increments you’d like to offer:</label>
				<CheckboxList
					prefix='time_increments.'
					list={{
						'2': '2 Hours',
						'3': '3 Hours',
						'4': '4 Hours',
						'4': '4 Hours',
						'5': '5 Hours',
						'6': '6 Hours',
						'7': '7 Hours',
						'8': '8 Hours',
						'9': '9 Hours',

					}}
					col='12'
					defaultValue={boat.time_increments || {}}
				/>
			</div>
			{
				boat.pro_hopper

				?	<input type="hidden" name="security_deposit_amount" value="0" />

				: 	<div>
						<div className="title-small" style={{margin: '20px 0px 5px 0px'}}>Security Deposit</div>
						<div className="body-light greyPool" style={{marginBottom: '15px'}}>
							Please select a security deposit amount that you will be eligible for in case of damage. For best practices and to provide the best experiences to guests, we recommend choosing a security deposit less than your booking price. 
							<br/><br/>
							The amount below will be held on the guest’s card until the trip is complete.
						</div>
						<div className="input-primary" style={{marginBottom: '15px'}} >
							<label>Select a security deposit amount</label>
							<Select
								name="security_deposit_amount"
								defaultValue={boat.security_deposit_amount}
								placeholder="Choose amount"
								options={{
									100: '$100',
									200: '$200',
									300: '$300',
									400: '$400',
									500: '$500',
								}}
							/>
						</div>
					</div>
			}
		</div>
	);
};

export default BoatPricing;
