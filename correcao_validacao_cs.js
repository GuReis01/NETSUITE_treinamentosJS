/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

 define([
   'N/record',
   'N/search',
   'N/currentRecord'
],

   function (
      record,
      search,
      currentRecord
   ) {

      function pageInit(scriptContext) {

      };

      function saveRecord(scriptContext) {
         return true;
      };

      function validateField(scriptContext) {
         return true;
      };

      function fieldChanged(scriptContext) {

         var currRec = scriptContext.currentRecord;
         var currentField = scriptContext.fieldId;
         var currentSublist = scriptContext.sublistId;
         var returnValidation = true;

         if (currentSublist == "recmachcustrecord_tsb_lr_listpro_ordcomp") {

            var promoId = currRec.getCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
               fieldId: "custrecord_tsb_lr_listpromo_promo"
            });

            if (promoId) {

               var transactionInfoObj = takeTransactionInfo(currRec);
               var promoInfoObj = takePromoInfo(promoId);

               returnValidation = validatePromotion(currRec, transactionInfoObj, promoInfoObj);

            }

         }

         return returnValidation;

      };

      function postSourcing(scriptContext) {

      };

      function lineInit(scriptContext) {

      };

      function validateDelete(scriptContext) {
         return true;
      };

      function validateInsert(scriptContext) {
         return true;
      };

      function validateLine(scriptContext) {
         return true;
      };

      function sublistChanged(scriptContext) {
         return true;
      };

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      function validatePromotion(currRec, transactionInfoObj, promoInfoObj) {

         // if (transactionInfoObj.itemLinesArray.length < 1) {

         //    alert("Você deve inserir linhas de item antes de inserir promoções.");
         //    currRec.setCurrentSublistValue({ // AQUI SELECT LINE CORRETO
         //       sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
         //       fieldId: 'custrecord_tsb_lr_listpromo_promo',
         //       value: '',
         //       ignoreFieldChange: true
         //    });
         //    return false;

         // }

         // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

         // if(transactionInfoObj.subsidiary != promoInfoObj.subsidiary){

         //    alert("A subsidiária da promoção não corresponde à subsidiária da Ordem de Compras.");
         //    currRec.setCurrentSublistValue({ // AQUI SELECT LINE CORRETO
         //       sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
         //       fieldId: 'custrecord_tsb_lr_listpromo_promo',
         //       value: '',
         //       ignoreFieldChange: true
         //    });
         //    return false;

         // }

         //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

         if(!(transactionInfoObj.approvalDate >= promoInfoObj.initDateObj && transactionInfoObj.approvalDate <= promoInfoObj.endDateObj)){

            alert("A promoção não possuí intervalo de datas válido para essa Ordem de Compras.");
            currRec.setCurrentSublistValue({ // AQUI SELECT LINE CORRETO
               sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
               fieldId: 'custrecord_tsb_lr_listpromo_promo',
               value: '',
               ignoreFieldChange: true
            });
            return false;

         }

         //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      }

      function takeTransactionInfo(currRec) {

         var transObj = {};

         transObj.inactive = currRec.getValue({ fieldId: 'custrecord_tsb_lr_ordc_inativo' });
         transObj.status = currRec.getValue({ fieldId: 'custrecord_tsb_lr_ordc_status' });
         transObj.subsidiary = currRec.getValue({ fieldId: 'custrecord_tsb_lr_ordc_subs' });
         transObj.provider = currRec.getValue({ fieldId: 'custrecord_tsb_lr_ordc_fornecedor' });
         transObj.approvalDate = currRec.getValue({ fieldId: 'custrecord_tsb_lr_ordc_dtaprov' });
         transObj.groupBy = currRec.getValue({ fieldId: 'custrecord_tsb_lr_ordc_agrpor' });
         transObj.document = currRec.getValue({ fieldId: 'custrecord_tsb_lr_ordc_docass' });
         transObj.name = currRec.getValue({ fieldId: 'custrecord_tsb_lr_ordc_nome' });
         transObj.totalValue = currRec.getValue({ fieldId: 'custrecord_tsb_lr_ordc_valtot' });
         transObj.discountValue = currRec.getValue({ fieldId: 'custrecord_tsb_lr_ordc_valdesc' });
         transObj.discountPerc = currRec.getValue({ fieldId: 'custrecord_tsb_lr_ordc_percdesc' });
         transObj.qtyItens = currRec.getValue({ fieldId: 'custrecord_tsb_lr_ordc_qtditens' });
         transObj.itemLinesArray = [];
         transObj.promoLinesArray = [];

         var itensQty = currRec.getLineCount({
            sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp'
         });

         for (var count = 0; count < itensQty; count++) {

            var itemLineObj = {};

            currRec.selectLine({
               sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp',
               line: count
            });

            itemLineObj.item = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp', fieldId: 'custrecord_tsb_lr_itens_item' });
            itemLineObj.description = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp', fieldId: 'custrecord_tsb_lr_itens_descr' });
            itemLineObj.qty = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp', fieldId: 'custrecord_tsb_lr_itens_qtd' });
            itemLineObj.status = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp', fieldId: 'custrecord_tsb_lr_itens_status' });
            itemLineObj.manager = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp', fieldId: 'custrecord_tsb_lr_itens_gerente' });
            itemLineObj.director = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp', fieldId: 'custrecord_tsb_lr_itens_dir' });
            itemLineObj.value = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp', fieldId: 'custrecord_tsb_lr_itens_val' });
            itemLineObj.discountValue = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp', fieldId: 'custrecord_tsb_lr_itens_valdesc' });
            itemLineObj.totalValue = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp', fieldId: 'custrecord_tsb_lr_itens_valtotal' });
            itemLineObj.discountPerc = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp', fieldId: 'custrecord_tsb_lr_itens_perdesc' });
            itemLineObj.detailType = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp', fieldId: 'custrecord_tsb_lr_itens_tipdet' });
            itemLineObj.promos = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp', fieldId: 'custrecord_tsb_lr_itens_promoapli' });
            itemLineObj.id = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_itens_ordcomp', fieldId: 'lineid' });

            transObj.itemLinesArray.push(itemLineObj);

         }

         var promosQty = currRec.getLineCount({
            sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp'
         });

         for (var count = 0; count < promosQty; count++) {

            var promoLineObj = {};

            currRec.selectLine({
               sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
               line: count
            });

            promoLineObj.promotionId = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp', fieldId: 'custrecord_tsb_lr_listpromo_promo' });
            promoLineObj.discountPerc = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp', fieldId: 'custrecord_tsb_lr_listpromo_perdesc' });
            promoLineObj.initDate = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp', fieldId: 'custrecord_tsb_lr_lispromo_dataini' });
            promoLineObj.endDate = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp', fieldId: 'custrecord_tsb_lr_lispromo_datafim' });
            promoLineObj.applied = currRec.getCurrentSublistValue({ sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp', fieldId: 'custrecord_tsb_lr_lispromo_apli' });

            transObj.promoLinesArray.push(itemLineObj);

         }

         return transObj;

      }

      function takePromoInfo(promoId) {

         var promoLookup = search.lookupFields({
            type: 'customrecord_tsb_lr_promo',
            id: promoId,
            columns: [
               'custrecord_tsb_lr_promo_subs', //
               'custrecord_tsb_lr_promo_itens', //
               'custrecord_tsb_lr_promo_dataini',
               'custrecord_tsb_lr_promo_datafim',
               'custrecord_tsb_lr_promo_qtdmin',
               'custrecord_tsb_lr_promo_perdesc',
               'custrecord_tsb_lr_promo_acumul',
               'custrecord_tsb_lr_promo_ativo'
            ]
         });

         var promoObj = {};

         promoObj.subsidiary = promoLookup.custrecord_tsb_lr_promo_subs.length ? promoLookup.custrecord_tsb_lr_promo_subs[0].value : '';
         promoObj.itens = [];

         promoObj.initDate = promoLookup.custrecord_tsb_lr_promo_dataini;
         promoObj.initDateObj = promoObj.initDate.split(/\W/g);
         promoObj.initDateObj = new Date(promoObj.initDateObj[2], parseInt(promoObj.initDateObj[1]) - 1, promoObj.initDateObj[0]);

         promoObj.endDate = promoLookup.custrecord_tsb_lr_promo_datafim;
         promoObj.endDateObj = promoObj.endDate.split(/\W/g);
         promoObj.endDateObj = new Date(promoObj.endDateObj[2], parseInt(promoObj.endDateObj[1]) - 1, promoObj.endDateObj[0]);

         promoObj.qtyMin = promoLookup.custrecord_tsb_lr_promo_qtdmin;
         promoObj.discountPerc = promoLookup.custrecord_tsb_lr_promo_perdesc;
         promoObj.acumulative = promoLookup.custrecord_tsb_lr_promo_acumul;
         promoObj.active = promoLookup.custrecord_tsb_lr_promo_ativo;

         for (var count = 0; count < promoLookup.custrecord_tsb_lr_promo_itens.length; count++) {
            promoObj.itens.push(promoLookup.custrecord_tsb_lr_promo_itens[count].value);
         }

         return promoObj;

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
         sublistChanged: sublistChanged
      };

   });