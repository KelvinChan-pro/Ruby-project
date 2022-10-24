import React, { useContext } from 'react';
import Context from '../context';
import { FileUpload } from '../components';

const InsuranceUpload = () => {
	const { state, api } = useContext(Context);

	return(
		<div>
			<div className="info-card">
				<div className="title-small">
					It is up to you to provide the right insurance.
				</div>
				<div className="body-light" styl={{marginTop: '10px'}} >
					We recommend but cannot enforce that your boat has the appropriate policy. 
				</div>
			</div>
			<div className="subheader-light" style={{margin: '40px 0px'}}>
				If you’d like, add your boat’s insurance information below. For the proper protection, for you, and your vessel, we recommend your policy covers commerical use. If you choose to upload a policy, we will review your policy and send feedback.
			</div>
			<FileUpload 
				onUpload={async (file, name) => await api.uploadBoatInsurance(state.boat.id, file, name)} 
				type="upload_insurance"
				url={state.boat.insurance_url}
				fileName={state.boat.insurance_file_name} 
			/>
		</div>
	);
};

export default InsuranceUpload;