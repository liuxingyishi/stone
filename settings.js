/**
 * Created by lenovo on 2015/2/12.
 */
exports.settings = {
    cookieSecret: 'lqssbb',
    db: 'stone',
    host: 'localhost',
    dbUser:'stone',
    dbPwd:'123456',
    emailService:'163',
    emailUser:'liuxingyishi@yeah.net',//liuxingyishi@yeah.net
    emailPwd:'1234qwer'
};
exports.config = {
    feeType:[{show:'-请选择-',value:''},
        {show:'餐饮',value:'1'},
        {show:'交通',value:'2'},
        {show:'购物',value:'3'},
        {show:'娱乐',value:'4'},
        {show:'人情',value:'5'},
        {show:'话费',value:'6'},
        {show:'租房',value:'7'},
        {show:'水电',value:'8'},
        {show:'其他',value:'99'}],        //支出-类别
    pageSize:10,        //分页数
    avatarDir:'avatar'     //头像文件夹
}