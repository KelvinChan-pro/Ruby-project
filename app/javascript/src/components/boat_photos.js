import React, { useContext } from 'react';
import Context from '../context';
import { ImageUpload } from '../components';

const BoatPhotos = () => {
	const { state, api } = useContext(Context);
    const { boat } = state;
	return(
		<div>
            <div className="title-small" style={{marginBottom: '5px'}} >Requirements for all photos</div>
            <ol className="body-light greyPool">
                <li>Photos must be bright, clear, and in color</li>
                <li>They must accurately describe the experience</li>
                <li>They can’t show people posed for the camera or taking a selfie</li>
                <li>They can’t be edited with filters, text or graphics, logos, or collages</li>
                <li>They must belong to you — don’t use copyrighted work</li>
            </ol>
			<div className="title-small" style={{margin: '20px 0px 5px 0px'}}>Cover photo</div>
			<div className="body-light greyPool" style={{marginBottom: '15px'}}>This photo will be the first and largest photo that potential guests see. Pick one that gives a good representation of your experience. It will be the only photo that guests can preview on mobile.</div>
			<ImageUpload
                width={300}
                height={200}
                borderRadius={4}
				type="update_boat"
				edit={true}
				imageClass="gallery-image"
				defaultValue={boat.cover_photo}
				className="empty-rectangle"
				onRequestUpload={image => api.updateBoatImage(boat.id, image, 'cover_photo')}
			/>
			<div className="title-small" style={{margin: '20px 0px 5px 0px'}}>Preview photos</div>
            <div className="body-light greyPool" style={{marginBottom: '15px'}}>Upload 2 photos that will make up the preview of your listing on desktop.</div>
            <div className="flex">
                <div style={{marginRight: '25px'}}>
                    <ImageUpload
                        width={300}
                        height={200}
                        borderRadius={4}
                        type="update_boat"
                        edit={true}
                        imageClass="gallery-image"
                        defaultValue={boat.preview_photo_1}
                        className="empty-rectangle"
                        onRequestUpload={image => api.updateBoatImage(boat.id, image, 'preview_photo_1')}
                    />
                </div>
                <div >
                    <ImageUpload
                        width={300}
                        height={200}
                        borderRadius={4}
                        type="update_boat"
                        edit={true}
                        imageClass="gallery-image"
                        defaultValue={boat.preview_photo_2}
                        className="empty-rectangle"
                        onRequestUpload={image => api.updateBoatImage(boat.id, image, 'preview_photo_2')}
                    />
                </div>
            </div>
            <div className="title-small" style={{margin: '20px 0px 5px 0px'}}>Miscellaneous photos</div>
            <div className="body-light greyPool" style={{margin: '20px 0px 15px 0px'}}>Optional: add up to 6 more photos</div>
			<div className="row">
                <div className="col-md-6 col-lg-4 col-sm-12">
                    <ImageUpload
                        width={300}
                        height={200}
                        borderRadius={4}
                        type="update_boat"
                        imageClass="gallery-image"
                        defaultValue={boat.misc_photos[0]}
                        className="empty-rectangle"
                        onRequestUpload={image => api.updateBoatImage(boat.id, image, 'misc_photo_1')}
                    />
                </div>
                <div className="col-md-6 col-lg-4 col-sm-12">
                    <ImageUpload
                        width={300}
                        height={200}
                        borderRadius={4}
                        type="update_boat"
                        imageClass="gallery-image"
                        defaultValue={boat.misc_photos[1]}
                        className="empty-rectangle"
                        onRequestUpload={image => api.updateBoatImage(boat.id, image, 'misc_photo_2')}
                    />
                </div>
                <div className="col-md-6 col-lg-4 col-sm-12">
                    <ImageUpload
                        width={300}
                        height={200}
                        borderRadius={4}
                        type="update_boat"
                        imageClass="gallery-image"
                        defaultValue={boat.misc_photos[2]}
                        className="empty-rectangle"
                        onRequestUpload={image => api.updateBoatImage(boat.id, image, 'misc_photo_3')}
                    />
                </div>
            </div>
            <div className="row" style={{marginTop: '20px'}} >
                <div className="col-md-6 col-lg-4 col-sm-12">
                    <ImageUpload
                        width={300}
                        height={200}
                        borderRadius={4}
                        type="update_boat"
                        imageClass="gallery-image"
                        defaultValue={boat.misc_photos[3]}
                        className="empty-rectangle"
                        onRequestUpload={image => api.updateBoatImage(boat.id, image, 'misc_photo_4')}
                    />
                </div>
                <div className="col-md-6 col-lg-4 col-sm-12">
                    <ImageUpload
                        width={300}
                        height={200}
                        borderRadius={4}
                        type="update_boat"
                        imageClass="gallery-image"
                        defaultValue={boat.misc_photos[4]}
                        className="empty-rectangle"
                        onRequestUpload={image => api.updateBoatImage(boat.id, image, 'misc_photo_5')}
                    />
                </div>
                <div className="col-md-6 col-lg-4 col-sm-12">
                    <ImageUpload
                        width={300}
                        height={200}
                        borderRadius={4}
                        type="update_boat"
                        imageClass="gallery-image"
                        defaultValue={boat.misc_photos[5]}
                        className="empty-rectangle"
                        onRequestUpload={image => api.updateBoatImage(boat.id, image, 'misc_photo_6')}
                    />
                </div>
            </div>
		</div>
	);
};

export default BoatPhotos;
