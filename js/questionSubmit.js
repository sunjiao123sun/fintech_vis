function QuestionSubmit() {
    var connection = function () {
        return {
            url: $("#neo4jUrl").val(),
        };
    }
    var neod3 = new Neod3Renderer();
    var neo = new Neo(connection);

    function execute(query) {
        try {
            neo.executeQuery(query, {}, function(err, res) {
                res = res || {}
                //$("#res").val("res:"+res.graph.nodes[0].id);
                //linechart.update(res);
                //console.log("question return:"+res.table);
                var graph = res.graph;
                if (true) {
                    if (graph) {
                        var c = $("#graph");
                        c.empty();
                        //neod3.render("graph", c, graph);
                        //if(res.table.)
                        renderResult("datatable", res.table);
                        $(".loadBox").hide();
                        $("#table").show();
                    } else {
                        if (err) {
                            console.log(err);
                            if (err.length > 0) {
                                sweetAlert("Cypher error", err[0].code + "\n" + err[0].message, "error");
                            } else {
                                sweetAlert("Ajax " + err.statusText, "Status " + err.status + ": " + err.state(), "error");
                            }
                        }
                    }
                }
            });
        } catch (e) {
            console.log(e);
            sweetAlert("Catched error", e, "error");
        }
        return false;
    }

    var me = {
        questionSubmit: function(question) {
            console.log("question:"+question);
            question = question.replace("%","%25");
            $.ajax({
                type: "POST",
                url: "http://10.2.2.75:8080/HelloForm?question="+question,
                //url:"http://10.1.0.196:8989",
                dataType: 'jsonp',
                jsonp:"callback",
                jsonpCallback:"jsonpCallback",
                success:function(data){
                    console.log(data.Intent);
                    execute(data.query);
                },
                error:function(){
                    console.log("question fail!");
                }
            });

        }
    };
    return me;
}

function jsonpCallback(data){
    console.log(data);
}



