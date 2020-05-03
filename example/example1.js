var pannelLog = require('../index') ;
    pannelLog.appName = "My App";
    pannelLog.appVersion = "1.0.0";
    pannelLog.start() ;
    //you can pass real things
    setTimeout(pannelLog.setPercentComplete, 500, 0.2);
    setTimeout(pannelLog.setPercentComplete, 1000, 0.4);
    setTimeout(pannelLog.setPercentComplete, 1500, 0.6);
    setTimeout(pannelLog.setPercentComplete, 2000, 0.8);
    setTimeout(pannelLog.setPercentComplete, 2500, 1);
    //Your custom data
    function getBigData(){
        var arr = [];
        for(var i = 0; i < 10000; i++){
            arr.push({x:Math.random(), y:Math.random()});
        }
        return arr;
    }
    var infiniteArray = [];
    pannelLog.addLineGroup(2, "TESTS HERE") ;
    //make itens with method
    
    
    let count = 0;
    pannelLog.addItem(2, 2, (colorInfo)=>{
        if(count%2 == 0){
            colorInfo.color = [pannelLog.color.yellow];
        }
        return "TEST 1" ;
    }, 20, 44);
    pannelLog.addItem(2, 3, "TEST 2", 20, (colorInfo)=>{
        colorInfo.color = [pannelLog.color.blue];
        return count++;
    })


    //make lines with your own
    pannelLog.onUpdate.add(()=>{
        if(pannelLog.memoryUsage < 1200){
            //spending memory to test log
            for(var i = 0; i < 100; i++){
                infiniteArray.push({x:Math.random(), y:Math.random(), i, data:getBigData()});
            }
        }
        //my list
        var myList = [{x:1, value:3},{x:2, value:3},{x:3, value:3},{x:4, value:3},{x:5, value:3}] ;
        //create a line
        var width = 20 ;
        var headers = new pannelLog.Line()
        .padding(2)
        //create a column
        .column('Size', width, [pannelLog.color.cyan])
        .column('Length', width, [pannelLog.color.cyan])
        .column('Total', width, [pannelLog.color.cyan])
        .column('Money', width, [pannelLog.color.cyan])
        .fill()
        .output();
        
        //another line withi values
        var line = new pannelLog.Line()
        .padding(2)
        .column(Math.floor(Math.random()*30), width)
        .column(myList.length, width)
        .column(15, width)
        .column("$ "+(Math.random()*20000).toFixed(2), width)
        .fill()
        .output();
        //You also can use default console.log and it will persist on screen 
        console.log("----------------------------------------------------------------------------------------------") ;
        for(var i in myList){
            var item = myList[i] ;
            console.log("[ITEM "+i+"] x{"+item.x+" value: "+item.value+" ");  
        }

    }) ;