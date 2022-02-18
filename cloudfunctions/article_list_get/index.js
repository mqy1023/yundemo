// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    let size = event.size;
    let res1 = await db.collection("article_list")
        .orderBy("_createTime", "desc")
        .limit(7)
        .skip(size)
        .get();


    for (let i = 0; i < res1.data.length; i++) {
        let count = await db.collection("article_like").where({
            artid: res1.data[i]._id
        }).count();
        res1.data[i].zanSize = count.total
    }

    return res1;
}
