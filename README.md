> ⚠️ **本仓库已停止维护,已迁移至 [waterV3](https://github.com/541611262/waterV3)。** 这里是早期版本,仅作存档。

# 滤芯更换提醒系统部署指南

## 在线部署（推荐使用GitHub Pages）

### 步骤1：创建GitHub仓库
1. 登录GitHub账号（如果没有请先注册）
2. 点击右上角"+" → "New repository"
3. 输入仓库名称（如`water-filter-reminder`）
4. 选择"Public"（私有仓库需要付费才能使用GitHub Pages）
5. 勾选"Add a README file"
6. 点击"Create repository"

### 步骤2：上传项目文件
1. 打开终端，进入项目目录：
   ```bash
   cd /Users/orlando/Desktop/water_filter_reminder
   ```
2. 初始化Git仓库：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. 连接到GitHub仓库：
   ```bash
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```

### 步骤3：启用GitHub Pages
1. 在GitHub仓库页面，点击"Settings"选项卡
2. 左侧菜单选择"Pages"
3. 在"Branch"部分选择`main`分支
4. 点击"Save"
5. 等待1-2分钟，页面会显示您的网站URL（格式：`https://你的用户名.github.io/仓库名/`）

### 步骤4：访问您的网站
1. 将生成的URL分享给同事
2. 所有同事通过浏览器访问该URL即可使用系统

## 替代方案：Vercel部署（更专业）

1. 访问 [https://vercel.com/](https://vercel.com/) 并注册账号
2. 点击"New Project" → 导入您的GitHub仓库
3. 无需额外配置，直接点击"Deploy"
4. Vercel会自动分配一个专业域名（如`your-project.vercel.app`）

## 注意事项

1. **数据存储**：
   - 系统使用浏览器本地存储（localStorage）
   - 每位用户的数据仅保存在其自己的浏览器中
   - 不同设备间数据不会同步

2. **数据备份**：
   - 定期使用"导出数据"功能备份客户数据
   - 导出的CSV文件可保存到公司服务器

3. **域名定制**（可选）：
   - 在GitHub Pages或Vercel设置中可以绑定自定义域名
   - 如`water-filter.yourcompany.com`
