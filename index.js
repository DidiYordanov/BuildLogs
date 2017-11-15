var http = require('http');
const PORT = 8000;

function handleRequest(request, response){
  getLogData('BuildFailures.txt', function(logs){
    response.writeHead(200, {'Content-Type': 'text/html'});
    
    var content = logs.map(function(e){ 
      return '<li><pre>' + e.replace(/\\n/g, '\n') + '</pre></li>'; 
    }).join('');

    response.end('<ul>' + content + '</ul>');
  });
}


var fs = require('fs');
function readFile(path, success) {
  fs.readFile(path, 'utf8', function (err, data) {
    err ? console.log(err) : success(data);
  });
}

//Get the build_log field from Buildfailures.txt file using RegEx
function getLogData(filename, done) {
  readFile('/Users/Didi/Desktop/BuildFailures/' + filename, function(data) {
    var logs = [];
    data.match(/\s*"build_log"\s?: ".*"/g).forEach(function(e){
      logs.push(e.match(/\s*"build_log"\s?: "(.*)"/)[1]);
    });


//Get the build_log field from Buildfailures.txt file without using RegEx
    //var lines = data.split('\n');
    //var keyword = '"build_log" : ', index;
    //lines.forEach(function(line){
    // index = line.indexOf(keyword);
    //  if (index != -1) {
    //   logs.push(line.slice(index + keyword.length, line.length - 2));
    //  }
    //});

    done(logs);
  });
}


//Error messages 
function errorMessage(){
  getLogData('BuildFailures.txt', function(logs) {
    //var index, result, end;

    logs.forEach(function(msg, i) {
      
      // array of objects for each error type pattern and friendly message
      var errorTypeCollection = [
        {
          "pattern": "Code Sign error", //18 errors
          "message": "Code Sign error occured! Provisioning profiles not found. This product type must be built using a provisioning profile." 
        },
        {
          "pattern": "Build error: Error downloading and extracting project code", //5 errors
          "message": "An error occured while downloading and extracting project source code!" 
        },
        {
          "pattern": "failed to install cordova plugin", //2 errors
          "message": "Error building project source code! Failed to install cordova plugin!"
        },
        {
          "pattern": "Execution failed for task ':processReleaseManifest'", //34 errors
          "message": "minSdkVersion 10 cannot be smaller than version 14 declared in library. Suggestion: use tools:overrideLibrary=\"org.apache.cordova\" to force usage!" 
        },
        {
          "pattern": "Execution failed for task ':processDebugManifest'", //5 errors
          "message": "minSdkVersion 10 cannot be smaller than version 14 declared in library. Suggestion: use tools:overrideLibrary=\"org.apache.cordova\" to force usage!"
        },
        {
          "pattern": "Execution failed for task ':packageRelease'", //10 errors
          "message": "Failed to read key from keystore!"
        },
        {
          "pattern": "Execution failed for task ':compileDebugJava'", //4 errors
          "message": "Execution failed for task ':compileDebugJava'! Please check the cordova plugin"
        },
        {
          "pattern": "Execution failed for task ':compileReleaseJava'", //1 error
          "message": "something missing"
        },
        {
          "pattern": "Execution failed for task ':dexDebug'", //1 error
          "message": "Execution failed for task \":dexDebug\"!"
        },
        {
          "pattern": "Execution failed for task ':mergeDebugResources'", //7 errors
          "message": "Execution failed for task \":mergeDebugResources\"!"
        },
        {
          "pattern": "Execution failed for task ':processDebugResources", //1 error
          "message": "Execution failed for task \"ProcessDebugResources\"!" 
        },
        {
          "pattern": "Execution failed for task ':mergeReleaseResources'", //2 errors
          "message": "Execution failed for task \":mergeReleaseResources\"!"
        },
        {
          "pattern": "Execution failed for task ':prepareDebugDependencies'", //2 errors
          "message": "The prefix \"tools\" for attribute \"tools:replace\" associated with an element type \"application\" is not bound."
        },
        {
          "pattern": "Variable(s) missing",  //2 errors
          "message": "Error occured! Some plugins requires a parameters APP_ID=\"value\" and APP_NAME=\"value\"!"
        },
        {
          "pattern": "Failed to fetch plugin", //3 errors
          "message": "Either there is a connection problems, or plugin specification is incorrect. Please try to add it again!"
        },
        {
          "pattern": "A problem occurred evaluating root project 'android'", //3 errors
          "message": "A problem occurred evaluating root project 'android'. Missing key required \"keyAlias\"!"
        }
      ];

      //
      errorTypeCollection.forEach(function(errorType, x){
        if(msg.indexOf(errorType.pattern) != -1) {
          console.log("error is : " + errorType.message);
        } else {
          //console.log('Unknown Error Occured');
          //console.log(msg);
        }
      });
    });
  });
}



// $ node process-2.js one two=three four
// 0: node
// 1: /Users/mjr/work/node/process-2.js
// 2: one
// 3: two=three
// 4: four

if (process.argv[2] == 'server') {
  http.createServer(handleRequest).listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
  });
} else {
    errorMessage();
}
