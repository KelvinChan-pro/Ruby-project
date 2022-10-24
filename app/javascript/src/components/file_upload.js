import React, { useRef, useContext, useState } from 'react';
import Context from '../context';
import BtnSpinner from './btn_spinner.js';
import { toBase64 } from '../utils'; 

const FileUpload = ({ onUpload, type, copy="Upload File", url, fileName }) => {
	const fileInput = useRef();
	const { state } = useContext(Context);
    const [uploaded, setUploaded] = useState(false);

    async function handleUpload({ target }) {
        const file = await toBase64(target.files[0]);
        const res = await onUpload(file, target.files[0].name);
        setUploaded(res);
    }

	return(
		<div>
            {
                !!url

                ?   <div className="file-upload">
                         <i className="fas fa-cloud-upload pp-upload" />
                         <div><a target="_none" href={url} className="small-light">{fileName}</a></div>
                         <div className="small-light primaryPool" onClick={() => fileInput.current.click()} >Update Insurance</div>
                    </div>

                :   <div className="file-upload-empty" >
                        <i className="fas fa-cloud-upload pp-upload" />
                        <div className="small-light primaryPool" onClick={() => fileInput.current.click()} >Browse computer</div>
                    </div>
            }
            <input
                type="file" 
                onChange={handleUpload}
                style={{ display: 'none' }}
                ref={fileInput}
            />
		</div>
	);
};

export default FileUpload;