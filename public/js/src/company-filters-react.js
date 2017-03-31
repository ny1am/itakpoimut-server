var violations = require('../../../shared/js/violations.js');
var categories = require('../../../shared/js/categories.js');
var loyalties = require('../../../shared/js/loyalties.js');
var publisher = require('./publisher.js');
var templates = require('./templates-react.js');
var scroll = require('./scroll.js');
var $ = require('jquery');

(function() {

	//todo: i don't like id here
	publisher.subscribe('companiesRefreshed', function() {
		var selectedFilters = [];
		$('[data-company-filter]:checked').each(function(index, el) {
				selectedFilters.push(prepareSelectedFilter(el));
		});
		templates['companies_selected_filters'](document.getElementById('selectedFiltersContainer'), {selectedFilters: selectedFilters});
		scroll.scrollIfNotInView($('#search-results'));
	});

	//todo: revise this shit
	function prepareSelectedFilter(el) {
		var obj;
		if (el.name === 'selectedLoyalty') {
			obj = loyalties.getByName(el.value)
			obj.id = 'rnk_' + obj.name;
		} else if (el.name === 'selectedViolations[]') {
			obj = violations.getByName(el.value)
			obj.id = 'vlt_' + obj.name;
		} else if (el.name === 'selectedCategory') {
			obj = categories.getByName(el.value)
			obj.id = 'ctg_' + obj.name;
		}
		return obj;
	};

	//todo: revise this shit
	$(document.body).on('click', '[data-company-clear-filters]', function(evt) {
		evt.preventDefault();
		$('[data-company-filter]:checked').each(function(index, el) {
			el.checked = false;
		});
		templates['companies_selected_filters'](document.getElementById('selectedFiltersContainer'), {});
		publisher.publish('DOMextend');
		$('[data-ajax-formsubmit]:first').trigger('click');
	});

	$(document.body).on('click', '[data-company-clear-filter]', function(evt) {
		var $this = $(this);
		var elId = $this.attr('data-company-clear-filter');
		var $el = $('#'+elId);
		if ($el.is('[type="checkbox"]')) {
			$el.trigger('click');
		} else if ($el.is('[type="radio"]')) {
			$el[0].checked = false;
			$el.trigger('change');
		}
	});

}());