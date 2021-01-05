# 古蹟導覽地圖

<p>
  介接政府OpenAPI，提供使用者瀏覽最新公告的古蹟資訊。可查詢個別古蹟公告年分、過往歷史、位置分布、現況照片，並以圖表呈現各縣市古蹟數量與種類。此專案為桌機版本，目前尚不支援螢幕解析度1280px以下之裝置，但相關響應式設計已列入接下的更新計畫。
</p>
<p>
  Demo：<a  href="https://vue-map-culture-site.herokuapp.com/">古蹟導覽地圖</a>
</p>

![image](http://github.com/kjwen310/vue-map-culture-site/raw/main/client/public/images/vue-map-readme-1.png)



## 使用技術

- 利用 [Vue.js](https://vuejs.org/) 搭配 [Vue CLI](https://cli.vuejs.org/) 建立前端頁面
- 利用 [Node.js](https://nodejs.org/en/) 搭配 [Express](https://expressjs.com/) 架設Proxy Server，處理 CORS 跨域請求
- 利用 [Leaflet.js](https://leafletjs.com/) 搭配 [Open Street Map](https://www.openstreetmap.org/)  處理地圖資訊
- 利用 [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) 實作不同尺度下的marker聚散效果，提升使用者體驗
- 利用 [vue-chartjs](https://vue-chartjs.org/) 製作圓餅圖、長條圖等圖表
- 利用 [axios](https://github.com/axios/axios) 處理 AJAX 請求，獲取後端資料
- 利用 [Bootstrap 4](https://getbootstrap.com/) 建立畫面 UI



## 特色介紹

1. 以視覺化圖表描繪全國及各縣市的古蹟概況
2. 左側選單可以所在行政區、關鍵字，篩檢查詢對象
3. 以地圖、標籤呈現古蹟分布情形與近況圖片，國定古蹟標籤為綠色，其餘為灰色
4. 右側選單呈現特定古蹟資訊，並可自由收闔


> 以圓餅圖、長條圖呈現區域古蹟概況，滑鼠碰觸時將顯示進一步的資訊。

![image](http://github.com/kjwen310/vue-map-culture-site/raw/main/client/public/images/vue-map-readme-2.png)

> 依不同區域尺度設定放大層級，並可利用左側選單選擇特定古蹟。

![image](http://github.com/kjwen310/vue-map-culture-site/raw/main/client/public/images/vue-map-readme-3.png)


> 點選特定古蹟，即可顯示相關圖片、歷史背景等資訊。

![image](http://github.com/kjwen310/vue-map-culture-site/raw/main/client/public/images/vue-map-readme-4.png)


> 可使用關鍵字查詢，查詢結果將呈現在左側列表。

![image](http://github.com/kjwen310/vue-map-culture-site/raw/main/client/public/images/vue-map-readme-5.png)



## 更新計畫

1. 未來將優先兼容至解析度1024px以上之裝置，再進一步兼容行動裝置。
2. 未來將進一步將「歷史建築」資料納入專案，並更新相關圖標、聚散視覺效果。


---


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
