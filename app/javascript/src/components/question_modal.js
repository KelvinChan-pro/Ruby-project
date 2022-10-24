import React, { useEffect, useRef, useState } from 'react';
import { ErrorBox, Submit, Modal, LoginModal } from '../components';
import { withStuff } from '../hocs';

const QuestionModal = ({ api, state, children }) => {
	const question = useRef();
	const [show, setShow] = useState(false);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		if (state.loggedIn) {
			if(localStorage.getItem("set_question") == "true") {
				window.location.href = '/message';
			}
		}
	}, [state.loggedIn])

	function displayQuestionModal() {
		api.setQuestionModal(true);
		setTimeout(() => {
			console.log("State Question Modal Status 1 => ", localStorage.getItem("set_question"));
			if (state.loggedIn) {
				console.log("State Question Modal Status 2 => ", localStorage.getItem("set_question"));
				if(localStorage.getItem("set_question") == "true") {
					window.location.href = '/message';
				}
			} else {
				api.openLoginModal();
			}
		}, 500)
	}

	async function askQuestion() {
		const res = await api.askQuestion(state.boat.id, state.user.id, question.current.value);
		if (res) setSuccess(true);
	};

	return(
		<div>
			{children({ displayQuestionModal })}
			<LoginModal show={state.loginModal} onClose={api.closeLoginModal} />
			<Modal show={show} onClose={() => setShow(false)} >
				<div style={{padding: '30px', textAlign: 'left'}}>
					<ErrorBox error={state.errors.question} />
					{
						success

						? 	<div className="text-center">
								<i className="fas fa-check-circle big-check" />
								<h2>We have received your question!</h2>
								<div style={{margin: '20px 0px 20px 0px'}} className="body-light greyPool text-center">Lake Hop support will get back to you shortly.</div>
								<button className="btn-primary" style={{width: '100%', marginBottom: '20px'}} onClick={() => setShow(false)}>Close</button>
							</div>

						: 	<div>
								<div className="input-primary">
									<label>Ask a question about this boat.</label>
									<textarea
										ref={question}
										rows="10"
									/>
								</div>
								<Submit
									loading={state.loading.question}
									copy="Ask Question"
									onClick={askQuestion}
									style={{float: 'right', marginBottom: '20px'}}
								/>
							</div>
					}
					
				</div>
			</Modal>
		</div>
	);
};

export default withStuff(QuestionModal, { state: true, api: true });
