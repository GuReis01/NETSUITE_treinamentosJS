/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */

define([
   'N/record',
   'N/format'
],

   function (
      record,
      format
   ) {

      /**
       * Function definition to be triggered before record is loaded.
       *
       * @param {Object} scriptContext
       * @param {Record} scriptContext.newRecord - New record
       * @param {string} scriptContext.type - Trigger type
       * @param {Form} scriptContext.form - Current form
       * @Since 2015.2
       */
      function beforeLoad(scriptContext) {
         var type = scriptContext.type;
         var newRecord = scriptContext.newRecord;
         var form = scriptContext.form;

         if (newRecord.type == "customrecord_tsb_lr_ordcomp") {
            form.clientScriptModulePath = './TSB_LR_suitelet_cs.js';

            // if(type == "view"){

            //    form.addButton({
            //       id: 'custpage_lr_buttoncallmap',
            //       label: 'Call Map',
            //       functionName: "callMapProcess('" + newRecord.id + "')"
            //    });
            // }
         }
      };


      /**
       * Function definition to be triggered before record is loaded.
       *
       * @param {Object} scriptContext
       * @param {Record} scriptContext.newRecord - New record
       * @param {Record} scriptContext.oldRecord - Old record
       * @param {string} scriptContext.type - Trigger type
       * @Since 2015.2
       */
      function afterSubmit(scriptContext) {
         var type = scriptContext.type;
         var oldRecord = scriptContext.oldRecord;
         var newRecord = scriptContext.newRecord;


         var newRecArray = [];
         getNewRecordLinesInfo(newRecord, newRecArray);

         var oldRecArray = [];
         getOldRecordLinesInfo(oldRecord, oldRecArray);

         var sameItems = getSameItems(oldRecArray, newRecArray);

         if(sameItems.length == 0){
            return;
         }

         var itemsChangedArray = [];
         
         validateChangedFields(sameItems, itemsChangedArray);

         if(itemsChangedArray.length > 0){

            setValues(itemsChangedArray);

            log.debug({
               title: 'items alterados',
               details: itemsChangedArray
            });
         }
         
      };


      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
     

      function getNewRecordLinesInfo(newRecord, newRecArray) {

         var qtdLinhas = newRecord.getLineCount({
            sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp'
         });


         for (var count = 0; count < qtdLinhas; count++) {

            newRecObj = {};

            newRecObj.id = newRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'id',
               line: count
            });

            newRecObj.item = newRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_item',
               line: count
            });

            newRecObj.descricao = newRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_descr',
               line: count
            });

            newRecObj.quantidade = newRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_qtd',
               line: count
            });

            newRecObj.status = newRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_status',
               line: count
            });

            newRecObj.gerente = newRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_gerente',
               line: count
            });

            newRecObj.diretor = newRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_dir',
               line: count
            });

            newRecObj.valor = newRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_val',
               line: count
            });

            newRecObj.valorDesconto = newRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_valdesc',
               line: count
            });

            newRecObj.valorTotal = newRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_valtotal',
               line: count
            });

            newRecObj.percentualDesconto = newRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_perdesc',
               line: count
            });

            newRecObj.tipoDetalhe = newRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_tipdet',
               line: count
            });

            newRecObj.promocaoAplicada = newRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_promoapli',
               line: count
            });

            newRecArray.push(newRecObj);

         }

         if(newRecArray.length == 0){
            return;
         }
      }

      function getOldRecordLinesInfo(oldRecord, oldRecArray) {

         var qtdLinhas = oldRecord.getLineCount({
            sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp'
         });

         for (var count = 0; count < qtdLinhas; count++) {

            oldRecObj = {};

            oldRecObj.id = oldRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'id',
               line: count
            });

            oldRecObj.item = oldRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_item',
               line: count
            });

            oldRecObj.descricao = oldRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_descr',
               line: count
            });

            oldRecObj.quantidade = oldRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_qtd',
               line: count
            });

            oldRecObj.status = oldRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_status',
               line: count
            });

            oldRecObj.gerente = oldRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_gerente',
               line: count
            });

            oldRecObj.diretor = oldRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_dir',
               line: count
            });

            oldRecObj.valor = oldRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_val',
               line: count
            });

            oldRecObj.valorDesconto = oldRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_valdesc',
               line: count
            });

            oldRecObj.valorTotal = oldRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_valtotal',
               line: count
            });

            oldRecObj.percentualDesconto = oldRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_perdesc',
               line: count
            });

            oldRecObj.tipoDetalhe = oldRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_tipdet',
               line: count
            });

            oldRecObj.promocaoAplicada = oldRecord.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_promoapli',
               line: count
            });

            oldRecArray.push(oldRecObj)

         }

         if(oldRecArray.length == 0){
            return;
         }
      }

      function getSameItems(oldRecArray, newRecArray) {

         var sameItemsArray = [];

            oldRecArray.map((elemen) => {

               var objSameItems = {};

               var filteredArray = newRecArray.filter(item => item.id == elemen.id);

               if(filteredArray.length != 0){

                  objSameItems.newItem = filteredArray[0];
                  objSameItems.oldItem = elemen;

                  sameItemsArray.push(objSameItems)
               }
            });

         return sameItemsArray;
      }

      function validateChangedFields(sameItems, itemsChangedArray){
         
         sameItems.map(item => {

            var newItem = item.newItem;
            var oldItem = item.oldItem;

            // log.debug({
            //    title: "Objeto OLD",
            //    details: oldItem  
            // }); 
            
            // log.debug({
            //    title: "Objeto New",
            //    details: newItem  
            // }); 

            for(var key in oldItem){


               if(oldItem[key] != newItem[key]){

                  // log.debug({
                  //    title: 'Houve alteração',
                  //    details: itemsChangedArray
                  // });

                  itemsChangedArray.push(item);
               }
            }
         });
      }

      function setValues(itemsChangedArray){
         itemsChangedArray.forEach(item => {

            var itemValue = item.oldItem;

            var currRec = record.load({
               type: 'customrecord_tsb_lr_itens',
               id: itemValue.id,
               isDynamic: true
            });

            
            currRec.selectNewLine({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens'
            });
            
            var currDate = new Date();

            currDate = format.parse({
               value: currDate,
               type: format.Type.DATE
            });

            currRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_datacri',
               value: currDate,
            });

            currRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_item',
               value: itemValue.item,
            });

            currRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_descr',
               value: itemValue.descricao,
            });

            currRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_qtd',
               value: itemValue.quantidade,
            });

            currRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_stts',
               value: itemValue.status,
            });
            
            currRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_ger',
               value: itemValue.gerente,
            });

            currRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_dir',
               value: itemValue.diretor,
            });

            currRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_val',
               value: itemValue.valor,
            });

            currRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_valdesc',
               value: itemValue.valorDesconto,
            });

            currRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_valtot',
               value: itemValue.valorTotal,
            });

            currRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_perdesc',
               value: itemValue.percentualDesconto,
            });

            currRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_tipodetal',
               value: itemValue.tipoDetalhe,
            });

            currRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_promoapli',
               value: itemValue.promocaoAplicada,
            });

            currRec.commitLine({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens'
            });

            var teste = currRec.save();

            log.debug({
               title: 'teste',
               details: teste
            });

         });
      }


      return {
         beforeLoad: beforeLoad,
         afterSubmit: afterSubmit
      };

   });