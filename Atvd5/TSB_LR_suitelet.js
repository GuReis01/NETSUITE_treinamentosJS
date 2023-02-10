/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 */

define([
   'N/ui/serverWidget', 'N/search'
],

   function (
      serverWidget, search
   ) {


      function onRequest(context) {

         if (context.request.method == 'GET') {

            ///////////////////////////CRIANDO A PÁGINA///////////////////////////
            const form = serverWidget.createForm({ title: 'Ordem de Compras Filter' });
            form.clientScriptModulePath = './TSB_LR_suitelet_cs.js';

            addFields(form)

            var sublist = form.addSublist({
               id: 'custpage_sublist',
               type: serverWidget.SublistType.INLINEEDITOR,
               label: 'Filter Result'
            });

            addSublist(sublist)

            context.response.writePage(form)

         } else if (context.request.method == 'POST') {

            ///////////////////////////CRIANDO A PÁGINA///////////////////////////
            const form = serverWidget.createForm({ title: 'Ordem de Compras Filter' })
            form.clientScriptModulePath = './TSB_LR_suitelet_cs.js';

            addFields(form, context)

            var sublist = form.addSublist({
               id: 'custpage_post_sublist',
               type: serverWidget.SublistType.INLINEEDITOR,
               label: 'Inline Editor Sublist'
            });

            addSublist(sublist)

            context.response.writePage(form)

            /////////////////////PEGANDO OS VALORES QUE O USUÁRIO DIGITOU////////////////////////////
            var purchaseOrderId = context.request.parameters['custpage_idfield']
            var approveDate = context.request.parameters['custpage_approvedatefield']
            var subsidiary = context.request.parameters['custpage_subsidiaryfield']

            // form.subsidiaryField.defaultValue = subsidiary;

            ////////////////////CRIANDO A BUSCA NA TABELA INVOICE//////////////////////
            var arrSearchResults = [];

            search.create({
               type: "customrecord_tsb_lr_ordcomp",
               filters: [
                  ['custrecord_tsb_lr_ordc_subs', 'anyof', subsidiary]
               ],
               columns: [
                  'id',
                  'custrecord_tsb_lr_ordc_nome',
                  'custrecord_tsb_lr_ordc_dtaprov',
                  'custrecord_tsb_lr_ordc_status',
                  'custrecord_tsb_lr_ordc_subs',
                  'custrecord_tsb_lr_ordc_fornecedor',
                  "custrecord_tsb_lr_ordc_inativo"

               ]
            }).run().each(function (infos) {

               var obj = {};

               obj.listResultId = infos.getValue({ name: 'id' })
               obj.listResultName = infos.getValue({ name: 'custrecord_tsb_lr_ordc_nome'})
               obj.listResultApproveDate = infos.getValue({ name: 'custrecord_tsb_lr_ordc_dtaprov'})
               obj.listResultStatus = infos.getValue({ name: 'custrecord_tsb_lr_ordc_status' })
               obj.listResultSubsidiary = infos.getValue({ name: 'custrecord_tsb_lr_ordc_subs' })
               obj.listResultVendor = infos.getValue({ name: 'custrecord_tsb_lr_ordc_fornecedor' })
               obj.listResultCheckBox = infos.getValue({ name: 'custrecord_tsb_lr_ordc_inativo' })
               obj.listResultCheckBoxFormated = new String("");
               arrSearchResults.push(obj);

               return true;
            })

            // var checkTrue = new String("T");
            // var checkFalse = new String("F");
            
            /////////////////////ATRIBUINDO OS VALORES DA BUSCA NA SUBLISTA//////////////////////
            for (var count = 0; count < arrSearchResults.length; count++) {

               // if(arrSearchResults[count].listResultCheckBox == true){
               //    arrSearchResults[count].listResultCheckBoxFormated == checkTrue
               // }else if(arrSearchResults[count].listResultCheckBox == false){
               //    arrSearchResults[count].listResultCheckBoxFormated == checkFalse
               // }
               // sublist.setSublistValue({
               //    id: 'custpage_sublistcheckbox',
               //    line: count,
               //    value: arrSearchResults[count].listResultCheckBoxFormated
               // });

               sublist.setSublistValue({
                  id: 'custpage_sublistid',
                  line: count,
                  value: arrSearchResults[count].listResultId

               });

               sublist.setSublistValue({
                  id: 'custpage_sublistname',
                  line: count,
                  value: arrSearchResults[count].listResultName

               });

               if(arrSearchResults[count].listResultApproveDate.length > 0){
               sublist.setSublistValue({
                  id: 'custpage_sublistapprovedate',
                  line: count,
                  value: arrSearchResults[count].listResultApproveDate

               });
               }

               sublist.setSublistValue({
                  id: 'custpage_subliststatus',
                  line: count,
                  value: arrSearchResults[count].listResultStatus
               });

               sublist.setSublistValue({
                  id: 'custpage_sublistsubsidiary',
                  line: count,
                  value: arrSearchResults[count].listResultSubsidiary
               });

               sublist.setSublistValue({
                  id: 'custpage_sublistvendor',
                  line: count,
                  value: arrSearchResults[count].listResultVendor
               });
            }

         }

      };

      function runGet(context) {

      };

      function runPost(context) {

      };


      /////////////////////////////////////////////////////////FUNÇÕES CRIADAS///////////////////////////////////////////////////////////////////



      function addFields(form, context) {

         var fieldgroup = form.addFieldGroup({
            id: 'custpage_fieldgroupid',
            label: 'Filter Fields'
         });

         var purchaseOrderIdField = form.addField({
            id: 'custpage_idfield',
            type: serverWidget.FieldType.INTEGER,
            label: 'PURCHASE ORDER ID',
            container: 'custpage_fieldgroupid'
         });

         var approveDate = form.addField({
            id: 'custpage_approvedatefield',
            type: serverWidget.FieldType.DATE,
            label: 'APPROVE DATE',
            container: 'custpage_fieldgroupid'
         });

         var subsidiaryField = form.addField({
            id: 'custpage_subsidiaryfield',
            type: serverWidget.FieldType.SELECT,
            source: "subsidiary",
            label: 'SUBSIDIARY',
            container: 'custpage_fieldgroupid'
         });

         // if (context.request.method == 'POST'){

         // approveDate.defaultValue = context.request.parameters['custpage_approvedatefield'];

         // }

         form.addSubmitButton({
            label: 'Filter'
         });

         form.addButton({
            id : 'custpage_lr_buttoncallmap',
            label : 'Call Map',
            functionName: "callMapProcess()"
        });
      }

      function addSublist(sublist) {
         
         sublist.addField({
            id: 'custpage_sublistcheckbox',
            type: serverWidget.FieldType.CHECKBOX,
            label: 'SELECIONADO'
         });

         sublist.addField({
            id: 'custpage_sublistid',
            type: serverWidget.FieldType.INTEGER,
            label: 'PURCHASE ORDER ID'
         });

         sublist.addField({
            id: 'custpage_sublistname',
            type: serverWidget.FieldType.TEXT,
            label: 'NAME'
         });

         sublist.addField({
            id: 'custpage_sublistapprovedate',
            type: serverWidget.FieldType.DATE,
            label: 'APPROVE DATE'
         });
         
         sublist.addField({
            id: 'custpage_subliststatus',
            type: serverWidget.FieldType.SELECT,
            source: "customlist_tsb_lr_status",
            label: 'STATUS'
         })

         sublist.addField({
            id: 'custpage_sublistsubsidiary',
            type: serverWidget.FieldType.SELECT,
            source: "subsidiary",
            label: 'SUBSIDIARY'
         });

         
         sublist.addField({
            id: 'custpage_sublistvendor',
            type: serverWidget.FieldType.SELECT,
            source: 'vendor',
            label: 'VENDOR'
         })
      }


      return {
         onRequest: onRequest
      };

   });