/**
 * Created by StrongMan on 2016/7/23.
 */
function LineChart() {

    var me = {
        update: function (data) {
            if (typeof(data.returns) == "undefined" ){
                $(".line-chart").html("");
            }
            else {
                var margin = {top: 30, right: 15, bottom: 15, left: 50},
                    width = $("#right_block").width() - margin.left - margin.right,
                    height = $("#right_block").width() /1.5 - margin.top - margin.bottom;
                var data1 = {
                    "yymm": ['2012-02',
                        '2012-03',
                        '2012-04',
                        '2012-05',
                        '2012-06'
                    ],
                    "returns": [
                        -0.12353068199999999,
                        -0.026099786,
                        -0.066393769,
                        0.0062405626,
                        0.0161189996
                    ]
                };
                var formatDate = d3.time.format("%Y-%m");
                var data_yymm = data.yymm;
                var data_returns = data.returns;
                data = [];
                for (var i = 0; i < data_yymm.length; i++) {
                    data.push({"yymm": formatDate.parse(data_yymm[i]), "returns": data_returns[i]});
                }

                var x = d3.time.scale()
                    .range([0, width]);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                var line = d3.svg.line()
                    .x(function (d) {
                        return x(d.yymm);
                    })
                    .y(function (d) {
                        return y(d.returns);
                    });
                $(".line-chart").html("");
                var svg = d3.select(".line-chart").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                //data = type(data);
                x.domain(d3.extent(data, function (d) {
                    return d.yymm;
                }));
                y.domain(d3.extent(data, function (d) {
                    return d.returns;
                }));

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .attr("transform","rotate(45)");

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Returns");

                svg.append("path")
                    .datum(data)
                    .attr("class", "line")
                    .attr("d", line);

                function type(d) {
                    d.yymm = formatDate.parse("2010-01");
                    d.returns = d.returns;
                    //d.close=[1,2,3,4,5,6,7,8,9,10,11,12];
                    return d;
                }
            }
        }
    }


    return me;
}
