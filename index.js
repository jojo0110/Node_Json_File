/**
 * Created by kuan on 24/09/15.
 * add new branch test
 */

var
     fs=require('fs')
    ,stdin=process.stdin
    ,stdout=process.stdout
    ,DataManager=require('./dataManager');

fs.readdir(__dirname+'/data/',function(err,files){
if (err)
    throw err;

if(!files.length){
    console.log('no file in this dir');
}
else
{
    files.forEach(
        function (element,index,array){
            console.log('a['+index+']='+element );
        });

    stdout.write('Please enter 0 to see how data manager works on this json file ');


    stdin.setEncoding('utf8');

    stdin.on('data',function(chunk){

        //chunk = chunk.replace('\r\n', '');
        var index=parseInt(chunk);
        if(files[index]!=null)
        {


            var dataManager=new DataManager(__dirname+'/data/'+files[index],function(data){



                console.log('\033[93m run getDataObjAray then show whole array \033[39m \n');
                var _objArray=dataManager.getDataObjArray();
                console.log(_objArray);


                /*get Test*/
                console.log('\033[93m run getObj(\'id\',2) then show this obj \033[39m \n');
                var _getObj=dataManager.getObj('id',2);
                console.log(_getObj);

                /* put test*/
                console.log('\033[93m  run putObj()  (change UserName in obj with id =2) then call getObj to see change  \033[39m');
                _getObj.UserName="AfterputTest";
                dataManager.putObj('id',2, _getObj,function(){});
                var _putObj=dataManager.getObj('id',2);
                console.log(_putObj);

                /* post obj test*/
                console.log('\033[93m run postObj() (add new obj with id =99) then show whole array \033[39m');
                var _postObj={};
                _postObj.id=99;
                _postObj.UserName="postTest";
                dataManager.postObj(_postObj,function(){});
                console.log(dataManager.getDataObjArray());

                /* del obj test*/
                console.log('\033[93m run delObj() result (delete obj with id =99)  then show whole array \033[39m');
                 dataManager.delObj('id',99);
                 console.log(dataManager.getDataObjArray());

                /*store whole array back to file*/

                var recoverObj=dataManager.getObj('id',2);
                recoverObj.UserName="beforePutTest";
                dataManager.putObj('id',2,recoverObj,function(){});
                dataManager.storeDataObjArray();

            });



            stdin.pause();
        }
        else
        throw  new Error('wrong input from users!');
    });

    stdin.on('error',function(err){
        console.log('other errors happen!');
        throw err;
    });
}

});


//node handle err
process.on('uncaughtException', function(err){

    console.log(err.stack+' ,bye');
    process.exit(1);

})

//