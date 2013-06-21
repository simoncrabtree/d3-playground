threeXdiary = function (el) {

    var container = d3.select(el)[0][0];
    var svg, x, dragging;
    var chart;

    var margin = {
        left: 150,
        right: 25,
        top: 75
    }

    var height = 400 + margin.top;
    var width = container.clientWidth - margin.left - margin.right;
    var timeDomainStart;
    var timeDomainEnd;

    function diary (tasks, engineers) {

        chart = d3.select(el)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'chart');

        chart.append('defs')
            .append('clipPath')
            .append('rect')
            .attr('width', width)
            .attr('height', height);

        var main = chart.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('width', width)
            .attr('height', height);

        //horizontal division lines
        main.append('g')
            .selectAll('.laneLines')
            .data(engineers)
            .enter()
            .append('line')
            .attr('x1', 0)
            .attr('y1', function (engineer, i) {return i * 50})
            .attr('x2', width)
            .attr('y2', function (engineer, i) {return i * 50})
            .attr('stroke', 'lightgray');

        //engineer name labels
        main.append('g')
            .selectAll('.laneLabel')
            .data(engineers)
            .enter()
            .append('text')
            .text(function (engineer) { return engineer; })
            .attr('x', 0)
            .attr('y', function (engineer, i) {return (i * 50) +25})
            .attr('dy', '0.5ex')
            .attr('text-anchor', 'end')
            .attr('class', 'laneLabel');

        var xDateAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')


        main.append('g')
            .call(xDateAxis)

        timeDomainStart = d3.min(tasks, function (item) {return item.startDate});
        timeDomainEnd = d3.max(tasks, function (item) {return item.endDate});


        x = d3.time.scale().domain([timeDomainStart, timeDomainEnd]).range([0, width]).clamp(true);

        var y = d3.scale.ordinal().domain(engineers).rangeRoundBands([0, height], .2);

        var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")
        .tickFormat(d3.time.format("%e"))
        .tickSubdivide(true)
        .tickSize(20)

        var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

        function rectTransform (d) {
            return "translate(" + x(d.startDate) + "," + y(d.engineer) + ")";
        };

        function getTaskWidth (d) {
            return (x(d.endDate) - x(d.startDate));
        };

        function keyFunction (d) {
            return d.startDate + d.engineer + d.endDate;
        };

        function positionXAxis () {
            var t = "translate(0, 0)"
            return t;
        };

        function dragXAxis () {
            document.onselectstart = function () {return false;};
            d3.select('body').style("cursor", "move");
            dragging = {
                xAxis: true,
                from: x.invert(d3.mouse(svg[0][0])[0])
            };
        };
        function mousemove () {
            var relativeMousePosition = d3.mouse(svg[0][0]);
            //console.log(relativeMousePosition);
            if(dragging){
                if(dragging.xAxis){
                    var rupx = x.invert(relativeMousePosition[0]);
                    var xaxis1 = x.domain()[0];
                    var xaxis2 = x.domain()[1];
                    var xextent = xaxis2 - xaxis1;
                    if(rupx != 0){
                        var changex, new_domain;
                        changex = dragging.from / rupx;
                        new_domain = [xaxis1, xaxis1 + (xextent * changex)];
                        x.domain(new_domain);
                    }
                }
                redraw();
            }
        };

        function mouseup () {
            d3.select('body').style("cursor", "default");
            dragging = null;
        };

        function zoom (item) {
            console.log(item);
            var new_domain = [item.startDate, item.endDate];
            x.domain(new_domain);
            redraw();
        };

        function redraw () {

            console.log("Redrawing", x.domain());

            svg = d3.select(el)
            .append("svg")
            .on("mouseup.drag", mouseup)
            .on("mousemove.drag", mousemove)
            .append("g")
            .attr("class", "diary")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            svg.selectAll(".diary")
            .data(tasks, keyFunction)
            .enter()
            .append("rect")
            .attr("height", function (d) {
                return y.rangeBand();
            })
            .attr("width", getTaskWidth)
            .attr("y", 0)
            .attr("transform", rectTransform)
            .attr("fill", "blue")
            .on("click", zoom);

            svg.append("g")
            .attr("class", "x axis")
            .attr("transform",positionXAxis)
            .on("mousedown.drag", dragXAxis)
            .call(xAxis)

            svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
        }

        //console.log("x.scale", x.domain()[1] + 200);
    };

    return diary;
}

var tasks = [
    {startDate: new Date(2013,4,24,17,30), endDate: new Date(2013,4,24,17,50), engineer: "Dave"},
    {startDate: new Date(2013,4,19,10,0), endDate: new Date(2013,4,19,17,30), engineer: "Dave"},
    {startDate: new Date(2013,4,21,15,0), endDate: new Date(2013,4,21,16,0), engineer: "Dave"},
    {startDate: new Date(2013,4,20,0,0), endDate: new Date(2013,4,20,23,59,999), engineer: "Steve"},
    {startDate: new Date(2013,4,21), endDate: new Date(2013,4,23), engineer: "Andy"},
    {startDate: new Date(2013,4,15), endDate: new Date(2013,4,16), engineer: "Justine"}
];

var engineerNames = ["Paul", "Dave", "Steve", "Andy", "Justine"];

var diary = threeXdiary(".container");
diary(tasks, engineerNames);

