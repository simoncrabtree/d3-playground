threeXdiary = function (el) {

    var container = d3.select(el)[0][0];
    console.log(container);

    var margin = {
        left: 50,
        right: 25
    }

    var height = 400;

    var width = container.clientWidth - margin.left - margin.right;

    var keyFunction = function (d) {
        return d.startDate + d.engineer + d.endDate;
    };

    var timeDomainStart;
    var timeDomainEnd;

    var positionXAxis = function () {
         var t = "translate(0, 0)"
         return t;
    };

    var getTaskWidth = function (d) {
                        return (x(d.endDate) - x(d.startDate));

    }
    function diary (tasks, engineers) {

        timeDomainStart = d3.min(tasks, function (item) {return item.startDate});
        timeDomainEnd = d3.max(tasks, function (item) {return item.endDate});

        x = d3.time.scale().domain([timeDomainStart, timeDomainEnd]).range([0, width]).clamp(true);

        var y = d3.scale.ordinal().domain(engineers).rangeRoundBands([0, height], .2);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(d3.time.format("%e"))
            .tickSubdivide(true)
            .tickSize(height)

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var rectTransform = function (d) {
            return "translate(" + x(d.startDate) + "," + y(d.engineer) + ")";
        };

        var svg = d3.select(el)
                    .append("svg")
                    .append("g")
                    .attr("class", "diary")
                    .attr("transform", "translate(" + margin.left + ",0)");


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
                    .attr("fill", "blue");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform",positionXAxis)
            .transition()
            .call(xAxis)

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
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

var engineerNames = ["Dave", "Steve", "Andy", "Justine"];

var diary = threeXdiary(".diary-container");
diary(tasks, engineerNames);

