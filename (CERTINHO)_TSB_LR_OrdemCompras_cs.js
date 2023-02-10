/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */

 define([
   'N/record',
   'N/search'
],

function (
   record,
   search
){

   function validarPromocao(currentRecord){

      var currRec = currentRecord.currentRecord;

      var subsidiariaPromo = promoRec.getValue({
         fieldId: 'custrecord_tsb_lr_promo_subs'
      });

      var subsidiariaOrdemCompra = currRec.getValue({
         fieldId: 'custrecord_tsb_lr_ordc_subs'
      });

      subsidiariaOrdemCompra == subsidiariaPromo ? fieldChanged(scriptContext) : alert('A subsidiária da promoção não corresponde à subsidiária da Ordem de Compras.')

   }


   function fieldChanged(scriptContext){

      var currRec = scriptContext.currentRecord;
      var currentField = scriptContext.fieldId;
      var currentSublist = scriptContext.sublistId;

      if(currentSublist == 'recmachcustrecord_tsb_lr_listpro_ordcomp'){

         if(currentField == 'custrecord_tsb_lr_listpromo_promo'){

            validarPromocao(currentRecord)

      
            var promoId = currRec.getCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
               fieldId: 'custrecord_tsb_lr_listpromo_promo'
            });

            var promoRec = record.load({
               type: 'customrecord_tsb_lr_promo',
               id: promoId,
               isDynamic: true
            });

            var percentualDesconto = promoRec.getValue({
               fieldId: 'custrecord_tsb_lr_promo_perdesc'
            });

            var dataInicio = promoRec.getValue({
               fieldId: 'custrecord_tsb_lr_promo_dataini'
            });

            var dataFim = promoRec.getValue({
               fieldId: 'custrecord_tsb_lr_promo_datafim'
            });

            currRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
               fieldId: 'custrecord_tsb_lr_listpromo_perdesc',
               value: percentualDesconto
               
            });
            
            currRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
               fieldId: 'custrecord_tsb_lr_lispromo_dataini',
               value: dataInicio
            });

            currRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
               fieldId: 'custrecord_tsb_lr_lispromo_datafim',
               value: dataFim
            });

         }

      }
   }

   return{
      fieldChanged: fieldChanged
   }

});