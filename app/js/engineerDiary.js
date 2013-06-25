threex = {};
threex.engineerDiary = function (el, engineers) {
	var _items;
	
	var container = d3.select(el);
	var margin = {
		top: 0,
		bottom: 0,
		left: 30,
		right: 30
	};

	var laneHeight = 64;
	var height = laneHeight * engineers.length;

	var windowDateStart = new Date(2013, 4, 15);
	var windowDateEnd = new Date(2013, 4, 15, 23, 59, 59, 999);

	var dateScale = d3.time.scale()
	.domain([windowDateStart, windowDateEnd])

	var engineerScale = d3.scale.ordinal()
	.domain(engineers)
	.rangeRoundBands([ 0, height - margin.top - margin.bottom ]);

	var windowAxis = d3.svg.axis()
	.scale(dateScale)
	.tickFormat(d3.time.format('%a %-d %b'))
	.tickValues([windowDateStart, windowDateEnd]);

	// var dateAxis = d3.svg.axis()
	// .scale(dateScale)
	// .tickFormat(d3.time.format('%H'))
	// .ticks(d3.time.minutes, 60)
	// .tickSize(6, 0, 0);

	var dragging = {

	};

	d3.select(window)
	.on('mouseup', function () {
		console.log('mouseup')
	});

	d3.select(window)
	.on('mousemove', function () {
		if (dragging.windowEnd) {
			console.log("dragging", dragging)
		}
	});

	var svg = d3.select(el)
	.append('svg')
	.attr('class', 'diary');

	var diaryWindow = svg.append('g')
	.attr('class', 'diary-window')

	var engineerAxis = diaryWindow.append('g')
		.attr('class', 'engineer-axis');

	engineerAxis.selectAll()
		.data(engineers)
		.enter()
		.append('line')
		.attr('class', 'lane')
		.attr('y1', getLaneLineYPosition)
		.attr('y2', getLaneLineYPosition)
		.attr('x1', 0)
		.attr('x2', 10000);
	engineerAxis.selectAll('text')
		.data(engineers)
		.enter()
		.append('text')
		.text(function (engineer) {
			return engineer;
		})
		.attr('y', function (engineer) {
			return engineerScale(engineer) + 12;
		})
		.attr('class', 'engineer-label')


	function getLaneLineYPosition (engineer) {
		//adding 0.5 is a hack to get around the 1px
		//lane divisions sometimes looking like 2px
		return engineerScale(engineer) + 0.5;
	}

	function diaryEntryPositionOnXaxis (diaryEntry) {
		return dateScale(diaryEntry.startDate);
	};

	function diaryEntryWidth (diaryEntry) {
		var width = (dateScale(diaryEntry.endDate) - dateScale(diaryEntry.startDate));
		if (width < 1) width = 1;
		return width;
	}

	function redraw () {
		width = container[0][0].clientWidth - margin.left - margin.right;
		dateScale.rangeRound([0, width]);

		// dateHeader.text(getDateRangeAsString());


		// dateWindowStartLabel.text(getDateLabel(windowDateStart));
		// dateWindowEndLabel.text(getDateLabel(windowDateEnd));

		var visibleItems = _items.filter(function (item) {
			return item.startDate < windowDateEnd && item.endDate > windowDateStart;
		});

		var diaryEntries = diaryWindow.selectAll('.diary-entry')
			.data(visibleItems)
			.attr('x', diaryEntryPositionOnXaxis)
			.attr('y', function (item) {
				return engineerScale(item.engineer);
			})
			.attr('width', diaryEntryWidth);


		diaryWindow.selectAll('.diary-entry')
		.data(visibleItems)
		.enter()
		.append('rect')
		.attr('x', diaryEntryPositionOnXaxis)
		.attr('y', function (item) {
			return engineerScale(item.engineer);
		})
		.attr('width', diaryEntryWidth)
		.attr('height', laneHeight)
		.attr('id', function (item) {
			return item.id
		})
		.attr('class', 'diary-entry')
		.on('click', function (diaryEntry) {
			console.log(diaryEntry);
		});

		diaryWindow.selectAll('.diary-entry')
		.data(visibleItems)
		.exit()
		.remove();
	}

	function getDateLabel (theDate) {
		var dateFormatter = d3.time.format('%a %-d %b %-I %p');
		var roundedDate = d3.time.hour.round(theDate);
		return dateFormatter(roundedDate);
	}

	function zoom (direction) {
			windowDateStart = d3.time.day.offset(windowDateStart, direction);
			windowDateEnd = d3.time.day.offset(windowDateEnd, -direction);
			dateScale.domain([windowDateStart, windowDateEnd]); 
			redraw();
	}

	function setWindowStart (newValue) {
		windowDateStart = newValue;
		updateWindow();
	}
	function setWindowEnd (newValue) {
		windowDateEnd = newValue;
		updateWindow();
	}

	function updateWindow () {
		dateScale.domain([windowDateStart, windowDateEnd]); 
		redraw();
	}

	window.onresize = redraw;

	return {
		zoomout: function () {
			zoom(-1);
		},
		zoomin: function () {
			windowDateEnd = d3.time.day.offset(windowDateEnd, -1)
			updateWindow();
		},
		windowStartMinus: function () {
			setWindowStart(d3.time.hour.offset(windowDateStart, -6));
		},
		windowStartPlus: function () {
			setWindowStart(d3.time.hour.offset(windowDateStart, 6));
		},
		windowEndMinus: function () {
			setWindowEnd(d3.time.hour.offset(windowDateEnd, -6));
		},
		windowEndPlus: function () {
			setWindowEnd(d3.time.hour.offset(windowDateEnd, 6));
		},
		setData: function (items) {
			_items = items;
			redraw();
		}
	};
};