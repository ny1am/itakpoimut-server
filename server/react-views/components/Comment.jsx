import React from 'react';
import formatDate from '../helpers/formatDate';
import avatar from '../helpers/avatar';

class Comment extends React.Component {
	renderCompany() {
		if (this.props.company) {
			let company = this.props.company;
			return (
				<a href={'/company/'+company._id} className="comment-theme">
					до теми {company.title}
				</a>
			)
		} else {
			return null
		}
	}

	render() {
		let comment = this.props.comment;
		let user = comment._user;
		return (
			<article className="comment">
				<div className="comment-image">
					<img src={avatar(user.picture_url, 90)} />
				</div>
				<div className="comment-body">
					<div className="comment-meta">
						<span className="comment-author">
							{user.fname} {user.lname}
						</span>
						<span className="comment-time">
							{formatDate(comment.created)}
						</span>
						{this.renderCompany()}
					</div>
					<p className="comment-text">
						{comment.text}
					</p>
				</div>
			</article>
		);
	}
}

Comment.propTypes = {
	comment: React.PropTypes.object.isRequired,
	company: React.PropTypes.object
}

export default Comment;