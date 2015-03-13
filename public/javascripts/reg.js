/**
 * Created by lenovo on 2015/2/28.
 */
$(function(){
    //ajax判断用户名是否存在
/*    $('#username').on('change',function(){
        $.ajax({
            url:'/data/validUser',
            type:'POST',
            dataType:'JSON',
            data:{name:$(this).val()},
            success:function(data){
                if(data.result == 1){
                    //用户名已存在
                }else{
                    //可以使用
                }
            }
        });
    });*/

    //表单验证
    $('#regForm').validate({
        errorElement:'label',
        errorClass:'help_tips t_error',
        rules: {
            username:{
                remote: {
                    url: "/data/validUser",
                    type: "post",
                    dataType: "json",
                    data: {
                        name: function () {
                            return $("#username").val();
                        }
                    },
                    dataFilter: function (data) {
                        $('#username').parent().removeClass('has-success has-error');
                        if(JSON.parse(data).result == 0){    //可以使用
                            $('#username').parent().addClass('has-success');
                            return true;
                        }else{    //已存在
                            $('#username').parent().addClass('has-error');
                            return false;
                        }
                    }
                }
            },
            password:{
                rangelength: [6, 16]
            },
            password_repeat:{
                rangelength: [6,16],
                equalTo: "#password"
            }
        },
        messages:{
            username:{
                required:"请填写用户名",
                remote:"用户名已存在"
            },
            email:{
                required:"请填写邮箱",
                email:"邮箱格式不正确"
            },
            password: {
                required: "请填写密码",
                rangelength: "密码需由6-16个字符（数字、字母、下划线）组成！"
            },
            password_repeat: {
                required: "请填写确认密码！",
                rangelength: "密码需由6-16个字符（数字、字母、下划线）组成！",
                equalTo: "两次输入密码不一致！"
            }
        }
    });
});
