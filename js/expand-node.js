/**
 * Created by StrongMan on 2016/7/24.
 */

function ExpandNode() {
    var me = {
        expand: function() {
            var expandNodeName = $("#company-name").text();
            var companyList=$("#companyList").val().split(",");
            var index = companyList.indexOf(expandNodeName);
            if(index === -1){
                var str = $("#companyList").val();
                str += ","+expandNodeName;
                $("#companyList").val(str);
                console.log(companyList);
                var exe = new ExeQuery();
                exe.exeQuery();
            }
            else if(index === 0) {
            }
            else {
                companyList.splice(index, 1);
                var str = companyList.join(",");
                $("#companyList").val(str);
                console.log(companyList);
                var exe = new ExeQuery();
                exe.exeQuery();
            }
        }
    };
    return me;
}
