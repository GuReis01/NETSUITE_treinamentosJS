function crazyTable(){

var anyDate = new Date();
var day = anyDate.getDate();
var month = anyDate.getMonth();
var year = anyDate.getFullYear();
var weekDay = anyDate.getDay();

var arrWeekend = [];

for(count = 1; count < 30; count++ ){

if(weekDay == 0 || weekDay == 6){
   arrWeekend.push((day + count), month, year);
}

}


console.table(arrWeekend);

}





var anyDate = new Date();
var day = anyDate.getDate();
var month = anyDate.getMonth();
var year = anyDate.getFullYear();
var weekDay = anyDate.getDay();

var arrWeekend = [];

var arrMeses = 
[
   'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

var proximosDias = 40 ;

for(count = 0; count <= proximosDias; count ++){

   let otherDate = new Date(year, month, (day + count));
   let otherDays = otherDate.getDate();
   let otherMonth = otherDate.getMonth();
   let Ano = otherDate.getFullYear();
   let otherweekDay = otherDate.getDay();


   var Mes = arrMeses[otherMonth]

   let obj = {};


   if(otherweekDay == 6){

      let diaDomingo = new Date(year, month, (day + count + 1));
      let Dias = `${otherDays} e ${diaDomingo.getDate()}`

      obj = {Dias, Mes, Ano};
      arrWeekend.push(obj);
   }

}

console.table(arrWeekend)


// se weekDay == 0 day + 7 = weekDay



// if(Mes == 0){ Mes = 'Janeiro'}
// if(Mes == 1){ Mes = 'Fevereiro'}
// if(Mes == 2){ Mes = 'Março'}
// if(Mes == 3){ Mes = 'Abril'}
// if(Mes == 4){ Mes = 'Maio'}
// if(Mes == 5){ Mes = 'Junho'}
// if(Mes == 6){ Mes = 'Julho'}
// if(Mes == 7){ Mes = 'Agosto'}
// if(Mes == 8){ Mes = 'Setembro'}
// if(Mes == 9){ Mes = 'Outubro'}
// if(Mes == 10){ Mes = 'Novembro'}
// if(Mes == 11){ Mes = 'Dezembro'}

// if(otherweekDay == 0){ otherweekDay = 'Domingo'}
// if(otherweekDay == 6){ otherweekDay = 'Sábado'}