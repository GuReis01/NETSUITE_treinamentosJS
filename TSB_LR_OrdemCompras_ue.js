/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */

 define(['N/record', 'N/search', 'N/runtime'],

 function (record, search, runtime){


   function beforeLoad(scriptContext){
      var newRecord = scriptContext.newRecord;
      var type = scriptContext.type;
      var form = scriptContext.form;
      form.clientScriptModulePath = './TSB_LR_OrdemCompras_cs.js';

      

      var status = newRecord.getValue({fieldId: 'custrecord_tsb_lr_ordc_status'});

      if(status == 1 || type == 'view'){
         
         form.addButton({
            id: 'custpage_button_buttonapprove',
            label: 'Aprovar Pedido',
            functionName: "approve('" + newRecord.id + "','" + newRecord.type + "')"
         });
      }

      if(type == 'view'){

         form.addButton({
            id: 'custpage_button_buttonprint',
            label: 'Imprimir Relatório',
            functionName: "printDocument('" + newRecord.id + "','" + newRecord.type + "')"
         });
      }
   }
   return{
      beforeLoad: beforeLoad,
   };
 });