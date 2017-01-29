import React from 'react';
import debounce from 'throttle-debounce/debounce';
import categories from '../../../shared/js/categories.js';
import loyaltySingleByName from '../helpers/loyaltySingleByName';

class AutocompletePopup extends React.Component {
	renderCompanies() {
		return this.props.companies.map(company => (
			<li className="ac-results-row-h">
				<a href={"/company/"+company._id} className="ac-results-row">
				<div className="ac-row-logo">
						<img src={company.img} />
					</div>
					<div className="ac-row-title">
						{company.title}
					</div>
					<div className="ac-row-loyalty">
						<div className={"loyalty-mark "+company.loyalty}>
							{loyaltySingleByName(company.loyalty)}
						</div>
					</div>
				</a>
			</li>
		));
	}
	render() {
		if (this.props.companies.length > 0 && this.props.shown) {
			return (
				<div className="autocomplete-popup">
					<ul className="autocomplete-results">
						{this.renderCompanies()}
					</ul>
				</div>
			);
		} else {
			return null;
		}
	}
}

class AutocompleteSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			shown: this.props.shown,
			title: '',
			category: '',
			companies: []
		};
		this.changeTitle = this.changeTitle.bind(this);
		this.changeCategory = this.changeCategory.bind(this);
		this.search = this.search.bind(this);
		this.delayedSearch = debounce(250, ()=>{this.search()});
	}
	componentWillReceiveProps(newProps) {
		this.setState({shown: newProps.shown});
	}
	changeTitle(e) {
		this.setState({
			title: e.target.value
		});
		this.delayedSearch();
	}
	changeCategory(e) {
		this.setState({
			category: e.target.value
		});
		this.delayedSearch();
	}
	search() {
		var urlParams = 'term='+this.state.title;
		if (this.state.category !== '') {
			urlParams +="&category="+this.state.category;
		}
		$.ajax({
			type: 'GET',
			dataType: 'json',
			contentType: 'application/json',
			url: '/autocomplete?'+urlParams,
			success: (data)=>{this.setState({companies: data.results, shown: true})}
		});
	}
	renderCategoriesOptions() {
		if (!this.props.categories) return null;
		return this.props.categories.map(item => (
			<option value={item.name}>
				{item.text}
			</option>
		));
	}
	render() {
		//todo: remove data-ajax-autocomplete. it's needed to hide popup on blur
		return (
			<article className="main-search">
				<form action="/companies" method="GET">
					<div className="search-construct">
						<div className="search-construct-input">
							<input name="title" type="text" placeholder="Введіть назву компанії" autoComplete="off" value={this.state.title} onChange={this.changeTitle} onFocus={this.search} data-ajax-autocomplete />
							<AutocompletePopup companies={this.state.companies} shown={this.state.shown}/>
						</div>
						<div className="search-construct-select">
							<select name="selectedCategory" value={this.state.category} onChange={this.changeCategory} data-ajax-autocomplete>
								<option value="">Всі сфери</option>
								{this.renderCategoriesOptions()}
							</select>
						</div>
						<button type="submit" className="search-construct-button"></button>
					</div>
				</form>
			</article>
		);
	}
}

AutocompleteSearch.defaultProps = {
	categories: categories.list(),
	shown: true
};

export default AutocompleteSearch;