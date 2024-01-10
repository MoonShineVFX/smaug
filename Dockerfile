# 使用官方 Node.js 14 image 作為基底
FROM node:18.18.2

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製應用程式的源碼
COPY . .

ENV DATABASE_URL="postgresql://post:post@moonshine@pg-db/smaug_main?schema=public"

RUN npm run pm-generate


# 編譯 TypeScript 到 JavaScript
RUN npm run build

# 開放容器內的 3000 port
EXPOSE 3000

# 啟動應用程式
CMD [ "npm", "start" ]