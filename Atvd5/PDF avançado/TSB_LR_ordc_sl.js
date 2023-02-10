/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 */

define([
   'N/file'
], 

function(
   file
){
  
    function onRequest(context){
  
        if(context.request.method == 'GET'){
            runGet(context);
        }else if(context.request.method == 'POST'){
            runPost(context);
        }

    };

    function runGet(context){
      
    };

    function runPost(context){

    };
  
    return {
        onRequest: onRequest
    };

});