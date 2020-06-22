//https://www.npmjs.com/package/clui
var BasicStopwatch = require('basic-stopwatch');
var clui = require('clui'),
    clc = require('cli-color'),
    Line = clui.Line;
var Progress = clui.Progress;
var Signal = require('signals') ;
const readline = require('readline');

function PannelLog(){
    let groupLines = new Map() ;
    let lineGroup = new Map() ;
    let maxLines = 0;
    let maxColumns = 0 ;
    let hasExtraItens = false ;
    let channelList = new Map() ;
    this.registerChannel = (channelKey, channelName)=>{
        if(channelKey.length == 1){
            channelList.set(channelKey, channelName) ;
            return ;
        }
        throw new Error("registerChannel need to char on channelKey, like a, b or c not words") ;
    }
    this.clearChannel = ()=>{
        channelList.clear() ;
    }
    this.emptySpace = {
        width:20
    };
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
    let currentChannel = null ;
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
    this.setChannel = (channel = null)=>{
        currentChannel = channel ;
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
    function getLineMap(line){
        if( !groupLines.has(line) ){
            groupLines.set(line, new Map());
        }
        return groupLines.get(line);
    }
    
    this.addLineGroup = (line, label, color = [clc.red], channel = null)=>{
        lineGroup.set(line+channel, {label, color});
    }
    this.addLineItem = (lineIndex, columnIndex, width, methodToGetValueOrValue, channel = null)=>{
        me.addItem(lineIndex, columnIndex, null, width, methodToGetValueOrValue, channel) ;
    }
    this.resetItens = ()=>{
        groupLines.clear() ;
        lineGroup.clear();
        hasExtraItens = false ;
    }
    this.removeItem = (lineIndex, columnIndex)=>{
        groupLines.delete( lineIndex ) ;
        hasExtraItens = (groupLines.size > 0) ;
    }
    this.addItem = (lineIndex, columnIndex, label, width, methodToGetValueOrValue, channel = null)=>{
        if(maxColumns < columnIndex){
            maxColumns = columnIndex ;
        }
        if(maxLines < lineIndex){
            maxLines = lineIndex ;
        }
        var item = {label, width, methodToGetValueOrValue};
        var lineMap = getLineMap(lineIndex+channel);
        lineMap.set(columnIndex, item);
        hasExtraItens = true ;
    }
    function drawEmpty(line){
        line.padding( me.emptySpace.width );
    }
    function drawLine(lineItem, propName = "label", color){
        var hasLine = false ;
        var lineDraw = new Line();
        lineDraw.padding(2) ;
        for(var j = 0; j <= maxColumns; j++){
            if(lineItem.has(j)){
                var col = lineItem.get(j);
                if(col[propName]){
                    hasLine = true ;
                }
                var type = typeof(col[propName]);
                var c = {color:color.color};
                var val = (type=="function")? col[propName](c) : col[propName]
                lineDraw.column(val+"", col.width, c.color)
            } else {
                drawEmpty(lineDraw);
            }
        }
        if(hasLine){
            lineDraw.fill().output() ;
        }
    }
    function updateItens(channel = null){
        if(!hasExtraItens){
            return;
        }
        for(var i = 0; i <= maxLines; i++){
            if(lineGroup.has(i+channel)){
                var group = new Line()
                .padding(2)
                .column(me.newLineString, me.newLineString.length, [clc.white])
                .fill()
                .output() ;
                var labelLine = lineGroup.get(i+channel);
                var group = new Line()
                .padding(2)
                .column(labelLine.label+"", 120, labelLine.color)
                .fill()
                .output() ;
            }
            var line = getLineMap(i+channel);
            if(line.size > 0){
                //draw titles
                drawLine(line, "label", {color:[clc.cyan]})
                //draw values
                drawLine(line, "methodToGetValueOrValue", {color:[clc.white]})
            } 
        }
    }
    function updateEcra(){
        timeRunning = bWatch.getElapsed();
        var loadColor = [clc.cyan] ;
        completeString = percentString ;
        var strShortCuts = "";
        if(channelList.size > 0){
            channelList.forEach((val, key)=>{
                strShortCuts += "[ ("+key+") "+val+" ]" ;
            })
        }
        var headers = new Line()
        .padding(2)
        .column('Application', 20, [clc.cyan])
        .column('Version', 20, [clc.cyan])
        .column('Time Running', 20, [clc.cyan])
        .column('Memory', 20, [clc.cyan])
        .column('Load', 20, loadColor)
        .column('Shortcuts', (strShortCuts.length>0)?strShortCuts.length+1:16, [clc.cyan])
        .fill()
        .output() ;
        
        var usedMemory = Math.round(process.memoryUsage().rss / 1048576);
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
        .column(strShortCuts.length > 0 ? strShortCuts : "no shortcuts", strShortCuts.length > 0 ? strShortCuts.length+1: 16 )
        .fill()
        .output() ;
        updateItens();
        if(currentChannel){
            updateItens(currentChannel)
        }
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
    let pannelOn = true ;
    function setReadLineKeypress(){ 
        readline.emitKeypressEvents(process.stdin);
        try{
            process.stdin.setRawMode(true);
        } catch(e){
            //
        }
        process.stdin.on('keypress', (str, key) => {
            if (key.ctrl && key.name === 'c') {
                process.exit();
            }
            if (key.ctrl && key.name === 'o') {
                pannelOn = !pannelOn;
                (pannelOn)?me.start():me.stop() ;
            }
            if (channelList.has(key.name)) {
                //change to show vessels
                me.setChannel(key.name) ;
            }
        });
        }
        setReadLineKeypress();
}

module.exports = new PannelLog() ;
