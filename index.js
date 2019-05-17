//https://www.npmjs.com/package/clui
var clui = require('clui'),
    clc = require('cli-color'),
    Line = clui.Line;
var Progress = clui.Progress;
var Signal = require('signals') ;
function PannelLog(){
    let me = this ;
    this.appName = "" ;
    this.appVersion = "";
    this.forceString = (item)=>{
        return item + "" ;
    }
    //line class
    this.Line = function(){
        let _this = this;
        let line = new Line() ;
        this.padding = (value)=>{
            line.padding(value) ;
            return _this;
        }
        this.column = (content, width = 30, color = null)=>{
            content = me.forceString( content ) ;
            line.column( content , width, color ) ;
            return _this;
        }
        this.fill = ()=>{
            line.fill() ;
            return _this ;
        }
        this.output = ()=>{
            line.output();
            return _this;
        }
    } ;
    this.newLineString = "----------------------------------------------------------------------------------------------";
    this.color = clc ;
    /**
     * Every update ecra step, after clear ecra
     */
    this.onUpdate = new Signal() ;
    let logs = [];
    var limitLog = 10 ;
    let percentTotal = 0 ;
    var percent = new Progress(20) ;
    //TODO: make it works
    var timeRunning = "0:00";
    var percentString = percent.update(0);
    this.setPercentComplete = ( p )=>{
        percentTotal = p ;
        percentString = percent.update( p ) ;
        if(percentTotal >=1){
            percentString = "COMPLETE" ;
        }
    }
    this.setLimitLog = (limit)=>{
        limit = parseInt(limit) ;
        if(isNaN(limit)){
            return;
        }
        if(limit < 0 ){
            return ;
        }
        limitLog = limit ;
    }
    function doAdd(){
            var args = Array.from( arguments );
            logs.push(args) ;
            while(logs.length > limitLog){
                logs.shift() ;
            }
    }
    this.addLog = doAdd ;
    function updateLogEcra(){
        for(var i in logs){
            //console.log(logs[i]) ;
            console.log.apply( logs[i] ) ; 
        }
    }
    function updateEcra(){

        var loadColor = [clc.cyan] ;
        completeString = percentString ;
        
        var headers = new Line()
        .padding(2)
        .column('Application', 20, [clc.cyan])
        .column('Version', 20, [clc.cyan])
        .column('Time Running', 20, [clc.cyan])
        .column('Load', 20, loadColor)
        .fill()
        .output() ;
        
        var line = new Line()
        .padding(2)
        .column(me.appName, 20)
        .column(me.appVersion, 20)
        .column(timeRunning, 20)
        .column(percentString, 40)
        .fill()
        .output() ;
    }
    let intervalId = null ;
    this.start = ()=>{
        me.stop() ;
        intervalId = setInterval(()=>{
            console.clear();
            updateEcra();
            console.log( me.newLineString ) ;
            me.onUpdate.dispatch();
            updateLogEcra() ;
            console.log( me.newLineString ) ;
        }, 200) ;
    }
    this.stop = ()=>{
        clearInterval(intervalId) ;
    }
    
}

module.exports = new PannelLog() ;
