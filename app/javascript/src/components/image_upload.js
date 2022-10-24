import React, { useRef, useState, useEffect } from 'react';
import { ImageEditor } from '../components';
import { toBase64 } from '../utils'; 

const ImageUpload = ({ defaultValue, edit, updateCopy, onRequestUpload, type, imageClass, className, ...editorProps }) => {
	const input = useRef();
	const [image, setImage] = useState(defaultValue);
	const [show, setShow] = useState(false);

	useEffect(() => {
		setImage(defaultValue);
	}, [ defaultValue ]);

	return(
		<div>
			<div onClick={() => input.current.click()}>
				{
					image

					?	<img 
							className={imageClass} 
							src={defaultValue}
							alt="User Profile Photo"
						/>

					: 	<div className={`empty-profile-pic ${className}`}>
							<i className="fas fa-cloud-upload pp-upload" />
							<div className="small-light primaryPool" >Browse computer</div>
						</div>

				}
			</div>
			{
				updateCopy && image 
					&& <div 
							className="body-heavy link-btn text-center" 
							style={{marginTop: '10px'}}
							onClick={() => input.current.click()}
						>
							{updateCopy}
						</div>
			}
			<input
			    type="file" 
			    onChange={async ({ target }) => { 
			    	if (edit) {
			    		setImage(target.files[0]);
			    		setShow(true);
			    	} else {
			    		const res = await toBase64(target.files[0]);
			    		onRequestUpload(res);
			    	}
			    }}
			    style={{ display: 'none' }}
			    ref={input}
			/>
			{image && show
				&& <ImageEditor 
						image={image}
						show={show}
						type={type}
						onUpdate={async (image) => { 
							const res = await onRequestUpload(image); 
							setShow(!res);
						}}
						onClose={() => setShow(false)}
						{...editorProps}
					/>
			}
		</div>
	);
};

export default ImageUpload;