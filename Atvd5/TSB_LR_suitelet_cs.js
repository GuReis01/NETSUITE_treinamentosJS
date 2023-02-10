/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */

define([
   'N/currentRecord', 'N/url', 'N/https'
],

   function (
      currentRecord, url, https
   ) {



      /**
       * Function to be executed after page is initialized.
       *
       * @param {Object} scriptContext
       * @param {Record} scriptContext.currentRecord - Current form record
       * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
       *
       * @since 2015.2
       */
      function pageInit(scriptContext, form) {

      };

      /**
       * Validation function to be executed when record is saved.
       *
       * @param {Object} scriptContext
       * @param {Record} scriptContext.currentRecord - Current form record
       * @returns {boolean} Return true if record is valid
       *
       * @since 2015.2
       */
      function saveRecord(scriptContext) {
         return true;
      };

      /**
       * Validation function to be executed when field is changed.
       *
       * @param {Object} scriptContext
       * @param {Record} scriptContext.currentRecord - Current form record
       * @param {string} scriptContext.sublistId - Sublist name
       * @param {string} scriptContext.fieldId - Field name
       * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
       * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
       *
       * @returns {boolean} Return true if field is valid
       *
       * @since 2015.2
       */
      function validateField(scriptContext) {
         return true;
      };

      /**
       * Function to be executed when field is changed.
       *
       * @param {Object} scriptContext
       * @param {Record} scriptContext.currentRecord - Current form record
       * @param {string} scriptContext.sublistId - Sublist name
       * @param {string} scriptContext.fieldId - Field name
       * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
       * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
       *
       * @since 2015.2
       */
      function fieldChanged(scriptContext) {
         //return true; Se ele estiver sendo usado, retornar true.
      };

      /**
       * Function to be executed when field is slaved.
       *
       * @param {Object} scriptContext
       * @param {Record} scriptContext.currentRecord - Current form record
       * @param {string} scriptContext.sublistId - Sublist name
       * @param {string} scriptContext.fieldId - Field name
       *
       * @since 2015.2
       */
      function postSourcing(scriptContext) {

      };

      /**
       * Function to be executed after line is selected.
       *
       * @param {Object} scriptContext
       * @param {Record} scriptContext.currentRecord - Current form record
       * @param {string} scriptContext.sublistId - Sublist name
       *
       * @since 2015.2
       */
      function lineInit(scriptContext) {

      };

      /**
       * Validation function to be executed when record is deleted.
       *
       * @param {Object} scriptContext
       * @param {Record} scriptContext.currentRecord - Current form record
       * @param {string} scriptContext.sublistId - Sublist name
       *
       * @returns {boolean} Return true if sublist line is valid
       *
       * @since 2015.2
       */
      function validateDelete(scriptContext) {
         return true;
      };

      /**
       * Validation function to be executed when sublist line is inserted.
       *
       * @param {Object} scriptContext
       * @param {Record} scriptContext.currentRecord - Current form record
       * @param {string} scriptContext.sublistId - Sublist name
       *
       * @returns {boolean} Return true if sublist line is valid
       *
       * @since 2015.2
       */
      function validateInsert(scriptContext) {
         return true;
      };

      /**
       * Validation function to be executed when sublist line is committed.
       *
       * @param {Object} scriptContext
       * @param {Record} scriptContext.currentRecord - Current form record
       * @param {string} scriptContext.sublistId - Sublist name
       *
       * @returns {boolean} Return true if sublist line is valid
       *
       * @since 2015.2
       */
      function validateLine(scriptContext) {
         return true;
      };

      /**
       * Function to be executed after sublist is inserted, removed, or edited.
       *
       * @param {Object} scriptContext
       * @param {Record} scriptContext.currentRecord - Current form record
       * @param {string} scriptContext.sublistId - Sublist name
       *
       * @since 2015.2
       */
      function sublistChanged(scriptContext) {
         return true;
      };

      function callMapProcess() {

         var currRec = currentRecord.get();

         var lineQty = currRec.getLineCount({
            sublistId: 'custpage_post_sublist'
         });

         var checkedItemsArray = [];

         for (var count = 0; count < lineQty; count++) {

            var obj = {};

            var isTake = currRec.getSublistValue({
               sublistId: 'custpage_post_sublist',
               fieldId: 'custpage_sublistcheckbox',
               line: count
            });

            if (isTake == true) {

               obj.isTake = isTake;

               obj.id = currRec.getSublistValue({
                  sublistId: 'custpage_post_sublist',
                  fieldId: 'custpage_sublistid',
                  line: count
               });
               
               checkedItemsArray.push(obj)
            }

            
         }

         var connectionUrl = url.resolveScript({
            scriptId: 'customscript_tsb_lr_ordc_rl',
            deploymentId: 'customdeploy_tsb_lr_ordc_rl'
         });

         https.post({
            url: connectionUrl,
            body: JSON.stringify(checkedItemsArray)
         });

         console.log(connectionUrl)
         console.log(checkedItemsArray)
      }

      return {
         pageInit: pageInit,
         saveRecord: saveRecord,
         validateField: validateField,
         fieldChanged: fieldChanged,
         postSourcing: postSourcing,
         lineInit: lineInit,
         validateDelete: validateDelete,
         validateInsert: validateInsert,
         validateLine: validateLine,
         sublistChanged: sublistChanged,
         callMapProcess: callMapProcess
      };

   });