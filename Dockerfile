# 使用官方 Node.js 14 image 作為基底
FROM node:18

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 如果你是在開發環境，可以使用以下指令來安裝 devDependencies
# RUN npm install --only=development

# 複製應用程式的源碼
COPY . .

# 編譯 TypeScript 到 JavaScript
RUN npm run build

# 開放容器內的 3000 port
EXPOSE 3000

# 啟動應用程式
CMD [ "npm", "start" ]