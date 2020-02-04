//https://www.npmjs.com/package/clui
var BasicStopwatch = require('basic-stopwatch');
var clui = require('clui'),
    clc = require('cli-color'),
    Line = clui.Line;
var Progress = clui.Progress;
var Signal = require('signals') ;

function PannelLog(){
    var logTablesHeader = new Map() ;
    var logTablesLines  = new Map() ;
    let bWatch = new BasicStopwatch({outputFunc:(time)=>{
        //time is HH:MM:SS.mmm => HH:MM:SS
        return  time.slice(0,8);
    }});
    bWatch.start();
    let me = this ;
    this.appName = "" ;
    this.appVersion = "";
    this.timeUpdateScreen = 500 ;
    this.forceString = (item)=>{
        return item + "" ;
    }
    this.Progress = Progress ;
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
    this.memoryUsage = 0;
    var percent = new Progress(20) ;
    //TODO: make it works
    var timeRunning = bWatch.getElapsed();
    var percentString = percent.update(0);
    this.setPercentComplete = ( p )=>{
        percentTotal = p ;
        percentString = percent.update( p ) ;
        if(percentTotal >=1){
            percentString = "COMPLETE" ;
        }
    }
    this.getTimeRunning = ()=>{
        return timeRunning ;
    }
    this.getPercentComplete = ()=>{
        return Math.floor(( percentTotal/1)*100 );
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
            console.log.apply( null, logs[i] ) ; 
        }
    }
    function updateEcra(){
        timeRunning = bWatch.getElapsed();
        var loadColor = [clc.cyan] ;
        completeString = percentString ;
        
        var headers = new Line()
        .padding(2)
        .column('Application', 20, [clc.cyan])
        .column('Version', 20, [clc.cyan])
        .column('Time Running', 20, [clc.cyan])
        .column('Memory', 20, [clc.cyan])
        .column('Load', 20, loadColor)
        .fill()
        .output() ;
        
        var usedMemory = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100 ;
        me.memoryUsage = usedMemory*1;
        if(usedMemory > 1024){
            usedMemory =  Math.round((usedMemory/1024)*100)/100;
            usedMemory = usedMemory + " Gb";
        } else {
            usedMemory = usedMemory + " Mb";
        }
        var line = new Line()
        .padding(2)
        .column(me.appName, 20)
        .column(me.appVersion, 20)
        .column(timeRunning, 20)
        .column(usedMemory, 20)
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
        }, me.timeUpdateScreen) ;
    }
    this.stop = ()=>{
        clearInterval(intervalId) ;
    }
    
}

module.exports = new PannelLog() ;
