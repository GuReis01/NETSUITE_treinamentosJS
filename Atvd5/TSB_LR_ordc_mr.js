/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */

define([
   'N/runtime',
   'N/record'
],

   function (
      runtime,
      record

   ) {

      function getInputData() {

         const params = JSON.parse(runtime.getCurrentScript().getParameter({ name: 'custscript_tsb_lr_ordc_mr_id' }))

         log.debug({
            title: 'funtion get Input Data',
            details: params
         });

         return params;
      };

      function map(context) {

         var ordc = JSON.parse(context.value);

         log.debug({
            title: 'function Map',
            details: ordc.id
         });

         var ordcRec = record.load({
            type: 'customrecord_tsb_lr_ordcomp',
            id: ordc.id
         });


         var lineQty = ordcRec.getLineCount({
            sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp'
         });

         for (count = 0; count < lineQty; count++) {

            var itemId = ordcRec.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'id',
               line: count
            });

            context.write({
               key: ordc.id,
               value: itemId
            });

         }

      };

      function reduce(context) {

         log.debug({
            title: 'function reduce',
            details: context.key
         });

         var histValuesArr = [];

         for (count = 0; count < context.values.length; count++) {

            var lineItemsRec = record.load({
               type: 'customrecord_tsb_lr_itens',
               id: context.values[count]
            });

            var histLineQty = lineItemsRec.getLineCount({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens'
            });

            // log.debug({
            //    title: 'quantidade de linhas',
            //    details: histLineQty
            //    });

            if (histLineQty > 0) {
               getHistValues(lineItemsRec, histLineQty, histValuesArr);
            }
            
         }

         var stringHistValuesArr = JSON.stringify(histValuesArr);

         log.debug({
            title: 'Valores Histórico de Alteração ',
            details: stringHistValuesArr
         });

         var itemsArray = JSON.parse(stringHistValuesArr)

         var currOrdcRec = record.load({
            type: 'customrecord_tsb_lr_ordcomp',
            id: key,
            isDynamic: true
         });

         setHistItems(itemsArray, currOrdcRec);

         currOrdcRec.save();

         context.write({
            key: context.key,
            value: stringHistValuesArr
         });
      };

      function summarize(context) {

         var array = [];

         context.output.iterator().each(function (key, value) {

            array.push("key: " + key + "value: " + value);
            return true;
         });
         
         log.debug({
            title: 'function summarize',
            details: array
         });

      };


      function getHistValues(lineItemsRec, histLineQty, histValuesArr) {

         for (count = 0; count < histLineQty; count++) {

            var obj = {};

            obj.id = lineItemsRec.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'id',
               line: count
            });

            obj.descricao = lineItemsRec.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_descr',
               line: count
            });

            obj.item = lineItemsRec.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_item',
               line: count
            });

            obj.quantidade = lineItemsRec.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_qtd',
               line: count
            });

            obj.diretor = lineItemsRec.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_dir',
               line: count
            });

            obj.gerente = lineItemsRec.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_ger',
               line: count
            });

            obj.status = lineItemsRec.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_stts',
               line: count
            });

            obj.valor = lineItemsRec.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_val',
               line: count
            });

            obj.valorDesconto = lineItemsRec.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'ustrecord_tsb_lr_histalter_valdesc',
               line: count
            });

            obj.valorTotal = lineItemsRec.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_valtot',
               line: count
            });

            obj.percentualDesconto = lineItemsRec.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_perdesc',
               line: count
            });

            obj.tipoDetalhe = lineItemsRec.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_tipodetal',
               line: count
            });

            obj.promocaoAplicada = lineItemsRec.getSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_histalter_linitens',
               fieldId: 'custrecord_tsb_lr_histalter_promoapli',
               line: count
            });

            histValuesArr.push(obj)
         }
      };

      function setHistItems(itemsArray, currOrdcRec){
         itemsArray.forEach(item => {

            currOrdcRec.selectNewLine({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp'
            });

            currOrdcRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_descr',
               value: item.descricao
            });

            currOrdcRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_item',
               value: item.item
            });
            
            currOrdcRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_qtd',
               value: item.quantidade
            });

            currOrdcRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_dir',
               value: item.diretor
            });

            currOrdcRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_gerente',
               value: item.gerente
            });

            currOrdcRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_status',
               value: item.status
            });

            currOrdcRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_val',
               value: item.valor
            });

            currOrdcRec.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               fieldId: 'custrecord_tsb_lr_itens_tipdet',
               value: item.tipoDetalhe
            });

            // if(item.valorDesconto > 0){

            //    currOrdcRec.setCurrentSublistValue({
            //       sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
            //       fieldId: 'custrecord_tsb_lr_itens_valdesc',
            //       value: item.valorDesconto
            //    });

            //    currOrdcRec.setCurrentSublistValue({
            //       sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
            //       fieldId: 'custrecord_tsb_lr_itens_valtotal',
            //       value: item.valorTotal
            //    });

            //    currOrdcRec.setCurrentSublistValue({
            //       sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
            //       fieldId: 'custrecord_tsb_lr_itens_perdesc',
            //       value: item.percentualDesconto
            //    });

            //    currOrdcRec.setCurrentSublistValue({
            //       sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
            //       fieldId: 'custrecord_tsb_lr_itens_promoapli',
            //       value: item.promocaoAplicada
            //    });
            // }

            currOrdcRec.commitLine({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp'
            });
         });
      }

      return {
         getInputData: getInputData,
         map: map,
         reduce: reduce,
         summarize: summarize
      };

   });