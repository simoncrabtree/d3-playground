threex = {};
threex.engineerDiary = function (el) {
	
	var container = d3.select(el);
	var margin = {
		left: 30,
		right: 30
	};

	var windowDateStart = new Date("2013-01-01");
	var windowDateEnd = new Date("2013-01-02");

	var dateScale = d3.time.scale()
		.domain([windowDateStart, windowDateEnd])

	var dateAxis = d3.svg.axis()
		.scale(dateScale)
		.tickFormat(d3.time.format('%H'))
		.ticks(d3.time.minutes, 60)
		.tickSize(6, 0, 0);

	var svg = d3.select(el)
		.append('svg')
		.attr('class', 'diary');

	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(' + margin.left + ',0)')
		.call(dateAxis);

	function redraw () {
		width = container[0][0].clientWidth - margin.left - margin.right;

		dateScale.rangeRound([0, width]);
		svg.select('.x.axis')
			.call(dateAxis);
	}

	redraw();
	window.onresize = redraw;

	return {};
};