/**
 * Created by lenovo on 2015/3/13.
 */
$(function() {
    //表单验证
    $('#forgotPwd').validate({
        errorElement: 'label',
        errorClass: 'help_tips t_error',
        messages: {
            email: {
                required: "请填写邮箱",
                email: "邮箱格式不正确"
            }
        }
    });
    $('#forgotCode').validate({
        errorElement: 'label',
        errorClass: 'help_tips t_error',
        messages: {
            captcha: {
                required: "请填写验证码"
            }
        }
    });
    $('#resetPwd').validate({
        errorElement: 'label',
        errorClass: 'help_tips t_error',
        rules:{
            pwd:{
                rangelength: [6, 16]
            },
            repect_pwd:{
                rangelength: [6,16],
                equalTo: "#pwd"
            }},
        messages: {
            pwd: {
                required: "请填写密码",
                rangelength: "密码需由6-16个字符（数字、字母、下划线）组成！"
            },
            repect_pwd: {
                required: "请填写确认密码！",
                rangelength: "密码需由6-16个字符（数字、字母、下划线）组成！",
                equalTo: "两次输入密码不一致！"
            }
        }
    });

    $('#forgotPwd .btn').on('click',function(){
        if($('#forgotPwd').valid()){
            $.ajax({
                type:'POST',
                url:'/forgot/sendMail',
                data:{email:$('#email').val()},
                dataType:'JSON',
                success:function(res){
                    if(res.reCode == '100'){
                        $('#forgotPwd').remove();
                        $('#account').val(res.account);
                        $('h3 small').text('安全验证');
                        $('#forgotCode').show();
                    }else{
                        alert(res.reStr);
                    }
                }
            });
        }
    });

    $('#forgotCode .btn').on('click',function(){
        if($('#forgotCode').valid()){
            var account = $('#account').val();
            if(account == ''){
                alert('操作失败');
                return;
            }
            $.ajax({
                type:'POST',
                url:'/forgot/captcha',
                data:{account:account,captcha:$('#captcha').val()},
                dataType:'JSON',
                success:function(res){
                    if(res.reCode == '100'){
                        $('#forgotCode').remove();
                        $('#resetAccount').val(res.account);
                        $('h3 small').text('重置密码');
                        $('#resetPwd').show();
                    }else{
                        alert(res.reStr);
                        if(res.reCode == '1'){
                            location.href = '/forgot';
                        }
                    }
                }
            });
        }
    });
});