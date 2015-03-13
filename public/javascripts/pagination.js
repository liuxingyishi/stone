/**
 * Created by lenovo on 2015/2/26.
 */
function pagination(options){
    if(!options) options = {};
    this.pageIndex = options.pageIndex || 1;//当前第几页
    this.pageSize = options.pageSize || 10; //一页共几个
    this.borderMax = options.borderMax || 5; //最多一共显示几页 * 左右各显示
    this.count = options.count || 0; //一共多少条数据
    this.size = Math.ceil(this.count / this.pageSize);
    this.start = this.pageIndex - this.borderMax >= 1 ? this.pageIndex - this.borderMax : 1;
    this.end = this.pageIndex + this.borderMax >= this.size ? this.size : this.pageIndex + this.borderMax;
}

pagination.prototype.draw = function(){
    var wrap = '';
    if(this.count === 0 || this.pageIndex > this.size || this.pageIndex <= 0 || this.size == 1) return '';
    if(this.pageIndex!=1){
        wrap += '<li><a href="#" rel="1">&laquo;</a></li>';
        wrap += '<li><a href="#" rel="'+ (this.pageIndex - 1) +'">&lsaquo;</a></li>';
    }
    for(var i=this.start;i <= this.end;i++){
        var cls = this.pageIndex == i ? ' class="active"' : '',
            item = '<li'+cls+'><a href="#" rel="'+ i +'">'+i+'</a></li>';
        wrap += item;
    }
    if(this.pageIndex!=this.size){
        wrap += '<li><a href="#" rel="'+ (this.pageIndex + 1) +'">&rsaquo;</a></li>';
        wrap += '<li><a href="#" rel="'+this.size+'">&raquo;</a></li>';
    }
    return wrap;
};

pagination.prototype.init = function(){
    return this.draw();
};
