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
                var graph = res.graph;
                if (true) {
                    if (graph) {
                        var c = $("#graph");
                        c.empty();
                        neod3.render("graph", c, graph);
                        renderResult("datatable", res.table);
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
            $.ajax({
                type: "POST",
                url: "http://10.1.0.196:8080/HelloForm?question="+question,
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
                //,
                //crossDomain : true,
                //data: JSON.stringify({
                //    "question":"myquestion"
                //}),
                //beforeSend: function(req) {
                //    req.setRequestHeader("Access-Control-Allow-Origin:", "*")
                //    req.setRequestHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS"),
                //    req.setRequestHeader("Access-Control-Allow-Headers", "X-ACCESS_TOKEN, Access-Control-Allow-Origin, Authorization, Origin, x-requested-with, Content-Type, Content-Range, Content-Disposition, Content-Description")
                //},
                //contentType: "application/json",
                //error: function(XMLHttpRequest, textStatus, errorThrown){
                //    alert(XMLHttpRequest.readyState +" "+ XMLHttpRequest.status +" "+ XMLHttpRequest.responseText);
                //} ,
                //success: function(res) {
                //    $("#json").html(res);
                //    alert("json receive success!");
                //}
            });

        }
    };
    return me;
}

function jsonpCallback(data){
    console.log(data);
}



