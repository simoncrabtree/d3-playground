var threeX = threeX || {};

threeX.EngineerDiary = (function () {
	'use strict';

	var margin = {
		left: 4,
		right: 4
	};

	var module = function (elementSelector, rows, entries) {
		var svg = d3.select(elementSelector);
		var width = svg[0][0].clientWidth - margin.left - margin.right;
		var diary = svg.append('g')
			.attr('transform', 'translate(' + margin.left + ',0)');

		var overviewScale = d3.time.scale()
			.range([0, width])
			.domain([getFirstEntryStart(), getLastEntryEnd()]);

		var overviewBrush = d3.svg.brush()
			.x(overviewScale)
			.on('brush', function () {
				// dateScale.domain(overviewBrush.empty() ? overviewScale.domain() : overviewBrush.extent());
				// resize();
				console.log(overviewBrush.extent());
		});

		var overviewArea = diary.call(overviewBrush.extent([getFirstEntryStart(), getLastEntryEnd()]))
			.attr('class', 'x brush');

		overviewArea.selectAll('rect')
			.attr('height', 24);

		console.log(overviewArea.size());

		function getFirstEntryStart () {
			var d = d3.min(entries.map(function (item) { return item.startDate; }));
			return d;
		}

		function getLastEntryEnd () {
			var d = d3.max(entries.map(function (item) { return item.endDate; }));
			return d;
		}

		var resize = function() {
			var width = svg[0][0].clientWidth - margin.left - margin.right;

			diary.attr('width', width);

			overviewArea.attr('width', width);
			overviewScale.range([0, width]);
		};

		window.onresize = resize;
		resize();
	};

	return module;
})();
