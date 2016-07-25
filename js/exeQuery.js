/**
 * Created by StrongMan on 2016/7/24.
 */

function ExeQuery(){
    var me={
        exeQuery:function(){
            var connection = function () {
                return {
                    url: $("#neo4jUrl").val(),
                };
            }
            var neod3 = new Neod3Renderer();
            var neo = new Neo(connection);

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
                    var company = $("#companyList").val();
                    var sector = $("#sector").val();
                    var query = createQuery(company, relation, curDate,sector);
                    console.log("Executing Query ", query);
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
            execute();
        }
    }
    return me;
}
