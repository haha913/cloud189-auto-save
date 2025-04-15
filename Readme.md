# cloud189-auto-save

天翼云盘自动转存系统，支持自动监控更新并转存文件, 支持STRM生成, Emby入库通知。

## 功能特点

- 支持多账号管理
- 自动监控分享链接更新, 自动重命名
- 支持企业微信、Telegram, Bark, Wxpusher 消息推送
- Web 界面管理，响应式布局, 操作便捷
- Docker 部署，方便维护
- 支持 STRM 文件生成
- 支持 Emby 媒体库自动刷新
- 支持自动清理回收站

## 快速开始

## Docker 部署

### 直接使用镜像

```bash
docker run -d \
  -v /yourpath/data:/home/data \
  -v /yourpath/strm:/home/strm \
  -p 3000:3000 \
  --restart unless-stopped \
  --name cloud189 \
  -e PUID=0 \
  -e PGID=0 \
  xia1307/cloud189-auto-save
  ```
注意: `yourpath`请替换为你宿主机的目录; 如果不需要strm功能, 可以不挂载strm目录, 允许配置PUID和PGID, 默认0

### 访问系统

浏览器访问 `http://localhost:3000`，默认账号密码为admin admin 登录后请在系统页修改密码

## 使用说明

### 1. 账号管理
- 支持账号密码登录和 Cookie 登录两种方式
- Cookie 登录步骤：
  1. 打开天翼云盘官网登录界面
  2. 打开浏览器的开发者工具(ctrl+f12), 勾选保留日志
  3. 正常发起登录, 然后在开发者工具中选择网络(network)
  4. 在请求中找到 loginSubmit.do, 点击打开详情
  5. 获取 set-cookie 中的 SSON 值（只需要 SSON=xxxxx 中的 xxxxx 部分）
  6. 填入账号创建中的 cookie 中即可
  7. 可点击媒体目录和本地目录设置STRM的访问前缀

### 2. 任务管理
- 创建任务需填写：
  - 选择账号
  - 分享链接（支持加密链接，需填写访问码）
  - 保存目录（支持目录树选择）
  - 总集数（可选，用于追更进度统计）
  - 文件名匹配规则（可选，用于过滤文件）
- 支持批量任务创建：首次创建时会自动识别分享链接中的目录结构
- 支持手动执行任务
- 支持删除任务（可选是否同时删除云盘文件）

### 3. 自动重命名
- 支持两种重命名方式：
  - 正则表达式重命名：支持后续自动更新时应用同样的规则
  - 顺序重命名：适合一次性重命名
- 操作步骤：
  1. 点击任务的更新目录
  2. 选择需要重命名的文件
  3. 点击批量重命名按钮
  4. 选择重命名方式并设置规则
  5. 预览重命名效果
  6. 确认保存

### 4. 系统设置
- 任务设置：
  - 任务过期天数：超过指定天数未更新的任务自动标记完成
  - 任务重试次数和间隔
  - 定时检查时间（支持 Cron 表达式）
  - 自动清空回收站（支持个人和家庭网盘）
- 媒体设置：
  - STRM 文件生成：自动为媒体文件生成对应的 STRM 文件
  - Emby 通知：支持自动刷新 Emby 媒体库
    - 路径替换规则说明：
      1. 示例场景：
         - 天翼云盘中的文件路径：`/影视剧/电视剧/北上/Season 01/S01E01.mkv`
         - Emby 媒体库中的路径：`/cloud/天翼云盘/电视剧`
         - 账号中的Emby路径替换配置：`/影视剧:/cloud/天翼云盘`
      
      2. 替换执行逻辑：
         - 系统会优先尝试完整路径匹配：
           `/cloud/天翼云盘/电视剧/北上/Season 01`
         - 如果完整路径不存在，会逐级向上查找：
           `/cloud/天翼云盘/电视剧/北上`
           `/cloud/天翼云盘/电视剧`
         - 如果所有层级都未找到匹配项，将执行全库扫描
- 消息推送：
  - 企业微信
  - Telegram
  - Bark
  - WxPusher

