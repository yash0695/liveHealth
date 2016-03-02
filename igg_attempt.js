var express = require("express");
var app =express();
var fs=require("fs");
var crossfilter=require("crossfilter");
var file1="cross-deng-data3.json";
var jsonfile=require("jsonfile");
var area_filt="Wagholi"

jsonfile.readFile(file1,function(err,obj) {

    //console.log(JSON.stringify(o2));
    var a1 = crossfilter(obj["values"]);
    var UsrReportDimension = a1.dimension(function (d) {
        return d.reportForId.userReportId;
    });

    var usrgrp=UsrReportDimension.group().top(Infinity);
    //console.log(usrgrp);
    temp_arr=[];
    usrgrp.forEach(function (d, i) {
        var user=UsrReportDimension.filter(d.key).top(Infinity);

		for( var i=0, l=user.length; i<l; i++ ) 
		{
    		if(user[i].value.length < 22 && user[i].value!='-' && (user[i].value.indexOf("tive")>=0) && user[i].reportForId.labForId.labArea==area_filt)
			{
			//console.log(user[i]);
			temp1={};
			temp1.igg=user[i].value.substr(0,8);
			temp1.value=1;
			temp1.id=user[i].reportForId.userReportId;

			temp_arr.push(temp1);
			
			}}
});

    console.log(temp_arr);

    var a2=crossfilter(temp_arr);
    var DengueDimension =a2.dimension(function (e) {
        return e.igg;
    });

	 console.log(DengueDimension.group().top(Infinity));

});
