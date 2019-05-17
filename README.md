# panel Log

To show panels in console log.
It not work on VSCode output and some anothers IDEs.

## Output

```
  Application         Version             Time Running        Load                                                                                  
  My App              1.0.0               0:00                COMPLETE                                                                              
----------------------------------------------------------------------------------------------
  Size                Length              Total               Money                                                                                 
  10                  5                   15                  $ 510.37                                                                              
----------------------------------------------------------------------------------------------
[ITEM 0] x{1 value: 3 
[ITEM 1] x{2 value: 3 
[ITEM 2] x{3 value: 3 
[ITEM 3] x{4 value: 3 
[ITEM 4] x{5 value: 3 
----------------------------------------------------------------------------------------------

```

# Install

To install using npm

```

npm i  panel-log

```

## Git repository

https://github.com/reytuty/panel-log


# Instantate 

```
var panelLog = require('panel-log') ;
    panelLog.appName = "My App";
    panelLog.appVersion = "1.0.0";
    panelLog.start() ;
```
