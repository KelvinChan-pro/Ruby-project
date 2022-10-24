import React from 'react';

const Drawer = ({ show, onClose, children, style={}, from="right" }) => {

	function buildStyle() {
		style.padding = show ? style.padding : '0px';
		switch (from) {
			case 'right':
				style.top = '0';
				style.right = '0';
				style.width = show ? style.width || '100%' : '0';
				break;
			case 'left':
				style.top = '0';
				style.left = '0';
				style.width = show ? style.width || '100%' : '0';
				break;
			case 'bottom':
				style.bottom = '0';
				style.left = '0';
				style.right = '0';
				style.width = '100%';
				style.height = show ? style.height || '100%' : '0';
				break;
		}
		return style;
	};

	return(
		<div 
			className="drawer" 
			style={buildStyle()}
		>
			{children}
			<a className="close-drawer" onClick={onClose} >&times;</a>
		</div>
	);
};

export default Drawer;
