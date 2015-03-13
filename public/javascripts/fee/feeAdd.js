/**
 * Created by lenovo on 2015/2/15.
 */
$(function(){
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
    var now = new Date();
    var _m = now.getMonth() >= 9?(now.getMonth()+1):('0'+(now.getMonth()+1));
    var _d = now.getDate() >= 10?now.getDate():('0'+now.getDate());
    $('#date').val(now.getFullYear() + "-"+ _m + "-" + _d);

    ajaxParamPie('本月支出情况',{year:new Date().getFullYear(),month:(new Date().getMonth()+1)},'chartShow');
});
$().ready(function() {
    //表单验证
    $('#feeAdd').validate({
        errorElement:'label',
        errorClass:'help_tips t_error',
        rules: {
            date:"required",
            amount: {
                required: true,
                number: true,
                min: 0
            }
        },
        messages:{
            date: "请选择日期",
            amount: {
                required: "请输入金额",
                number: "金额不合法",
                min: "金额不能为负"
            }
        }
    });
});

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