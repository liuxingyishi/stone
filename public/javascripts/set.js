/**
 * Created by lenovo on 2015/3/5.
 */
$(function(){
    $('#oldpwd').val('');
    //表单验证
    $('#changePwd').validate({
        errorElement:'label',
        errorClass:'help_tips t_error',
        rules: {
            newpwd:{
                rangelength: [6, 16]
            },
            newpwd_repect:{
                rangelength: [6,16],
                equalTo: "#newpwd"
            }
        },
        messages:{
            oldpwd:{
                required: "请填写原密码"
            },
            newpwd: {
                required: "请填写新密码",
                rangelength: "密码需由6-16个字符（数字、字母、下划线）组成！"
            },
            newpwd_repect: {
                required: "请填写确认密码！",
                rangelength: "密码需由6-16个字符（数字、字母、下划线）组成！",
                equalTo: "两次输入密码不一致！"
            }
        }
    });

    loadUserAvatar();

    $('#img_sel,#img_sel2').on('change',function(){
        if(!/image\/\w+/.test(this.files[0].type)){
            alert("只支持JPG、PNG、GIF文件");
            return false;
        }
        if(this.files[0].size > 5*1024*1024){
            alert("文件大小不能超过5M");
            return false;
        }
        $('#avatar_label').hide();
        $('#avatar_canvas').empty();
        $('#avatar_canvas').show();
        $('.avatar_bar').show();
        $('.avatar_buttons').show();
        var reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        reader.onload = function(){
            var img = new Image();
            img.onload = function(){
                var MAXWIDTH = $('.avatar_left').width(),
                    MAXHEIGHT = $('.avatar_left').height();
                var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.width, img.height);
                var canvas = document.createElement('canvas');
                canvas.width = rect.width;
                canvas.height = rect.height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img,0,0,rect.width,rect.height);
                $('#avatar_canvas').append($(canvas));
                //big mid small
                var canvas_big = document.getElementById('avatar_big');
                var ctx_b = canvas_big.getContext('2d');
                var canvas_mid = document.getElementById('avatar_mid');
                var ctx_m = canvas_mid.getContext('2d');
                var canvas_sma = document.getElementById('avatar_sma');
                var ctx_s = canvas_sma.getContext('2d');
                ctx_b.drawImage(img,0,0,$('#avatar_big').width(),$('#avatar_big').height());
                ctx_m.drawImage(img,0,0,$('#avatar_mid').width(),$('#avatar_mid').height());
                ctx_s.drawImage(img,0,0,$('#avatar_sma').width(),$('#avatar_sma').height());
                //图片裁剪Jcrop插件
                $(canvas).Jcrop({
                    aspectRatio:1,
                    onChange:function(c){
                        if(c.w > 0 && c.h >0){
                            c.x = c.x * rect.rate;
                            c.y = c.y * rect.rate;
                            c.w = c.w * rect.rate;
                            c.h = c.h * rect.rate;    //去除缩放比
                            ctx_b.drawImage(img, c.x, c.y, c.w, c.h,0,0,$('#avatar_big').width(),$('#avatar_big').height());
                            ctx_m.drawImage(img, c.x, c.y, c.w, c.h,0,0,$('#avatar_mid').width(),$('#avatar_mid').height());
                            ctx_s.drawImage(img, c.x, c.y, c.w, c.h,0,0,$('#avatar_sma').width(),$('#avatar_sma').height());
                        }
                    }
                });
            };
            img.src = this.result;
        };
    });

    $('#saveAvatar').on('click',function(){
        var canvas_a = document.getElementById('avatar_big');
        var canvas_b = document.getElementById('avatar_mid');
        var canvas_c = document.getElementById('avatar_sma');
        $.ajax({
            type:'POST',
            url:'/mySet/setAvatar',
            dataType:'JSON',
            data:{big:canvas_a.toDataURL(),mid:canvas_b.toDataURL(),small:canvas_c.toDataURL()},
            success:function(data){
                alert(data.reStr);
                if(data.reCode == '100'){
                    window.location.href = '/home';
                }
            }
        });
    });

/*    $('#rotate').on('click',function(){

    });*/
});

/**
 * 计算图形尺寸
 * @param maxWidth
 * @param maxHeight
 * @param width
 * @param height
 * @returns {{top: number, left: number, width: *, height: *}}
 */
function clacImgZoomParam( maxWidth, maxHeight, width, height ){
    var param = {top:0, left:0, width:width, height:height, rate:1};
    if( width>maxWidth || height>maxHeight )
    {
        rateWidth = width / maxWidth;
        rateHeight = height / maxHeight;

        if( rateWidth > rateHeight )
        {
            param.width =  maxWidth;
            param.height = Math.round(height / rateWidth);
            param.rate = rateWidth;
        }else
        {
            param.width = Math.round(width / rateHeight);
            param.height = maxHeight;
            param.rate = rateHeight;
        }
    }
    param.left = Math.round((maxWidth - param.width) / 2);
    param.top = Math.round((maxHeight - param.height) / 2);
    return param;
}

/**
 * 加载用户头像
 */
function loadUserAvatar(){
    var src = $('#hid_userAvatar').val();
    var img = new Image();
    img.onload = function(){
        var canvas_big = document.getElementById('avatar_big');
        var ctx_b = canvas_big.getContext('2d');
        ctx_b.drawImage(img,0,0,$('#avatar_big').width(),$('#avatar_big').height());
    };
    img.src = src.replace(new RegExp("\\{type\\}","gm"),'big');

    var img1 = new Image();
    img1.onload = function(){
        var canvas_mid = document.getElementById('avatar_mid');
        var ctx_m = canvas_mid.getContext('2d');
        ctx_m.drawImage(img1,0,0,$('#avatar_mid').width(),$('#avatar_mid').height());
    };
    img1.src = src.replace(new RegExp("\\{type\\}","gm"),'mid');

    var img2 = new Image();
    img2.onload = function(){
        var canvas_sma = document.getElementById('avatar_sma');
        var ctx_s = canvas_sma.getContext('2d');
        ctx_s.drawImage(img2,0,0,$('#avatar_sma').width(),$('#avatar_sma').height());
    };
    img2.src = src.replace(new RegExp("\\{type\\}","gm"),'small');
}