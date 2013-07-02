var diary = function(elSelector) {

	var width = 400;
	var contextHeight = 24;
	var data = {
		selectionStart: new Date(2013,7,1),
		selectionEnd: new Date(2013,7,2)
	};
	var x2 = d3.time.scale()
		.domain([data.selectionStart, data.selectionEnd])
		.range([0, width]);
	var brush = d3.svg.brush()
	.x(x2);

	var diarySvg = d3.select('.diary')
		.append('svg')
		.attr('width', width)
		.attr('height', 500)

	var context = diarySvg.append('g');
	context.append('g')
		.attr('class', 'x brush')
		.call(brush.extent([data.selectionStart, data.selectionEnd]))
		.selectAll('rect')
		.attr('height', contextHeight);






	console.log('svg', diarySvg[0]);
};
