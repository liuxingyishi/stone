/**
 * Created by lenovo on 2015/2/26.
 */
$(function(){
    $('#showDetail').unbind("click").on('click',function(){
        ajaxDetail(1);
    });
    $('.pagination').on('click','li a',function(){
        ajaxDetail(parseInt($(this).attr('rel')));
    });

    $('[data-toggle="tooltip"]').tooltip();
    //加载图表
    ajaxYearLine();
    ajaxParamPie('支出构成',{},'home_totalCompentsShow');
    ajaxParamPie('本月支出情况',{year:new Date().getFullYear(),month:(new Date().getMonth()+1)},'home_thisMonthCompentsShow');

    $('#form_date').datetimepicker({
        language:'zh-CN',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
    });
    $('#editFeeModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var recipient = button.data('editid'); // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);
        modal.find('.modal-body input').val(recipient);
    })
});

/**
 * ajax请求年度支出数据，绘制图表line
 */
function ajaxYearLine(){
    $.ajax({
        url:'/data/myYearFees',
        type:'POST',
        dataType:'JSON',
        data:{},
        success:function(result){
            var data = [];
            for(var i = 1;i <= 12;i++){
                var flag = null;
                for(var j = 0;j < result.data.length;j++){
                    if(result.data[j]._id == i){
                        flag = result.data[j].total;
                    }
                }
                if(flag != null){
                    data.push(flag);
                }else{
                    data.push(0);
                }
            }
            // 使用 图表
            require(
                [
                    'echarts',
                    'echarts/chart/line' //按需加载
                ],
                function (ec) {
                    // 基于准备好的dom，初始化echarts图表init($dom元素,主题)
                    var myChart = ec.init(document.getElementById('home_yearDataShow'),'macarons');

                    var option = {
                        title : {
                            text: '本年度支出概况图',
                            subtext: '-各月份支出'
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        //legend: {data:['支出统计']},
                        toolbox: {
                            show : true,
                            feature : {
                                dataView : {show: true, readOnly: false},
                                restore : {show: true},
                                saveAsImage : {show: true}
                            }
                        },
                        calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                data : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                axisLabel : {
                                    formatter: '{value} 元'
                                }
                            }
                        ],
                        series : [
                            {
                                name:'支出曲线',
                                type:'line',
                                data:data,
                                markPoint : {
                                    data : [
                                        {type : 'max', name: '最大值'},
                                        {type : 'min', name: '最小值'}
                                    ]
                                },
                                markLine : {
                                    data : [
                                        {type : 'average', name: '平均值'}
                                    ]
                                }
                            }
                        ]
                    };

                    // 为echarts对象加载数据
                    myChart.setOption(option);
                }
            );
        }
    });
}

/**
 * ajax请求支出组成，绘制图表pie
 */
function ajaxParamPie(text,param,showDomId){
    $.ajax({
        url:'/data/myFeeComponents',
        type:'POST',
        dataType:'JSON',
        data:param,
        success:function(result) {
            var feeTypeShow = [];
            var data = [];
            for(var i = 1;i < result.feeType.length;i++){    //舍弃 -请选择-
                feeTypeShow.push(result.feeType[i].show);
                var flag = null;
                for(var j = 0;j < result.data.length;j++){
                    if(result.data[j]._id == result.feeType[i].value){
                        flag = result.data[j].total
                    }
                }
                if(flag != null){
                    data.push({value:flag,name:result.feeType[i].show});
                }else{
                    data.push({value:0,name:result.feeType[i].show});
                }
            }
            // 使用 图表
            require(
                [
                    'echarts',
                    'echarts/chart/pie' //按需加载
                ],
                function (ec) {
                    // 基于准备好的dom，初始化echarts图表init($dom元素,主题)
                    var myChart = ec.init(document.getElementById(showDomId),'macarons');

                    var option = {
                        title : {
                            text: text,
                            subtext: '各类型支出组成',
                            x:'center'
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient : 'vertical',
                            x : 'left',
                            data:feeTypeShow
                        },
                        toolbox: {
                            show : true,
                            feature : {
                                saveAsImage : {show: true}
                            }
                        },
                        calculable : true,
                        series : [
                            {
                                name:'支出组成',
                                type:'pie',
                                radius : '55%',
                                center: ['50%', '60%'],
                                data:data
                            }
                        ]
                    };
                    // 为echarts对象加载数据
                    myChart.setOption(option);
                }
            );
        }
    });
}

/**
 * ajax请求支出详情
 * @param pageIndex
 */
function ajaxDetail(pageIndex){
    $.ajax({
        url:'/data/myDetail',
        type:'POST',
        dataType:'JSON',
        data:{pageIndex:pageIndex},
        success:function(data){
            var $tbody = $('div#detail table tbody');
            $tbody.empty();
            if(data.count > 0){
                var html = "";
                for(var i = 0;i < data.data.length;i++){
                    var temp = data.data[i].remark;
                    data.data[i].remark = data.data[i].remark.length > 20 ? data.data[i].remark.substring(0,20)+'...':data.data[i].remark;
                    html += "<tr> " +
                    "<td>"+ data.data[i].date +"</td> " +
                    "<td>"+ data.data[i].type +"</td> " +
                    "<td>"+ data.data[i].amount +"</td> " +
                    "<td><span data-toggle=\"tooltip\" title=\""+temp+"\">"+ data.data[i].remark +"</span></td> " +
                    "<td align='right'><a href='javascript:void(0);' data-toggle=\"modal\" data-target=\"#editFeeModal\" data-editid=\"@twbootstrap\"><span class='glyphicon glyphicon-pencil'></span></a>"+
                    " <a href='javascript:void(0);'><span class='glyphicon glyphicon-remove'></span></a></td> " +
                    "</tr>";
                }
                $tbody.append(html);
                $('.pagination').html(new pagination({pageIndex:pageIndex,pageSize:data.pageSize,count:data.count}).init());
            }
        }
    });
}