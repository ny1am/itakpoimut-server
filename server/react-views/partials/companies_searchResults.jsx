import React from 'react';
import Pagination from '../components/Pagination.jsx';
import CompanyOverview from '../components/CompanyOverview.jsx';

class CompaniesSearchResults extends React.Component {

	constructor(props) {
		super(props);
		this.sort = this.sort.bind(this);
		this.changePage = this.changePage.bind(this);
	}

	sort(evt, sortOrder) {
		evt.preventDefault();
		this.props.sort(sortOrder);
	}

	changePage(evt, currentPage) {
		evt.preventDefault();
		this.props.changePage(currentPage);
	}

	render() {
		const newSortOrder = (this.props.sortOrder==='asc'?'desc':'asc');
		if (this.props.companies.length > 0) {
			return (
				<div className="search-results">
					<div className="search-results-header clearfix">
						Підібрано {this.props.companiesCount} з {this.props.allCompaniesCount} компаній
						<div className="right">
							<button type="submit" className={"plain sort-"+newSortOrder} formAction={"/companies?sortOrder="+newSortOrder} onClick={(evt)=>{this.sort(evt, newSortOrder)}}>
								За алфавітом
							</button>
						</div>
					</div>
					<div className="search-results-items">
						{this.props.companies.map(company => (
							<CompanyOverview company={company} />
						))}
					</div>
					<Pagination currentPage={this.props.currentPage} totalPages={this.props.totalPages} changePage={this.changePage}>
						<button type="submit" formAction={"/companies?currentPage={{page}}&sortOrder="+this.props.sortOrder}/>
					</Pagination>
				</div>
			)
		} else {
			return (
				<div className="search-results">
					За заданими вами параметрами нічого не знайдено.
				</div>
			)
		}
	}
}

CompaniesSearchResults.defaultProps = {
	companies: [],
	companiesCount: 0,
	allCompaniesCount: 0,
	currentPage: 1,
	totalPages: 0,
	sortOrder: 'asc'
}

export default CompaniesSearchResults;