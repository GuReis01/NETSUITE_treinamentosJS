/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */

define([
   'N/record',
   'N/search',
   'N/runtime',
   'N/currentRecord'
],

   function (
      record,
      search,
      runtime,
      currentRecord
   ) {

      function pageInit(scriptContext) {

      };

      function validateField(scriptContext) {

         var currRec = scriptContext.currentRecord;
         var currentField = scriptContext.fieldId;
         var currentSublist = scriptContext.sublistId;
         var returnValidation = true;

         if (currentSublist == 'recmachcustrecord_tsb_lr_listpro_ordcomp') {

            var promoId = currRec.getCurrentSublistValue({
               sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
               fieldId: "custrecord_tsb_lr_listpromo_promo"
            });

            if (promoId) {
               var transactionInfoObj = getTransactionInfo(currRec);
               var promoInfoObj = getPromoInfo(promoId);

               returnValidation = validationPromotion(currRec, transactionInfoObj, promoInfoObj)

               // currRec.setCurrentSublistValue({
               //    sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
               //    fieldId: 'custrecord_tsb_lr_listpromo_perdesc',
               //    value: promoInfoObj.discountPerc
               // });
         
               currRec.setCurrentSublistValue({
                  sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
                  fieldId: 'custrecord_tsb_lr_lispromo_dataini',
                  value: promoInfoObj.initDate
               });
         
               currRec.setCurrentSublistValue({
                  sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
                  fieldId: 'custrecord_tsb_lr_lispromo_datafim',
                  value: promoInfoObj.endDate
               });
            }
         }

         return returnValidation;
      };



      function saveRecord(scriptContext) {
         // const currentRecord = scriptContext.currentRecord; 

         // var idRecordOrdc = currentRecord.getValue({
         //    fieldId: 'recordid'
         // });

         // const recordTypeListaPromo = "customrecord_tsb_lr_lispromo"; 

         // let idPromoAssociadoOrdc; 
         // let percDesconto; 

         // const buscaIdPromoEPromoDesconto = search.create({
         //    type: recordTypeListaPromo, 
         //    filters:[
         //       ['custrecord_tsb_lr_listpro_ordcomp', 'is', idRecordOrdc]
         //    ], 
         //    columns: [
         //       'custrecord_tsb_lr_listpromo_promo',
         //       'custrecord_tsb_lr_listpromo_perdesc' 
         //    ]
         // }).run().each(function(dados){
         //    idPromoAssociadoOrdc = dados.getValue({name: 'custrecord_tsb_lr_listpromo_promo'})
         //    percDesconto = dados.getValue({name: 'custrecord_tsb_lr_listpromo_perdesc'}) 
         // }) 

         // const objItensPromo = buscandoItemsDaTabelaPromocao(idPromoAssociadoOrdc); 
         // const arrayItensItens = buscandoItemsDaTabelaItems(idPromoAssociadoOrdc); 

         // atribuindoValoresEDescontosSublistaOrdc(objItensPromo, percDesconto, arrayItensItens); 


         return true;
      };

      function fieldChanged(scriptContext) {
         return true; //Se ele estiver sendo usado, retornar true.
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

      function sublistChanged(scriptContext) {load
         return true;
      };


      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      function approve(recordId, recordType) {

         var employeeId = runtime.getCurrentUser().id;
         var employeeIdsArr = [];
         var itemsArr = [];
         var linesModifiedArr = [];

         var purchaseRecord = record.load({
            type: 'customrecord_tsb_lr_ordcomp',
            id: recordId,
            isDynamic: true
         });

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         getLinesInfo(purchaseRecord, itemsArr, employeeIdsArr, 'recmachcustrecord_tsb_lr_itens_ordcomp');

         fillSublistStatus(purchaseRecord, itemsArr, employeeId);

         fillStatusApproved(purchaseRecord, itemsArr);

         modifiedLines(itemsArr, linesModifiedArr);
         ////////////////////////////////////////////////////////////////////////////////////////////////////

         const employeeName = search.lookupFields({
            type: search.Type.EMPLOYEE,
            id: employeeId,
            columns: ['firstname']
         }).firstname

         if (!linesModifiedArr.length) {
            alert('Não tem linhas para serem aprovadas, por você ' + employeeName);
         } else {

            purchaseRecord.save({
               enableSourcing: true,
               ignoreMandatoryFields: false
            });

            alert('Linha(as) aprovada(as) por: ' + employeeName);

            window.location.reload();
         }
      };

      function printDocument(recordId, recordType){

         var currRec = currentRecord.get()

         var pdfRender = url.resolveScript({
            scriptId: "",
            deploymentId: "",
            params: {purchId: recordId}
         });

         window.open(pdfRender)
      };

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      function getLinesInfo(rec, itemsArr, employeeIdsArr, lineType) {

         var linesQuantity = rec.getLineCount({
            sublistId: lineType
         });

         for (count = 0; count < linesQuantity; count++) {

            var obj = {};

            obj.lineType = lineType;
            obj.line = count;

            rec.selectLine({
               sublistId: lineType,
               line: count
            });

            obj.manager = rec.getCurrentSublistValue({
               sublistId: lineType,
               fieldId: "custrecord_tsb_lr_itens_gerente"
            });
            employeeIdsArr.push(obj.manager);

            obj.director = rec.getCurrentSublistValue({
               sublistId: lineType,
               fieldId: 'custrecord_tsb_lr_itens_dir'
            });
            employeeIdsArr.push(obj.director)

            obj.sublistStatus = rec.getCurrentSublistValue({
               sublistId: lineType,
               fieldId: 'custrecord_tsb_lr_itens_status'
            });


            obj.lineEdited = false;

            // obj.approver1 = '';
            // obj.approver1Firstname = '';

            // obj.approver2 = '';
            // obj.approver2Firstname = '';

            // obj.managerFirstname = '';

            // obj.directorFirstname = '';

            itemsArr.push(obj);
         }
      };


      function fillSublistStatus(rec, itemsArr, employeeId) {

         for (count = 0; count < itemsArr.length; count++) {

            if (itemsArr[count].sublistStatus != 6) {

               rec.selectLine({
                  sublistId: itemsArr[count].lineType,
                  line: itemsArr[count].line
               });

               if (itemsArr[count].manager == employeeId && itemsArr[count].sublistStatus != 2 && itemsArr[count].sublistStatus != 3) {
                  rec.setCurrentSublistValue({
                     sublistId: itemsArr[count].lineType,
                     fieldId: 'custrecord_tsb_lr_itens_status',
                     value: 2
                  });
                  itemsArr[count].sublistStatus = '2'
                  itemsArr[count].lineEdited = true;
               } else if (itemsArr[count].director == employeeId && itemsArr[count].sublistStatus == 2) {
                  rec.setCurrentSublistValue({
                     sublistId: itemsArr[count].lineType,
                     fieldId: 'custrecord_tsb_lr_itens_status',
                     value: 3
                  });
                  itemsArr[count].sublistStatus = '3'
                  itemsArr[count].lineEdited = true;
               }

               if (itemsArr[count].lineEdited) {
                  rec.commitLine({
                     sublistId: itemsArr[count].lineType
                  });
               }
            }
         }
      };


      function fillStatusApproved(rec, itemsArr) {

         var notApproved = itemsArr.filter(function (result) {
            return (result.sublistStatus != 3)
         });

         if (!notApproved.length) {

            rec.setValue({
               fieldId: 'custrecord_tsb_lr_ordc_status',
               value: 2
            });

            for (count = 0; count < itemsArr.length; count++) {

               rec.selectLine({
                  sublistId: itemsArr[count].lineType,
                  line: itemsArr[count].line
               });

               rec.setCurrentSublistValue({
                  sublistId: itemsArr[count].lineType,
                  fieldId: 'custrecord_tsb_lr_itens_status',
                  value: 6
               });

               rec.commitLine({
                  sublistId: itemsArr[count].lineType
               });

            }
         }

      };

      function modifiedLines(itemsArr, linesModifiedArr) {

         var linesEditedArr = itemsArr.filter(function (result) {
            return (result.lineEdited == true)
         });

         for (count = 0; count < linesEditedArr.length; count++) {
            linesModifiedArr.push(linesEditedArr[count]);
         }

      };


      // function alteraçãoDosCampos(currRec) {

      //    var promoId = currRec.getCurrentSublistValue({
      //       sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
      //       fieldId: 'custrecord_tsb_lr_listpromo_promo'
      //    });


      //    //usar Look up Fields
      //    var promoRec = record.load({
      //       type: 'customrecord_tsb_lr_promo',
      //       id: promoId,
      //       isDynamic: true
      //    });

      //    var percentualDesconto = promoRec.getValue({
      //       fieldId: 'custrecord_tsb_lr_promo_perdesc'
      //    });

      //    var dataInicio = promoRec.getValue({
      //       fieldId: 'custrecord_tsb_lr_promo_dataini'
      //    });

      //    var dataFim = promoRec.getValue({
      //       fieldId: 'custrecord_tsb_lr_promo_datafim'
      //    });

      //    currRec.setCurrentSublistValue({
      //       sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
      //       fieldId: 'custrecord_tsb_lr_listpromo_perdesc',
      //       value: percentualDesconto

      //    });

      //    currRec.setCurrentSublistValue({
      //       sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
      //       fieldId: 'custrecord_tsb_lr_lispromo_dataini',
      //       value: dataInicio
      //    });

      //    currRec.setCurrentSublistValue({
      //       sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
      //       fieldId: 'custrecord_tsb_lr_lispromo_datafim',
      //       value: dataFim

      //    });
      //    return true;
      // };


      ///////////////////////////////////////////////////VALIDAÇÕES//////////////////////////////////////////////////////////


      function validationPromotion(currRec, transactionInfoObj, promoInfoObj) {

         if (transactionInfoObj.itemLinesArray.length < 1) {
            alert("Você deve inserir linhas de item antes de inserir promoções.");
            return false;
         }

         ///////////////////////////////////////////////////////////////////////////

         if (transactionInfoObj.subsidiary != promoInfoObj.subsidiary[0].value) {
            alert("A subsidiária da promoção não corresponde à subsidiária da Ordem de Compras.");
            return false;
         }

         ///////////////////////////////////////////////////////////////////////////

         
         if (!(transactionInfoObj.approvalDate >= promoInfoObj.initDateObj && transactionInfoObj.approvalDate <= promoInfoObj.endDateObj)) {
            alert("A promoção não possuí intervalo de datas válido para essa Ordem de Compras.");
            return false;
         }

         ///////////////////////////////////////////////////////////////////////////

         var validationArray = [];

         transactionInfoObj.itemLinesArray.map(function (elem) {
            if (promoInfoObj.itens.includes(elem.item)) {
               validationArray.push(elem)
            }
         });
         
         if(validationArray.length == 0){
            alert("A promoção não possuí uma seleção de itens válida para essa Ordem de Compras.")
            return false;
         }

         ///////////////////////////////////////////////////////////////////////////

         // let smallerQty = [];

         // transactionInfoObj.qty.map(function (elem) {
         //    if (elem < promoInfoObj.qtyMin) {
         //       smallerQty.push(elem)
         //    }
         // });

         // if (smallerQty.length > 0) {
         //    alert("A promoção possuí uma seleção de itens válida, mas a quantidade mínima de itens não foi atendida.")
         //    return false
         // }

         ///////////////////////////////////////////////////////////////////////////

         return true;
      }

      function getTransactionInfo(currRec) {

         transObj = {};

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

      function getPromoInfo(promoId) {

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

         promoObj.subsidiary = promoLookup.custrecord_tsb_lr_promo_subs;
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

      

      // function validacaoData(currRec) {
      //    var promoId = currRec.getCurrentSublistValue({
      //       sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
      //       fieldId: 'custrecord_tsb_lr_listpromo_promo'
      //    });

      //    var promoRec = record.load({
      //       type: 'customrecord_tsb_lr_promo',
      //       id: promoId,
      //       isDynamic: true
      //    });

      //    var dataAprovacao = currRec.getValue({
      //       fieldId: 'custrecord_tsb_lr_ordc_dtaprov'
      //    });

      //    var dataInicio = promoRec.getValue({
      //       fieldId: 'custrecord_tsb_lr_promo_dataini'
      //    });

      //    var dataFim = promoRec.getValue({
      //       fieldId: 'custrecord_tsb_lr_promo_datafim'
      //    });

      //    if (dataAprovacao >= dataInicio && dataAprovacao <= dataFim) {
      //       return true
      //    } else {
      //       alert("A promoção não possuí intervalo de datas válido para essa Ordem de Compras.")
      //       return false;
      //    }
      // };

      // function validacaoSubsidiaria(currRec) {
      //    var promo = 'customrecord_tsb_lr_promo'

      //    var promoId = currRec.getCurrentSublistValue({
      //       sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
      //       fieldId: 'custrecord_tsb_lr_listpromo_promo'
      //    });

      //    var subsidiariaOrdemCompra = currRec.getValue({
      //       fieldId: 'custrecord_tsb_lr_ordc_subs'
      //    });

      //    var promoRec = search.lookupFields({
      //       type: promo,
      //       id: promoId,
      //       columns: [
      //          'custrecord_tsb_lr_promo_subs',
      //       ]
      //    });

      //    // var subsidiariaPromo = promoRec.getValue({
      //    //    fieldId: 'custrecord_tsb_lr_promo_subs'
      //    // });

      //    // var promoRec = record.load({
      //    //    type: 'customrecord_tsb_lr_promo',
      //    //    id: promoId,
      //    //    isDynamic: true
      //    // });

      //    if (promoRec.custrecord_tsb_lr_promo_subs[0].value == subsidiariaOrdemCompra) {
      //       return true;
      //    } else {
      //       alert('A subsidiária da promoção não corresponde à subsidiária da Ordem de Compras.')
      //    }

      // };

      // function validacaoItens(currRec) {
      //    var tbItens = 'customrecord_tsb_lr_itens'
      //    var tbPromo = 'customrecord_tsb_lr_promo'

      //    var promoCurrRecId = currRec.getCurrentSublistValue({
      //       sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
      //       fieldId: 'custrecord_tsb_lr_listpromo_promo'
      //    });

      //    var ordcompraCurrRecId = currRec.getValue({
      //       fieldId: 'recordid'
      //    });

      //    var arrayItensOrdc = []; //criando array para armazenar os itens que tem na ordem de compra
      //    var arrayItensPromo = []; //criando array para armazenar os itens que tem na promoção

      //    //criando uma busca de itens na tabela itens, ordem de compra que o usuários está e na coluna itens
      //    var itensLinhasOrdc = search.create({
      //       type: tbItens,
      //       filters: [
      //          ['custrecord_tsb_lr_itens_ordcomp', 'is', ordcompraCurrRecId]
      //       ],
      //       columns:
      //          [
      //             'custrecord_tsb_lr_itens_item',
      //          ]
      //    }).run().each(function (result) {

      //       arrayItensOrdc.push(result.getValue({ name: 'custrecord_tsb_lr_itens_item' })) //adcionando os itens da ordem de compra ao Array criado 
      //       return true;
      //    });

      //    var itensPromo = search.create({
      //       type: tbPromo,
      //       filters: [
      //          ['internalid', 'is', promoCurrRecId]
      //       ],
      //       columns:
      //          [
      //             'custrecord_tsb_lr_promo_itens'
      //          ]
      //    }).run().each(function (result) {

      //       arrayItensPromo.push(result.getValue({ name: 'custrecord_tsb_lr_promo_itens' })) //adcionando itens da ordem de compra ao Array criado
      //    });

      //    const itensPromoSeparado = arrayItensPromo[0].split(",");

      //    const relacaoItensPromoEOrdc = itensPromoSeparado.map(function (elem) {
      //       if (arrayItensOrdc.includes(elem)) {
      //          return elem;
      //       } else {
      //          alert("A promoção não possuí uma seleção de itens válida para essa Ordem de Compras.")
      //          return false
      //       }
      //    })
      //    return true;
      // };

      // function validacaoQuantidade(currRec) {
      //    var tbItens = 'customrecord_tsb_lr_itens'
      //    var tbPromo = 'customrecord_tsb_lr_promo'

      //    var promoCurrRecId = currRec.getCurrentSublistValue({
      //       sublistId: 'recmachcustrecord_tsb_lr_listpro_ordcomp',
      //       fieldId: 'custrecord_tsb_lr_listpromo_promo'
      //    });

      //    var ordcompraCurrRecId = currRec.getValue({
      //       fieldId: 'recordid'
      //    });

      //    var arrayQuantidadesItens = [];

      //    var qtdTbItens = search.create({
      //       type: tbItens,
      //       filters: [
      //          ['custrecord_tsb_lr_itens_ordcomp', 'is', ordcompraCurrRecId]
      //       ],
      //       columns:
      //          [
      //             'custrecord_tsb_lr_itens_qtd'
      //          ]
      //    }).run().each(function (result) {

      //       arrayQuantidadesItens.push(result.getValue({ name: 'custrecord_tsb_lr_itens_qtd' }))

      //       // console.log(arrayQuantidadesItens)
      //       return true;
      //    });

      //    let qtdMinima = {};

      //    var qtdMinimaPromo = search.create({
      //       type: tbPromo,
      //       filters: [
      //          ['internalid', 'is', promoCurrRecId]
      //       ],
      //       columns:
      //          [
      //             'custrecord_tsb_lr_promo_qtdmin'
      //          ]
      //    }).run().each(function (result) {


      //       qtdMinima.quantidadeMinima = result.getValue({ name: 'custrecord_tsb_lr_promo_qtdmin' })

      //       // console.log(qtdMinima)
      //    });

      //    let arrQuantidadesMenores = [];

      //    arrayQuantidadesItens.map(function (elem) {
      //       if (elem < qtdMinima.quantidadeMinima) {
      //          arrQuantidadesMenores.push(elem)
      //       }
      //    })

      //    if (arrQuantidadesMenores.length > 0) {
      //       alert("A promoção possuí uma seleção de itens válida, mas a quantidade mínima de itens não foi atendida.")
      //       return false
      //    }

      //    return true;
      // }

      // // FUNÇÃO DO SAVERECORD 
      // function buscandoItemsDaTabelaPromocao(idPromoAssociadoOrdc) {
      //    const typeRecordPromo = "customrecord_tsb_lr_promo";

      //    const objItemPromocao = search.lookupFields({
      //       type: typeRecordPromo,
      //       id: idPromoAssociadoOrdc,
      //       columns: [
      //          'custrecord_tsb_lr_promo_itens'
      //       ]
      //    })

      //    return objItemPromocao;
      // }

      // function buscandoItemsDaTabelaItems(idPromoAssociadoOrdc) {
      //    const typeRecordItens = "customrecord_tsb_lr_itens";
      //    const idOrdcItens = "custrecord_tsb_lr_itens_ordcomp";

      //    let arrayItems = [];
      //    let obj = {};

      //    const buscaTabelasItens = search.create({
      //       type: typeRecordItens,
      //       filters: [
      //          [idOrdcItens, 'is', idPromoAssociadoOrdc]
      //       ],
      //       columns: [
      //          'custrecord_tsb_lr_itens_item',
      //          'custrecord_tsb_lr_itens_val'
      //       ]
      //    }).run().each(function (itens) {

      //       obj.id = itens.getValue({ name: 'custrecord_tsb_lr_itens_item' });
      //       obj.valor = itens.getValue({ name: 'custrecord_tsb_lr_itens_valor' });

      //       arrayItems.push(obj);

      //       return true;
      //    })

      //    return arrayItems;
      // }

      // function atribuindoValoresEDescontosSublistaOrdc(objItensPromo, percDesconto, arrayItensItens) {

      //    console.log(objItensPromo);
      //    console.log(arrayItensItens);
      //    // const arrayValoresValidos = []; 

      //    // arrayItensItens.map(function(item){
      //    //    let idItem = item.id

      //    //    if(.includes(idItem)){
      //    //       arrayValoresValidos.push(item)
      //    //    }
      //    // })
      // }



      return {
         pageInit: pageInit,
         validateField: validateField,
         saveRecord: saveRecord,
         fieldChanged: fieldChanged,
         postSourcing: postSourcing,
         lineInit: lineInit,
         validateDelete: validateDelete,
         validateInsert: validateInsert,
         validateLine: validateLine,
         sublistChanged: sublistChanged,
         approve: approve,
         printDocument: printDocument
      }


   });
