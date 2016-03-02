var express = require("express");
var app =express();
var fs=require("fs");
var crossfilter=require("crossfilter");
var file1="cross-deng-data1.json";
var jsonfile=require("jsonfile");
jsonfile.readFile(file1,function(err,obj) {

    //console.log(JSON.stringify(o2));
    var a1 = crossfilter(obj["values"]);
    var DateDimension = a1.dimension(function (d) {
        return new Date(d.reportForId.reportDate);
    });

    var dategrp=DateDimension.group().top(Infinity);
    //console.log(dategrp);
    arr_age_sex = [];
        dategrp.forEach(function (d, i) {
            var user=DateDimension.filter(d.key).top(Infinity)[0];
                temp = {};
                temp.age = Math.floor(user.reportForId.age/365);
                temp.sex = user.reportForId.sex;
                temp.value=1;

                arr_age_sex.push(temp);


        });
    //console.log(arr_age_sex);


    var a2=crossfilter(arr_age_sex);
    var ageDimension=a2.dimension(function(d,v){return d.age;});
    var age_fcount=ageDimension.group().reduceSum(function(d){if(d.sex=='Female')return d.value ; else return 0;}).top(Infinity);
    //console.log(age_fcount);
    var age_mcount=ageDimension.group().reduceSum(function(d){if(d.sex=='Male')return d.value; else return 0;}).top(Infinity);
    //console.log(age_mcount);

    var age_group=["0-10","10-20","20-30","30-40","40-50","50-60","60+"];
    age_group_count=[];
    for(var i=0;i<7;i++)
    {
        temp={};
        temp.ageGroup=age_group[i];
        temp.MaleCount=0;
        temp.FemaleCount=0;
        age_group_count.push(temp);
    }

    age_fcount.forEach(function(k)
    {
        //console.log((k.key));
        if(k.key<60)
            age_group_count[Math.floor((k.key)/10)].FemaleCount = age_group_count[Math.floor((k.key)/10)].FemaleCount+k.value;
        else
            age_group_count[6].FemaleCount =age_group_count[6].FemaleCount+k.value;
    });


    age_mcount.forEach(function(k)
    {
        //console.log((k.key));
        if(k.key<60)
            age_group_count[Math.floor((k.key)/10)].MaleCount = age_group_count[Math.floor((k.key)/10)].MaleCount+k.value;
        else
            age_group_count[6].MaleCount =age_group_count[6].MaleCount+k.value;
    });

    console.log(age_group_count);














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
