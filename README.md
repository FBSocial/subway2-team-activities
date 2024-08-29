Fanbook 内的「游乐园」 Tab，支持站外打开。

# 访问地址

[测试环境](https://mp-sit.fanbook.cc/subway-team-activities/) |
[预发布地址](https://mp-pre.fanbook.cn/subway-team-activities/) |
[正式地址](https://mp.fanbook.cn/subway-team-activities/)

# 构建与发布

[构建地址](https://devops.uu.cc/console/pipeline/idfe/p-49799d62ae26460eb5bcf3d23a9bea01/detail/b-41d67223a7194673b94c64c4691016eb)

## 发布

1. 打开 [发布地址](http://apps.bkpaas.uu.cc/bk--sops/appmaker/694/newtask/86/selectnode/?template_id=1105)
2. ENV 选择对应的环境，这个环境和打包的环境一致（你可以自己发布沙盒和预发布，如果发正式环境请看下文）
3. TAG_VER 输入格式如 `v1.0.308`
4. 其他保持不动
5. 进入下一步

### 发布正式环境

1. 打包好制品后，在[【测试环境】构建通知群](https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=e3ai1bc5-bf92-47d3-afef-bf58c68b825a)
可以看到一条通知，复制构件下载地址。

2. 打开[Fanbook-版本发布](https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=dddo323c-d34a-4725-af9a-3eb5df416ea3)
群，新建一条富文本消息，格式大概为：

> #### 小程序发布 —— 组队活动
>
> http://artifactory.uu.cc/generic-local/bk-custom/idfe/mp.fanbook.cn/mp.fanbook.cn_v1.0.310.tgz
>
> **ChangeLog**
>
> 1. 添加分享按钮
> 2. Something else
>
> @len.liu刘军 @bruce.lan蓝应志 @mark.zhang张伟

@ 的人分别为「运维」，「直属上级」，「PM」
