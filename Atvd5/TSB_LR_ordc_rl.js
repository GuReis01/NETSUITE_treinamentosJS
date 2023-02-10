/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */

 define([
   "N/task"
],

   function (
      task
   ) {

      function _get(context) {
      }

      function _post(context) {

         try {

            var objParameters = JSON.parse(context);

            task.create({
               taskType: task.TaskType.MAP_REDUCE,
               scriptId: "customscript_tsb_lr_ordc_mr",
               params: {
                  "custscript_tsb_lr_ordc_mr_id": objParameters
               }
            }).submit();

            log.debug({
               title: 'objParameters',
               details: objParameters
            });

            return 'OK';

         } catch (error) {
            throw error;
         }

      }

      function _put(context) {
      }

      function _delete(context) {
      }

      return {
         get: _get,
         post: _post,
         put: _put,
         delete: _delete
      };

   });