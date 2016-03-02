var express = require("express");
var app =module.exports=express();
var fs=require("fs");
var port = 3703;
var crossfilter=require("crossfilter");
var jsonfile=require("jsonfile");
var file1="jsondata.json";
var file_output1="output.json";
var mysql      = require('mysql');
var requestify = require('requestify');
var theUrl = 'https://livehealth.in/testValuesPlot/?testName=dengue&token=a9e818c8-fdef-11e3-8a65-00163e98c552'
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'yashgupta',
    database : 'live'
});
app.use("/public",express.static(__dirname +'/public'));
app.use("/views",express.static(__dirname +'/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.locals.pagetitle='Live Health - ';

app.get('/main',function(req,res){
    console.log("in main");
    res.render('index.html');
});





app.get("/positivenegative/:area",function(req,res)
{
    var area=req.params.area;
    console.log(area);
    console.log("in igg");
    requestify.get(theUrl).then(function(response) {
        var obj = response.getBody();
        var a1 = crossfilter(obj["values"]);
        var UsrReportDimension = a1.dimension(function (d) {
            return d.reportForId.userReportId;
        });

        var usrgrp=UsrReportDimension.group().top(Infinity);
    console.log(usrgrp);
    temp_arr=[];
    usrgrp.forEach(function (d, i) {
        var user=UsrReportDimension.filter(d.key).top(Infinity);

        for( var i=0, l=user.length; i<l; i++ )
        {
            if(user[i].value.length < 12 && user[i].value!='-' && user[i].value.indexOf("tive")>0 && user[i].reportForId.labForId.labArea==area)
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
    res.json(DengueDimension.group().top(Infinity));
    });

});

app.get("/monthsuspected/:area",function(req,res)
{
    var area=req.params.area;
    console.log(area);
    console.log("in monthsuspected");
    requestify.get(theUrl).then(function(response) {
        var obj = response.getBody();
        var a1 = crossfilter(obj["values"]);
        var DateDimension = a1.dimension(function (d) {
            return new Date(d.reportForId.reportDate);
        });

        var dategrp = DateDimension.group().top(Infinity);
        //console.log(dategrp);
        month_value = [];
        var monthNames = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        dategrp.forEach(function (d, i) {
            var user = DateDimension.filter(d.key).top(Infinity)[0];
            var n = new Date(d.key);
            temp = {};
            temp.month = monthNames[n.getMonth()];
            temp.value = 1;
            if (user.reportForId.labForId.labArea == area)
                month_value.push(temp);


        });
        //console.log(month_value);

        var a2 = crossfilter(month_value);
        var monthDimension = a2.dimension(function (d, i) {
            return d.month;
        });
        //console.log(monthDimension.group().top(Infinity));
        res.json(monthDimension.group().top(Infinity));
        //code for calculating count of male and female

    });

});


app.get("/agesex/:area",function(req,res)
{
    var area=req.params.area;
    console.log(area);
    console.log("in agesex");
    requestify.get(theUrl).then(function(response) {
        var obj = response.getBody();
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
            if (user.reportForId.labForId.labArea == area)
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
        res.json(age_group_count);

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

});











app.listen(port);
console.log("Listening on port " + port);
