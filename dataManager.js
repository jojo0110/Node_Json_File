/**
 * Created by kuan on 28/09/15.
 * the manager can do the following tasks
 * 1. convert a .json file to a json obj array
 * 2. get,del,put and post element from this obj array
 * 3. convert json obj array back to json file
 */
module.exports=DataManager;
var fs=require('fs');

function DataManager (fpath,callback){
    var _fpath=fpath;
    var _dataObjArray={};
    var _retrived=0;
    var _changed=0;

    var  _getDataObjArray=function (callback){
        fs.readFile(_fpath, 'utf8', function (err, data) {
            if (err) throw err;
            _dataObjArray=Object.create( JSON.parse(data));
            _retrived=1;
            callback(_dataObjArray);
        });
    };

    /*
     * ex. search obj with id:2 (id is name, 2 is value)
     */
    var _search=function(name,value){
        var returnObj={};
        _dataObjArray.forEach(function(element,index){
            if(element[name]==value)
            { returnObj= element;
                return;
            }
        });
        return returnObj;

    };

    /*
     *
     *
     * */
    var _searchSelected=function(name,value){

        var returnObjArray=[];
        _dataObjArray.forEach(function(element,index){
            if(element[name]==value)
            { returnObjArray.push(element);
            }
        });
        return returnObjArray;

    }
    /*
     * del element ex id:2 id is name 2 is value
     * */
    var _delete=function(name,value){

        __delElement(_dataObjArray);
        return _dataObjArray;

        function __delElement(tempObjArray,callback){
            for(var i=0;i<tempObjArray.length;i++){
                if(tempObjArray[i]===undefined)
                    continue;
                if(tempObjArray[i][name]==value){
                    tempObjArray.splice(i,1);
                    __delElement(tempObjArray);
                }
                else{
                    _dataObjArray=tempObjArray;
                    _changed=true;
                }
            }
        }
    };

    var _update=function(name,value,newObj){
        for(var j=0;j<_dataObjArray.length;j++){
            if(_dataObjArray[j]===undefined)
                continue;
            if(_dataObjArray[j][name]==value){
                _dataObjArray.splice(j,1,newObj);
            }
        }
        _changed=true;
        return _dataObjArray;
    };

    var _add=function(newObj){

        _dataObjArray.push(newObj);
        _changed=true;
        return _dataObjArray;
    }

    loadDataObjArray(_fpath,callback);


    function loadDataObjArray(_fpath,callback){

        fs.readFile(_fpath, 'utf8', function (err, data) {
            if (err) throw err;
            // _dataObjArray=Object.create( JSON.parse(data));
            _dataObjArray=JSON.parse(data);
            _retrived=1;
            callback(_dataObjArray);
        });
    };


    /*
     * return whole obj array
     *
     * */
    this.getDataObjArray=function(){
        if(!_retrived){
            throw new Error('file data is not loaded ');
        }
        else{

            return  _dataObjArray;

        }

    }

    /*
     *
     *
     * */
    this.getSelectedObjArray=function(name,value){

        if(!_retrived){
            throw new Error('file data is not loaded ');
        }
        else{
            return  _searchSelected(name,value);

        }
    }

    /*
     * get specific element from dataobj array
     * search obj with id:2 (id is name, 2 is value)
     * return single object
     * */
    this.getObj=function(name,value){

        if(!_retrived){
            throw new Error('file data is not loaded ');
        }
        else{
            return  _search(name,value);

        }
    };

    /*
     * del object with name value
     * ex:delObj('id',2) will delete obj which id is 2 and
     * return whole obj array
     *
     * */
    this.delObj=function(name,value) {
        if (!_retrived) {
            throw new Error('file data is not loaded ');
        }
        else {
            return _delete(name, value);

        }
        ;
    }
    /*
     * update object
     * ex:putObj('id',2,new Obj) will update obj with id=2
     *
     *
     * */
    this.putObj=function(name,value,newObj,callback){
        if (!_retrived) {
            throw new Error('file data is not loaded ');

        }
        else {
            callback( _update(name, value,newObj));
        };

    }
    /*
     * add new obj into obj array
     * ex:postObj(newObj) will add this newobj into array
     * return whole obj array
     * */
    this.postObj=function(newObj,callback){

        if (!_retrived) {
            throw new Error('file data is not loaded ');

        }
        else {
            if(!newObj.id)
                newObj.id=this.getNewID();
            callback(_add(newObj));
        }

    };

    /*
     * check if dataobjarray is modified
     *
     * */
    this.isChanged=function(){
        return _changed;
    }

    /*
     * return the new id
     * */

    this.getNewID=function(){
        if (!_retrived) {
            throw new Error('file data is not loaded ');

        }
        else {
            var _newID=0;
            for(var j=0;j<_dataObjArray.length;j++){
                if(_dataObjArray[j]===undefined)
                    continue;
                else{
                    if(_newID<=_dataObjArray[j].id){
                        _newID=_dataObjArray[j].id+1;
                    }
                }
            }
            return _newID;
        }
    }

    /*
     * store obj array back to file
     *
     *
     * */
    this.storeDataObjArray=function(){

        var _tfpath=_fpath;
        var _stringfyArray=JSON.stringify(_dataObjArray);
        fs.truncate(_tfpath,0,function(){
            fs.writeFile(_tfpath, _stringfyArray,'utf8',function(err){
                if(err)
                {    _changed=1;
                    throw err;
                }
                else
                    _changed=0;

            })
        })


    }


}





