import React from 'react';

const Modal = ({ style, children, show, onClose }) => {
	
	return(
		<div>
			<div 
				id="overlay"
				onClick={onClose}
				style={{display: show ? '' : 'none'}}
			></div>
			<div className="moodal" style={{ ...style, display: show ? '' : 'none'}} >
				<i id="exit-moodal" className="fal fa-times" onClick={onClose} />
				{children}
				{/*<div className="moodal-heading flex-between">
					<div className="big-heading">
						{heading}
					</div>
				</div>
				<div className="moodal-body">
				</div>*/}
			</div>
		</div>
	);
};

export default Modal;