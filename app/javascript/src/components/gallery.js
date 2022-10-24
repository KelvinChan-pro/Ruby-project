import React, { useState } from 'react';
import ReactBnbGallery from 'react-bnb-gallery';

const Gallery = ({ photos=[], open, onClose, index=0 }) => {

    return (
        <ReactBnbGallery
            show={open}
            photos={photos}
            onClose={onClose}
            activePhotoIndex={index}
        />
    );
};

export default Gallery;