### 5. Telegram 机器人使用
- 配置说明：
  1. 在 [@BotFather](https://t.me/BotFather) 创建机器人并获取 Token
  2. 在系统设置中填入 Bot Token 并启用 Telegram 通知
  3. 与机器人开始对话即可使用

- 可用命令：
  - `/help` - 显示帮助信息
  - `/accounts` - 显示账号列表
  - `/tasks` - 显示任务列表
  - `/execute_all` - 执行所有任务
  - `/fl` - 显示常用目录列表
  - `/fs` - 添加常用目录
  - `/search_cs` - 搜索CloudSaver资源
  - `/cancel` - 取消当前操作

- 任务操作命令：
  - `/execute_[ID]` - 执行指定任务
  - `/strm_[ID]` - 生成STRM文件
  - `/emby_[ID]` - 通知Emby刷新
  - `/dt_[ID]` - 删除指定任务

- 目录操作命令：
  - `/df_[ID]` - 删除指定常用目录

- 使用流程：
  1. 选择账号：使用 `/accounts` 命令查看并选择要使用的账号
  2. 常用目录管理
     - 使用 `/fl` 查看当前账号的常用目录列表
     - 使用 `/fs` 进入目录树选择模式
     - 在目录树中可以：
       * 点击文件夹名称进入下级目录
       * 点击返回按钮回到上级目录
       * 点击确认按钮保存当前目录
       * 已添加为常用目录的文件夹会显示 ✅ 标记
     - 使用 `/df_[ID]` 可删除指定的常用目录
  3. 创建转存任务
     - 直接发送天翼云盘分享链接即可
     - 支持以下格式：
       * 普通链接：`https://cloud.189.cn/t/xxxxx`
       * 带访问码链接：`https://cloud.189.cn/t/xxxxx（访问码：xxxx）`
     - 发送链接后会显示常用目录列表
     - 选择保存目录后即可创建任务
     - 如目标位置已存在同名文件夹：
       * 会询问是否覆盖
       * 选择是则删除原文件夹后保存
       * 选择否则取消任务创建
  4. 任务管理
     - 使用 `/tasks` 查看当前任务列表
     - 可进行以下操作：
       * `/execute_[ID]` 立即执行指定任务
       * `/strm_[ID]` 为任务生成STRM文件
       * `/emby_[ID]` 通知Emby刷新指定任务
       * `/dt_[ID]` 删除指定任务（可选是否同时删除云盘文件）
     - 使用 `/execute_all` 可执行所有未完成的任务
  5. CloudSaver资源搜索
     - 使用 `/search_cs` 进入搜索模式
     - 直接输入关键字即可搜索
     - 搜索结果支持点击复制链接
     - 点击保存命令可直接创建任务
     - 使用 `/cancel` 或 3分钟未操作会自动退出搜索模式
注意事项：
- 确保选择了正确的账号再进行操作
- 常用目录建议选择固定的存储位置
- 带访问码的链接请严格按照格式发送
- 任务创建后会自动执行，也可手动触发
- 搜索模式下仅响应搜索关键字，其他命令请先退出
   
## 注意事项
- 更新目录可以任意移动但不能被删除, 否则任务无法执行
- 数据库文件会持久化保存在宿主机的 data 目录
- 支持容器自动重启
- 推荐使用反向代理进行安全访问
- 媒体文件后缀配置会影响文件计数和过滤
- STRM 文件生成需要配置正确的访问前缀
- Emby 通知需要配置正确的服务器地址和 API Key
- 如需使用TG机器人创建任务, 如果是老版本系统, 请取消常用目录所有后重新添加

## 截图
<img width="1505" alt="image" src="https://github.com/user-attachments/assets/359fb6e2-0d38-4a4c-a398-1b820ce47c8c" />
<img width="1391" alt="image" src="https://github.com/user-attachments/assets/03826fc6-ac19-442e-a325-ce22250fdb5e" />
<img width="1327" alt="image" src="https://github.com/user-attachments/assets/8a05ff40-4f70-42a9-9a70-74d9e04f3f64" />
<img width="1354" alt="image" src="https://github.com/user-attachments/assets/c6ddfede-17b2-43eb-838d-de4b1cf93b04" />
<img width="1297" alt="image" src="https://github.com/user-attachments/assets/13380003-2295-4dfb-9d6c-d9229399f8b6" />


## License

MIT