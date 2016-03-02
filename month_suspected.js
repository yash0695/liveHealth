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
    month_value = [];
    var monthNames=["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov","Dec"];
    dategrp.forEach(function (d, i) {
	var user=DateDimension.filter(d.key).top(Infinity)[0];
        var n=new Date(d.key);
        temp = {};
        temp.month=monthNames[n.getMonth()];
        temp.value=1;
	if(user.reportForId.labForId.labArea=="Bhosari")
	        month_value.push(temp);


    });
    //console.log(month_value);

    var a2=crossfilter(month_value);
    var monthDimension=a2.dimension(function(d,i){
        return d.month;
    });
    console.log(monthDimension.group().top(Infinity));

    //code for calculating count of male and female













     /*var AgeGroup = monthDimension.group().top(Infinity);

    AgeGroup.forEach(function (v,j) {
     var user=monthDimension.filter(v.key).top(Infinity)[0];
     if(user.reportForId.age!=0) {
     Obj = {};
     Obj.age = user.reportForId.age;
     Obj.sex = user.reportForId.sex;
     arr.push(Obj);
     }
     });
     console.log(arr);


    //fs.appendFileSync(file_output1,JSON.stringify(arr));

    //final_filter();*/


});
