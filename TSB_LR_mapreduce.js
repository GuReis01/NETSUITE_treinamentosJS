/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */

define([

],

   function (

   ) {

      /////////ESCOLHE AS INFORMAÇÕES QUE SERÃO PROCESSADAS 10.000gov pts
      function getInputData() {

         var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

         log.debug({
            title: 'function getInputData',
            details: array
         });

         return array;
      }

      /////////RECEBE AS INFORMAÇÕES, PERCORRE POR CADA UM DOS ELEMENTOS DA GET INPUT DATA 1.000gov pts
      function map(context) {

         var element = JSON.parse(context.value);

         log.debug({
            title: 'function map',
            details: element
         });

         if ((element % 2 != 0)) {

            context.write({
               key: 'impar',
               value: element
            });
         } else {

            context.write({
               key: 'par',
               value: element
            });
         }
      }

      /////////PROCESSA UM AGRUPAMENTO FEITO PELO MAP  5.000gov pts
      function reduce(context) {

         var string = 'Key: ' + context.key + " - Values: " + JSON.stringify(context.values);

         log.debug({
            title: 'function reduce',
            details: string
         });

         var result = 0;

         for (var count = 0; count < context.values.length; count++) {
            result = result + parseInt(context.values[count]);
         }

         context.write({
            key: context.key,
            value: result
         });
      }

      /////////PROCESSAMENTOS FINAIS
      function summarize(context) {

         var array = [];

         context.output.iterator().each(function (key, value) {
            array.push("Key: " + key + " - Value: " + value);
            return true;
         });

         log.debug({
            title: 'function summarize',
            details: array
         });

      }

      return {
         getInputData: getInputData,
         map: map,
         reduce: reduce,
         summarize: summarize
      };

   });

