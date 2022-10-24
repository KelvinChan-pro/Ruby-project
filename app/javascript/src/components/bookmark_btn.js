import React, { useState, useEffect } from 'react';
import { withStuff } from '../hocs';

const BookmarkBtn = ({ api, id, bookmarked, style, children }) => {
	const [bookmarkState, setBookmarkState] = useState(bookmarked);

	useEffect(() => {
		setBookmarkState(bookmarked);
	}, [ bookmarked ]);

	async function handleClick(e) {
		e.stopPropagation();
		const res = bookmarkState ? await api.destroyBookmark(id) : await api.createBookmark(id);
		setBookmarkState(res);
	};

	return(

		children

		?	<div onClick={handleClick}>{children(bookmarkState)}</div>


		: 	<i 
				style={style}
				className={`${bookmarkState ? 'fas' : 'far'} pointer save-boat fa-heart whitePool`} 
				onClick={handleClick}
			/>
	);
}; 

export default withStuff(BookmarkBtn, { api: true })