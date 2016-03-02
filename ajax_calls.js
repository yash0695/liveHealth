module.exports = function(app,fs,requestify){
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
            var age_group=["0-10","10-20","20-40","40-60","60-80","80+"]
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

            arr_groupwise_count=[];
            for(i=0;i<6;i++)
            {
                temp={};
                temp.ageGroup=age_group[i];
                temp.maleCount=male_count[i];
                temp.femaleCount=female_count[i];
                arr_groupwise_count.push(temp);
            }

            console.log(JSON.stringify(arr_groupwise_count));
            res.json(arr_groupwise_count);
        }});
};