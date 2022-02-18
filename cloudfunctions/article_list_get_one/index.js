// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    let id = event.id;
    let openid = cloud.getWXContext().OPENID;

    let res1 = await db.collection("article_list").doc(id).get();

    //获取一共多少个赞
    let res2 = await db.collection("article_like").where({
        artid: id
    }).count();

    //获取最新点赞用户的头像
    let res3 = await db.collection("article_like").where({
        artid: id
    }).field({
        avatarUrl: true
    })
        .orderBy("posttime", "desc").limit(5).get();

    //判断是否已经点过赞
    let res4 = await db.collection("article_like").where({
        artid: id,
        openid: openid
    }).count();

    let random = Math.ceil(Math.random() * 20)

    // 自增一次阅读量
    let res5 = await db.collection("article_list").doc(id)
        .update({
            data: {
                hits: _.inc(random)
            }
        })

    if (res4.total) {
        res1.data.onlike = true
    } else {
        res1.data.onlike = false
    }
    res1.data.zanSize = res2.total;
    res1.data.userArr = res3.data.reverse()

    return res1;
}