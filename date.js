/**
 * Created by kevinyang on 2017/9/12.
 */
(function () {
    var datepicker={

    };
    datepicker.getMonthData=function (year,month) {
        if(year==undefined || month== undefined){
            var now=new Date();
            year=now.getFullYear();
            month=now.getMonth()+1;
        }
        //月初
        var firstDay=new Date(year,month-1,1);
        var firstDayWeekday=firstDay.getDay();
        if(firstDayWeekday==0) firstDayWeekday=7;
        //上月的月末
        var lastDayOfLastMonth=new Date(year,month-1,0); //当月的第0天就是上月的月末
        var lastDateOfLastMonth=lastDayOfLastMonth.getDate();
        //需要展示多少个上月的天
        var preMonthDayCount=firstDayWeekday-1;
        //需要展示多少个下月
        var lastDay=new Date(year,month,0); //下个月的第0天就是本月的第一天
        var lastDate=lastDay.getDate();
        var ret=[];
        for(var i=0;i<7*6;i++){
            var date=i + 1 -preMonthDayCount;
            var showDate = date;
            var thisMonth= month;
            if(date <=0 ){
                //上一月
                thisMonth=month - 1;
                showDate = lastDateOfLastMonth + date;
            }else if(date>lastDate){
                this.month=month+1;
                showDate=showDate-lastDate;
            }
            if(thisMonth===0) thisMonth=12;
            if(thisMonth===13) thisMonth=13;
            ret.push({
                month:thisMonth,
                date:date,
                showDate:showDate
            })
        }
        return {
            year:year,
            month:month,
            days:ret
        };
    }
    datepicker.buildUi=function (year, month) {
        var monthData=datepicker.getMonthData(year,month);

        var htmlStr='<div class="ui-datepicker-header">'+
                    '<a href="#" class="ui-datepicker-btn ui-datepicker-pre-btn">&lt;</a>'+
                    '<a href="#" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>'+
                    '<span class="ui-datepicker-cur-month">2016-12</span>'+
                    '</div>'+
                    '<div class="ui-datepicker-body">'+
                    '<table>'+
                    '<thead>'+
                    '<tr>'+
                    '<th>一</th>'+
                    '<th>二</th>'+
                    '<th>三</th>'+
                    '<th>四</th>'+
                    '<th>五</th>'+
                    '<th>六</th>'+
                    '<th>日</th>'+
                    '</tr>'+
                    '</thead>'+
                    '<tbody>';
        for(var i=0;i<monthData['days'].length;i++){
            if(i%7==0){
                htmlStr+="<tr>"
            } //一行的第一天
            htmlStr+='<td data-date='+monthData['days'][i].date+'>'+monthData['days'][i].showDate+'</td>';
            if(i%7==6){
                htmlStr+="</tr>"
            }
        }
        htmlStr+='</tbody>'+
                 '</table>'+
                 '</div>';
        return htmlStr;

    }
    datepicker.init=function (id,year,month) {
       var monthData=datepicker.getMonthData(year,month);
       var $wraper=document.createElement("div");
       $wraper.className="ui-datepicker-wraper";
       var html=datepicker.buildUi(year,month);
       $wraper.innerHTML=html;
       var isOpen=false;
       document.body.appendChild($wraper);
       document.querySelector(".ui-datepicker-cur-month").innerHTML=year+'-'+month;
       var $input=document.getElementById(id);
       $input.addEventListener("click",function () {
           if(isOpen){
               $wraper.classList.remove('ui-datepicker-wraper-show')
               isOpen=false;
           }else{
               $wraper.classList.add('ui-datepicker-wraper-show');
               var left=$input.offsetLeft;
               var top=$input.offsetTop;
               var height=$input.offsetHeight;
               $wraper.style.top=height+top+2+"px";
               $wraper.style.left=left+'px';

               isOpen=true;
           }

       },false);
       $wraper.addEventListener('click',function (e) {
           var $target=e.target;
           if($target.classList.contains('ui-datepicker-pre-btn')){
               month--;
               if(month===0){
                   year--;
                   month=12;
               }
               var html=datepicker.buildUi(year,month);
               $wraper.innerHTML=html;
               document.body.appendChild($wraper);
               document.querySelector(".ui-datepicker-cur-month").innerHTML=year+'-'+month;

           }else if($target.classList.contains('ui-datepicker-next-btn')){
               month++;
               if(month===13){
                   year++;
                   month=1;
               }
               var html=datepicker.buildUi(year,month);
               $wraper.innerHTML=html;
               document.body.appendChild($wraper);
               document.querySelector(".ui-datepicker-cur-month").innerHTML=year+'-'+month;
           }


       },false);
       $wraper.addEventListener('click',function (e) {
           var $target=e.target;
           if($target.tagName.toLowerCase() !== 'td') return;
           var date=new Date(monthData.year,monthData.month,$target.dataset.date);
           $input.value=format(date);



       },false)


    }

    window.datepicker=datepicker;
    function format(date) {
        var str='';
        str+=date.getFullYear() + '-';
        if(date.getMonth()<10){
            str+='0'+(date.getMonth()-1)+'-'

        }else if(date.getMonth()>=10){
            str+=(date.getMonth()-1)+'-'
        }
        str+=date.getDate()

        return str;
    }

})()