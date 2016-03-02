var express = require("express");
var app =express();
var fs=require("fs");
var crossfilter=require("crossfilter");
var file1="cross-deng-data3.json";
var jsonfile=require("jsonfile");

jsonfile.readFile(file1,function(err,obj) {

    //console.log(JSON.stringify(o2));
    var a1 = crossfilter(obj["values"]);
    var DateDimension = a1.dimension(function (d) {
        return new Date(d.reportForId.reportDate);
    });

    var dategrp=DateDimension.group().top(Infinity);
    //console.log(dategrp);
    temp_arr=[];
    dategrp.forEach(function (d, i) {
        var user=DateDimension.filter(d.key).top(Infinity)[0];

        temp1={};
        temp1.area=user.reportForId.labForId.labArea;
        temp1.value=1;
	
        temp_arr.push(temp1);

    });

    //console.log(temp_arr);






    var a2=crossfilter(temp_arr);
    var AreaDimension =a2.dimension(function (e) {
        return e.area;
    });
    console.log(AreaDimension.group().top(Infinity));







    // var AgeGroup = IdDimension.group().top(Infinity);

    /*AgeGroup.forEach(function (v,j) {
     var user=IdDimension.filter(v.key).top(Infinity)[0];
     if(user.reportForId.age!=0) {
     Obj = {};
     Obj.age = user.reportForId.age;
     Obj.sex = user.reportForId.sex;
     arr.push(Obj);
     }
     });
     console.log(arr);*/


    //fs.appendFileSync(file_output1,JSON.stringify(arr));

    //final_filter();


});
