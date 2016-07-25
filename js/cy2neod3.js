function Cy2NeoD3(config, graphId, tableId, sourceId, execId, urlSource, renderGraph, cbResult) {
    function createEditor() {
		return CodeMirror.fromTextArea(document.getElementById(sourceId), {
		  parserfile: ["codemirror-cypher.js"],
		  path: "js",
		  stylesheet: "css/codemirror-neo.css",
		  autoMatchParens: true,
		  lineNumbers: true,
		  enterMode: "keep",
		  value: "some value"
		});
    }
    var neod3 = new Neod3Renderer();
	var neo = new Neo(urlSource);
    var editor = createEditor();
	$("#"+execId).click(function(evt) {
		try {
			evt.preventDefault();
			var query = editor.getValue();
			console.log("Executing Query",query);
			var execButton = $(this).find('i');
			execButton.toggleClass('fa-play-circle-o fa-spinner fa-spin')
			neo.executeQuery(query,{},function(err,res) {
				execButton.toggleClass('fa-spinner fa-spin fa-play-circle-o')
				res = res || {}
				var graph=res.graph;
				if (renderGraph) {
					if (graph) {
						var c=$("#"+graphId);
						c.empty();
						neod3.render(graphId, c ,graph);
						renderResult(tableId, res.table);
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
				if(cbResult) cbResult(res);
			});
		} catch(e) {
			console.log(e);
			sweetAlert("Catched error", e, "error");
		}
		return false;
	});

	function createQuery(company, relation, curDate,sector) {
        //return "MATCH (n)-[r]->(m) WHERE n.start_year <=" + curDate + " and n.end_year>=" + curDate + " and r.type=\"" + relation + "\" RETURN n,r,m";
        var company=company.split(",");
        var str="";
        if(relation=="ALL"){
            if(sector == "ALL"){
                str = "MATCH (n)-[r]-(m) WHERE (";
                for(var i=0;i<company.length;i++){
                    if(i===0){
                        str+="n.name=\""+company[i]+"\"";
                    }
                    else{
                        str+="or n.name=\""+company[i]+"\"";
                    }
                }
                str+=") and r.start_year<="+curDate+" and r.end_year>="+curDate+" RETURN n,r,m LIMIT 100";
            }else{
                str = "MATCH (n)-[r]-(m:"+sector+") WHERE (";
                for(var i=0;i<company.length;i++){
                    if(i===0){
                        str+="n.name=\""+company[i]+"\"";
                    }
                    else{
                        str+="or n.name=\""+company[i]+"\"";
                    }
                }
                str+=") and r.start_year<="+curDate+" and r.end_year>="+curDate+" RETURN n,r,m LIMIT 100";
            }
        }
        else{
            if(sector == "ALL"){
                str = "MATCH (n)-[r:`"+relation+"`]-(m) WHERE (";
                for(var i=0;i<company.length;i++){
                    if(i===0){
                        str+="n.name=\""+company[i]+"\"";
                    }
                    else{
                        str+="or n.name=\""+company[i]+"\"";
                    }
                }
                str+=") and r.start_year<="+curDate+" and r.end_year>="+curDate+" RETURN n,r,m LIMIT 100";
            }else{
                str = "MATCH (n)-[r:`"+relation+"`]-(m:"+sector+") WHERE (";
                for(var i=0;i<company.length;i++){
                    if(i===0){
                        str+="n.name=\""+company[i]+"\"";
                    }
                    else{
                        str+="or n.name=\""+company[i]+"\"";
                    }
                }
                str+=") and r.start_year<="+curDate+" and r.end_year>="+curDate+" RETURN n,r,m LIMIT 100";
            }
        }
        console.log(str);
        return str;
    }


    function execute() {
        try {
            var curDate = $("#curDate").val();
            var relation = $("#relationship").val();
            var company = $("#company").val();
            var sector = $("#sector").val();
            var query = createQuery(company, relation, curDate,sector);
            console.log("Executing Query", query);
            neo.executeQuery(query, {}, function(err, res) {
                res = res || {}
                //$("#res").val("res:"+res.graph.nodes[0].id);
                //linechart.update(res);
                var graph = res.graph;
                if (renderGraph) {
                    if (graph) {
                        var c = $("#" + graphId);
                        c.empty();
                        neod3.render(graphId, c, graph);
                        renderResult(tableId, res.table);
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
                if (cbResult) cbResult(res);
            });
        } catch (e) {
            console.log(e);
            sweetAlert("Catched error", e, "error");
        }
        return false;
    }

    $("#companyList").val($("#company").val());

    $("#dates a").click(function(evt) {
        $("#curDate").val($(this).text());
        execute();
    });

    $('#relationship').change(function() {
        execute();
    });

    $("#company").change(function() {
        execute();
        $("#companyList").val($("#company").val());
    });

    $("#sector").change(function(){
        execute();
    });
}
