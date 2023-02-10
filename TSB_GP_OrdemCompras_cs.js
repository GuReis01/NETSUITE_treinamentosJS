/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */

define([
   'N/record',
   'N/search'
],

function(
   record,
   search
){

   function pageInit(scriptContext){

   };

   function saveRecord(scriptContext){
      return true;
   };

   function validateField(scriptContext){
      return true;
   };

   function fieldChanged(scriptContext){

      var currRec = scriptContext.currentRecord;
      var currentField = scriptContext.fieldId;
      var currentSublist = scriptContext.sublistId;

      if(currentField == 'custrecord_tsb_gp_ordc_status'){

         copyStatusToName(currRec);

      }

      if(currentSublist == 'recmachcustrecord_tsb_gp_promo_ordcompras'){

         if(currentField == 'custrecord_tsb_gp_promo_promocao'){

            var promoId = currRec.getCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_gp_promo_ordcompras',
               fieldId: 'custrecord_tsb_gp_promo_promocao'
            });

            var promoLookup = search.lookupFields({
               type: 'customrecord_tsb_lr_promo',
               id: promoId,
               columns: [
                  'custrecord_tsb_lr_promo_perdesc'
               ]
            });

            currRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_gp_promo_ordcompras',
               fieldId: 'custrecord_tsb_gp_promo_desc',
               value: promoLookup.custrecord_tsb_lr_promo_perdesc
               //ignoreFieldChange: true
            });
            
            // var promoRec = record.load({
            //    type: 'customrecord_tsb_lr_promo',
            //    id: promoId,
            //    isDynamic: true
            // });

            // var percentualDesconto = promoRec.getValue({
            //    fieldId: 'custrecord_tsb_lr_promo_perdesc'
            // });

            // currRec.setCurrentSublistValue({
            //    sublistId: 'recmachcustrecord_tsb_gp_promo_ordcompras',
            //    fieldId: 'custrecord_tsb_gp_promo_desc',
            //    value: percentualDesconto,
            //    //ignoreFieldChange: true
            // });

            // promoLookup.custrecord_tsb_lr_promo_perdesc.length ? promoLookup.custrecord_tsb_lr_promo_perdesc[0].value : ''
   
         }

      }
      
      

      return true;

   };

   function postSourcing(scriptContext){

   };

   function lineInit(scriptContext){

   };

   function validateDelete(scriptContext){
      return true;
   };

   function validateInsert(scriptContext){
      return true;
   };

   function validateLine(scriptContext){
      return true;
   };

   function sublistChanged(scriptContext){
      return true;
   };

   ////////////////////////////////////////////////////////////////////////////////////////////////////

   function copyStatusToName(currRec){

      var statusValue = currRec.getText({
         fieldId: 'custrecord_tsb_gp_ordc_status'
      });

      var question = confirm('Alterar campo nome?');

      if(question){

         var quantity = prompt('Quantas vezes você quer que o status seja repetido no campo nome?', '1');

         if (isNaN(quantity)) {

            alert('Insira um número inteiro!');

         } else {

            for(var count = 1; count < quantity; count ++){
               statusValue = statusValue + ' ' + statusValue;
            }

            currRec.setValue({
               fieldId: 'custrecord_tsb_gp_ordc_nome',
               value: statusValue
            });

            alert('O campo nome foi alterado');

         }

      }

   }
$$get
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
      sublistChanged: sublistChanged
   };

});