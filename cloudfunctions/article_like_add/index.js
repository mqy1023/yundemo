// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID
    let { nickName, avatarUrl, posttime, artid } = event;

    //判断数据库中是否有当前用户点过赞
    let count = await db.collection("article_like").where({
        artid,
        openid
    }).count();

    if (count.total) {
        return await db.collection("article_like").where({
            artid,
            openid
        }).remove();
    }

    return await db.collection("article_like").add({
        data: {
            nickName, avatarUrl, posttime, artid, openid
        }
    })

}