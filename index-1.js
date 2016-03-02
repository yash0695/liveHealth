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


app.get('/localtest',function(req,res){
    console.log("help");
   res.render('Help.html');
});

//app.get('/', function(req, res){
  //  res.sendfile(path.join(__dirname + "/views/index-old.html"));
//});



app.get('/home', function(req, res){
    res.render('login.ejs',{title:'login'});
});


app.get('/homepage', function(req, res){
    res.render('index.html');
});




/*app.get('/login', function(req, res) {
    var tname = req.url.split('?')[1].split('&')[0].split('=')[1];
    console.log(tname);
    connection.query('SELECT * from ' + String(tname) + ' limit 30', function (err, rows, fields) {
        console.log(rows);

        var crossfilter = require("crossfilter");
        var filterdata = crossfilter(rows);

        fs.writeFile("jsondata1.json", JSON.stringify(rows));
        // sessionStorage.setItem('example', JSON.stringify(rows));
        var FIELD5Dimension = filterdata.dimension(function (d) {
            return d.FIELD5;
        });
        FIELD5Dimension.filter("LAX");
        var dimdata = FIELD5Dimension.top(Infinity);
        dimdata.forEach(function (x) {
            console.log(JSON.stringify(x));
        });


        res.render('login.ejs', {title: 'login'});
    });
});*/




app.get("/main", function (req,res) {
    res.render('index.html');
});

app.get("/trial", function (req,res)
    {
        requestify.get(theUrl).then(function(response) {
            // Get the response body (JSON parsed - JSON response or jQuery object in case of XML response)
            console.log(JSON.stringify(response.getBody()));
        });

    console.log("hello");
    fs.open(file_output1,'w',function(err,fd){
            if(err)
            {
                return console.error(err);
            }
        });



    jsonfile.readFile(file1,function(err,obj)
    {
        global.o1=obj;
        var a1 = crossfilter(o1);
        var userDetailsIdDimension =a1.dimension(function(d){return d.userDetailsId.id;});
        var userGroup = userDetailsIdDimension.group().top(Infinity);
        arr=[];
        userGroup.forEach(function (v,j) {var user=userDetailsIdDimension.filterExact(v.key).top(Infinity)[0];
            console.log(JSON.stringify(user));
            Obj={};
            Obj.age=user.userDetailsId.age;
            Obj.sex=user.userDetailsId.sex;
            arr.push(Obj);
        });

        fs.appendFileSync(file_output1,JSON.stringify(arr));

        final_filter();


    });

    final_filter=function()
    {
        var json_ob=fs.readFileSync("output.json");
        var data=JSON.parse(json_ob);
        var arr_age=new Array();
        var arr_sex=new Array();
        for(var i in data)
        {
            arr_age.push(data[i].age);
            arr_sex.push(data[i].sex);
        }
        console.log(arr_age);
        console.log(arr_sex);
        var age_group=["0-10","10-20","20-40","40-60","60-80","80+"];
        var male_count=[0,0,0,0,0,0];
        var female_count=[0,0,0,0,0,0];
        for(var i=0;i<arr_age.length;i++)
        {
            if(arr_age[i]<10)
            {
                if(arr_sex[i]=="Male")
                    male_count[0]+=1;
                else
                    female_count[0]+=1;
            }

            if(arr_age[i]>=10 && arr_age[i]<20)
            {
                if(arr_sex[i]=="Male")
                    male_count[1]+=1;
                else
                    female_count[1]+=1;
            }

            if(arr_age[i]>=20 && arr_age[i]<40)
            {
                if(arr_sex[i]=="Male")
                    male_count[2]+=1;
                else
                    female_count[2]+=1;
            }

            if(arr_age[i]>=40 && arr_age[i]<60)
            {
                if(arr_sex[i]=="Male")
                    male_count[3]+=1;
                else
                    female_count[3]+=1;
            }
            if(arr_age[i]>=60 && arr_age[i]<80)
            {
                if(arr_sex[i]=="Male")
                    male_count[4]+=1;
                else
                    female_count[4]+=1;
            }
            if(arr_age[i] > 80)
            {
                if(arr_sex[i]=="Male")
                    male_count[5]+=1;
                else
                    female_count[5]+=1;
            }
        }

        console.log(male_count);
        console.log(female_count);

        arr_groupwise_count=[]
        for(i=0;i<6;i++)
        {
            temp={}
            temp.ageGroup=age_group[i];
            temp.maleCount=male_count[i];
            temp.femaleCount=female_count[i];
            arr_groupwise_count.push(temp);
        }

        console.log(JSON.stringify(arr_groupwise_count));
      res.json(arr_groupwise_count);
    }});

/*app.get("*", function (req,res) {
    res.send("bad route");
});*/


app.get("/trendPatterns",function(req,res)
{
    requestify.get(theUrl).then(function(response) {
        // Get the response body (JSON parsed - JSON response or jQuery object in case of XML response)
        // console.log(JSON.stringify(response.getBody()));
        var obj = response.getBody();
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
        var a2=crossfilter(temp_arr);
        var AreaDimension =a2.dimension(function (e) {
            return e.area;});
        var ret_obj=AreaDimension.group().top(Infinity);
        console.log(ret_obj);
        res.json(ret_obj);
    })});
app.listen(port);
console.log("Listening on port " + port);
