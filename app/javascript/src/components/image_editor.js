import React, { useState, useRef, useContext } from 'react';
import Context from '../context';
import AvatarEditor from 'react-avatar-editor';
import { Modal } from '../components';
import BtnSpinner from './btn_spinner.js';

const ImageEditor = ({ image, show, type, onUpdate, onClose, width, height, borderRadius }) => {
    const { api, state } = useContext(Context);
    const editor = useRef();
    const fileInput = useRef();
    const [imageState, setImage] = useState(image);
    const [scale, setScale] = useState(1);

    async function getCroppedImage(e) {
        e.preventDefault();
        const canvas = editor.current.getImage().toDataURL();
        onUpdate(canvas);
    }

    if (image) return(
        <Modal show={true} onClose={onClose} >
            <div className="text-left">
                <h3 style={{ marginTop: '20px', marginLeft: '20px'}} >Edit Profile Photo</h3>
            </div>
            <input 
                type="file" 
                ref={fileInput}
                style={{display: 'none'}}
                accept="image/jpeg,image/png,image/webp" 
                onChange={({ target }) => setImage(target.files[0])} 
            />
            <AvatarEditor
                image={imageState || image}
                ref={editor}
                width={width}
                height={height}
                borderRadius={borderRadius}
                border={50}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={scale}
                rotate={0}
                id="edit-profile-pic"
            />
            <div className="profile-pic-slider" style={{padding: '20px'}}>
                <input
                    type="range"
                    className="slider"
                    id="scale-slider"
                    min="1"
                    max="3"
                    step="0.01"
                    value={scale}

                    onChange={({ target }) => setScale(parseFloat(target.value))}
                />
                <br/>
                <div className="flex-around" style={{marginTop: '20px'}} >
                    <button onClick={(e) => { e.preventDefault(); fileInput.current.click();}} className="btn-secondary-teal">
                        Upload New Image
                    </button>
                    {
                        state.loading[type]

                        ?   <BtnSpinner />

                        :   <button onClick={getCroppedImage} className="btn-primary">Save Changes</button>
                    }
                </div>
            </div>
        </Modal>
    );

    return <div></div>;

};

export default ImageEditor;