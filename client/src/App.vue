<template>
  <div id="app">
    <loading :active.sync="isLoading"></loading>
    <div class="map">
      <div class="container-fluid">
        <div class="row">
          <div class="col-3 p-0">
            <div v-if="innerWidth >= 1280" class="toolbox">
              <div class="sticky-top bg-white shadow-sm p-3">
                <div class="form-group d-flex">
                  <label for="cityName" class="mr-2 col-form-label text-right">縣市</label>
                  <div class="flex-fill">
                    <select
                      id="cityName"
                      class="form-control"
                      v-model="select.city"
                      @change="select.area = ''; updateSelection()">
                      <option value="">-- 全國資料 --</option>
                      <option :value="c.CityName" v-for="c in cityName" :key="c.CityName">
                        {{ c.CityName }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="form-group d-flex">
                  <label for="area" class="mr-2 col-form-label text-left">鄉鎮市區</label>
                  <div class="flex-fill">
                    <select
                      id="area"
                      class="form-control"
                      v-if="select.city"
                      v-model="select.area"
                      @change="updateSelection"
                    >
                      <option value="">-- 全部區域 --</option>
                      <option
                        :value="a.AreaName"
                        v-for="a in cityName.find((city) => city.CityName === select.city).AreaList"
                        :key="a.AreaName"
                      >
                        {{ a.AreaName }}
                      </option>
                    </select>
                    <select class="form-control" v-else disabled>
                      <option value="">-- 全國資料 --</option>
                    </select>
                  </div>
                </div>
                <div class="form-group d-flex">
                  <label for="search" class="mr-2 col-form-label text-left">查詢</label>
                  <div class="flex-fill">
                    <input
                      type="text"
                      class="form-control"
                      id="search" placeholder="名稱、關鍵字"
                      v-model="searchText"
                      @keyup.enter="search"
                    />
                  </div>
                </div>
              </div>

              <p
                v-if="culSite && !select.city && !select.area && !isShowBar"
                class="text-right pr-1"
              >
                <span><i class="fas fa-hashtag"></i></span>
                <span v-for="(char, i) in getSearchText" :key="i">
                  {{ char | hashtagFilter(i) }}
                </span>
                <span class="ml-2">共 <span class="count">{{ culSite.length }}</span> 個結果</span>
              </p>

              <p v-else class="text-right pr-1">
                <span class="mr-1"><i class="fas fa-map-marker-alt"></i></span>
                <span v-if="select.city" class="mr-1">{{ select.city }}</span>
                <span v-else class="mr-1">全國</span>
                <span v-if="select.area">{{ select.area }}</span>
                <span class="ml-3">共</span>
                <span v-if="select.city && !select.area" class="count">
                  {{ cityCulSite.length }}
                </span>
                <span v-if="select.city && select.area" class="count">
                  {{ culSite.length }}
                </span>
                <span v-if="!select.city && !select.area" class="count">
                  {{ data.length }}
                </span>
                處
              </p>

              <div class="chart" v-if="cityCulSite && select.city && !select.area">
                <PieChart :chart-data="pieChartData" />
              </div>

              <div v-if="isShowBar" class="chart">
                <BarChart :chart-data="barChartData" />
              </div>

              <ul class="list-group" v-if="culSite && !isShowBar || culSite && select.area">
                <div v-for="(item, index) in culSite" :key="index">
                  <div class="list-group-item text-left" @click="setView(item)">
                    <h3>{{ item.caseName }}</h3>
                    <p class="mb-1">
                      分級：{{ item.assetsClassifyName }}
                    </p>
                    <p class="mb-1">
                      種類：{{ item.assetsTypes[0].name }}
                    </p>
                    <p class="map-link mb-0">
                      位址：<a :href="`https://www.google.com.tw/maps/place/${item.belongAddress}`"
                      target="_blank" title="Google Map">
                      {{ item.belongAddress }}</a>
                    </p>
                  </div>
                </div>
              </ul>

            </div>
          </div>
          <div class="col-9 p-0">
            <div id="map"></div>
          </div>
        </div>
      </div>
      <Aside :case="caseInfo" :is-toggle="isToggle"/>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import cityName from '@/assets/cityName.json';
import addInfo from '@/assets/addInfo.json';
import posCorrection from '@/assets/posCorrection.json';
import icons from '@/assets/icons';
import PieChart from '@/components/PieChart.vue';
import BarChart from '@/components/BarChart.vue';
import Aside from '@/components/Aside.vue';

export default {
  components: { PieChart, BarChart, Aside },
  data() {
    return {
      cityName,
      innerWidth: 0,
      osmMap: {},
      data: [],
      cityCulSite: [],
      culSite: [],
      markerGroup: [],
      searchText: '',
      getSearchText: '',
      isShowBar: false,
      isToggle: false,
      isLoading: false,
      select: {
        city: '',
        area: '',
      },
      prev: {
        marker: null,
        icon: null,
      },
      caseInfo: {
        assetsTypes: [{
          name: '',
        }],
      },
      cities: [
        { name: '臺北市', nationalNum: 0, items: [] },
        { name: '新北市', nationalNum: 0, items: [] },
        { name: '基隆市', nationalNum: 0, items: [] },
        { name: '桃園市', nationalNum: 0, items: [] },
        { name: '新竹縣', nationalNum: 0, items: [] },
        { name: '新竹市', nationalNum: 0, items: [] },
        { name: '苗栗縣', nationalNum: 0, items: [] },
        { name: '臺中市', nationalNum: 0, items: [] },
        { name: '彰化縣', nationalNum: 0, items: [] },
        { name: '南投縣', nationalNum: 0, items: [] },
        { name: '雲林縣', nationalNum: 0, items: [] },
        { name: '嘉義縣', nationalNum: 0, items: [] },
        { name: '嘉義市', nationalNum: 0, items: [] },
        { name: '臺南市', nationalNum: 0, items: [] },
        { name: '高雄市', nationalNum: 0, items: [] },
        { name: '屏東縣', nationalNum: 0, items: [] },
        { name: '宜蘭縣', nationalNum: 0, items: [] },
        { name: '花蓮縣', nationalNum: 0, items: [] },
        { name: '臺東縣', nationalNum: 0, items: [] },
        { name: '澎湖縣', nationalNum: 0, items: [] },
        { name: '金門縣', nationalNum: 0, items: [] },
        { name: '連江縣', nationalNum: 0, items: [] },
      ],
      siteTypes: [
        { type: '宅第', num: 0, color: '#F2A074' },
        { type: '關塞', num: 0, color: '#EAA568' },
        { type: '寺廟', num: 0, color: '#DFAA5F' },
        { type: '城郭', num: 0, color: '#D0B05A' },
        { type: '祠堂', num: 0, color: '#C0B659' },
        { type: '衙署', num: 0, color: '#ADBB5E' },
        { type: '車站', num: 0, color: '#98C068' },
        { type: '書院', num: 0, color: '#82C376' },
        { type: '碑碣', num: 0, color: '#6BC687' },
        { type: '教堂', num: 0, color: '#52C89A' },
        { type: '牌坊', num: 0, color: '#39C8AF' },
        { type: '墓葬', num: 0, color: '#26C7C2' },
        { type: '堤閘', num: 0, color: '#2CC5D5' },
        { type: '產業', num: 0, color: '#49C1E3' },
        { type: '燈塔', num: 0, color: '#6CBCEE' },
        { type: '橋梁', num: 0, color: '#8FB5F3' },
        { type: '學校', num: 0, color: '#B2ACF2' },
        { type: '銀行', num: 0, color: '#D2A1EA' },
        { type: '其他設施', num: 0, color: '#EE96DD' },
      ],
    };
  },
  filters: {
    hashtagFilter(value, i) {
      if (i === 2) return '...';
      if (value.length <= 4) {
        if (i === 0) return value;
        if (i === 1) return `, ${value} `;
      } else {
        if (i === 0) return `${value.slice(0, 3)}...`;
        if (i === 1) return `, ${value.slice(0, 3)}...`;
      }
      return '';
    },
  },
  computed: {
    barChartData() {
      const aimData1 = [];
      const aimData2 = [];
      const aimLabel = [];
      this.cities.forEach((city) => {
        aimData1.push(city.nationalNum);
        aimData2.push(city.items.length - city.nationalNum);
        aimLabel.push(city.name);
      });

      const data = {
        datasets: [
          {
            data: aimData1,
            label: '國定古蹟',
            backgroundColor: '#D6E9C6',
            barPercentage: 0.3,
            barThickness: 12,
          },
          {
            data: aimData2,
            label: '直轄市/縣市定古蹟',
            backgroundColor: '#FAEBCC',
            barPercentage: 0.3,
            barThickness: 12,
          },
        ],
        labels: aimLabel,
      };

      return data;
    },
    pieChartData() {
      this.cityCulSite.forEach((item) => {
        this.siteTypes.forEach((siteType) => {
          if (item.assetsTypes[0].name === siteType.type) {
            /* eslint-disable-next-line */
            siteType.num += 1;
          }
        });
      });
      let counter = 0;
      const aimData = [];
      const aimColor = [];
      const aimLabel = [];
      this.siteTypes.filter((item) => item.num > 1).forEach((aim) => {
        counter += aim.num;
        aimData.push(aim.num);
        aimColor.push(aim.color);
        aimLabel.push(aim.type);
      });

      aimData.push(this.cityCulSite.length - counter);
      aimColor.push('#D3D3D3');
      aimLabel.push('其他');

      const data = {
        datasets: [
          {
            data: aimData,
            backgroundColor: aimColor,
          },
        ],
        labels: aimLabel,
      };
      this.siteTypes.forEach((item) => {
        /* eslint-disable-next-line */
        item.num = 0;
      });
      return data;
    },
  },
  methods: {
    updateSelection() {
      if (this.select.city === '') {
        this.isShowBar = true;
      } else {
        this.isShowBar = false;
        this.culSite = [];
        this.cityCulSite = this.cities.find((city) => city.name === this.select.city).items;
        if (this.select.area !== '') {
          this.culSite = this.cityCulSite
            .filter((item) => item.belongCity.slice(3) === this.select.area);
          this.setOverView(this.culSite[0]);
        } else {
          this.setOverView(this.cityCulSite[0]);
        }
      }
    },
    search() {
      if (this.searchText === '') {
        this.isShowBar = true;
        this.select.city = '';
        this.select.area = '';
      } else {
        this.isShowBar = false;
        this.searchText = this.searchText.split(' ');
        const searchResult = this.data.filter((item) => {
          let i = 0;
          let target = -1;
          while (i < this.searchText.length && target < 0) {
            target = item.caseName.indexOf(this.searchText[i]);
            i += 1;
          }
          return target >= 0;
        });

        this.culSite = searchResult;
        this.getSearchText = this.searchText;
        this.searchText = '';
        this.select.city = '';
        this.select.area = '';
        if (this.culSite.length) {
          this.setView(this.culSite[0]);
        }
      }
    },
    sortCities() {
      this.cities.sort((x, y) => {
        const a = x.items.length;
        const b = y.items.length;
        if (a < b) return 1;
        if (a > b) return -1;
        return 0;
      });
    },
    setMarkerCluster() {
      const markers = new L.MarkerClusterGroup();

      this.data = this.data.filter((item) => item.caseId !== '20180206000001' && item.caseId !== '20191128000001' && item.caseId !== '19881111000011' && item.caseId !== '19870417000002');

      this.data.forEach((item) => {
        posCorrection.forEach((pos) => {
          if (item.caseId === pos.id) {
            /* eslint-disable-next-line */
            item.latitude = pos.lat;
            /* eslint-disable-next-line */
            item.longitude = pos.lng;
          }
        });

        addInfo.forEach((add) => {
          if (item.caseId === add.id) {
            /* eslint-disable-next-line */
            item.latitude = add.lat;
            /* eslint-disable-next-line */
            item.longitude = add.lng;
            /* eslint-disable-next-line */
            item.pastHistory = add.pastHistory;
            /* eslint-disable-next-line */
            item.buildingFeatures = add.buildingFeatures;
          }
        });

        this.cities.forEach((city) => {
          if (item.belongCity.slice(0, 3) === city.name) {
            if (item.assetsClassifyName === '國定古蹟') {
              /* eslint-disable-next-line */
              city.nationalNum += 1;
            }
            city.items.push(item);
          }
        });

        if (item.latitude && item.longitude) {
          const icon = item.assetsClassifyName === '國定古蹟' ? icons.green : icons.grey;
          /* eslint-disable-next-line */
          const flag = L.marker([item.latitude, item.longitude], { icon: icon, title: item.caseId })
            .on('click', () => {
              if (this.prev.marker && this.prev.marker.options.title !== item.caseId) {
                this.prev.marker.setIcon(this.prev.icon);
              }
              if (flag.getIcon() === icons.red) {
                flag.setIcon(icon);
                this.prev.marker = null;
                this.prev.icon = null;
                this.isToggle = false;
              } else {
                flag.setIcon(icons.red);
                this.osmMap.setView([item.latitude + 0.0008, item.longitude + 0.0009], 18);
                this.prev.marker = flag;
                this.prev.icon = icon;
                this.caseInfo = item;
                this.isToggle = true;
              }
            });

          const content = (item.representImage)
            ? `<div style="width: 400px; height: 300px; padding-top: 6px">
                <img src="${item.representImage}" style="width:100%; height: 100%; object-fit: cover; border-radius: 6px;"/>
               </div>
               <h4 style="margin: 16px 0;">${item.caseName}</h4>
              `
            : `<div style="width: 400px; height: 300px; padding-top: 6px; background: #F5F5F5; display: flex; justify-content: center; align-items: center; border-radius: 6px;">
                <p style="font-size: 2rem; color: #474747">無影像資料</p>
               </div>
               <h4 style="margin: 16px 0;">${item.caseName}</h4>
              `;

          markers.addLayer(flag.bindPopup(content, { maxWidth: 400, autoPan: false }));
          this.markerGroup.push(flag);
        }
      });

      this.osmMap.addLayer(markers);
      this.sortCities();
      this.isShowBar = true;
      this.setOverView(this.data[0]);
    },
    setOverView(item) {
      const correction = this.select.area === '' ? 0.3 : 0.04;
      const zoomLevel = this.select.area === '' ? 10 : 13;
      this.osmMap.setView([item.latitude, item.longitude + correction], zoomLevel);
      this.caseInfo = item;
    },
    setView(item) {
      const currMarker = this.markerGroup.find((marker) => marker.options.title === item.caseId);
      const icon = currMarker.getIcon();
      if (this.prev.marker && this.prev.icon) {
        this.prev.marker.setIcon(this.prev.icon);
      }
      currMarker.setIcon(icons.red);
      this.prev.marker = currMarker;
      this.prev.icon = icon;
      this.osmMap.setView([item.latitude + 0.0008, item.longitude + 0.0009], 18);
      currMarker.openPopup();
      this.caseInfo = item;
      this.isToggle = true;
    },
  },
  mounted() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1280) {
      this.$swal({
        icon: 'info',
        title: '螢幕解析度不足',
        text: '很抱歉，為保持地圖順暢瀏覽，螢幕解析度須大於1280px，謝謝！',
      });
    } else {
      this.isLoading = true;
      this.osmMap = L.map('map', {
        center: [25.03, 121.55],
        zoom: 10,
        minZoom: 6,
        maxZoom: 18,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.osmMap);

      this.$http.get('api/air')
        .then((res) => {
          this.data = Object.values(res.data);
          this.setMarkerCluster();
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
          this.$swal({
            icon: 'error',
            title: '發生錯誤',
            text: '很抱歉，資料載入時發生錯誤，請確認您的連線是否穩定，並重新載入頁面。',
          });
        });
    }
  },
};
</script>

<style lang="scss">
  body {
    box-sizing: border-box;
    overflow: hidden;
  }
  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }
  a {
    text-decoration: none;
  }
  h3 {
    font-size: 1.4rem;
    letter-spacing: 0.08rem;
    color: #474747;
  }
  .list-group-item {
    border: none;
  }

  .map {
    width: 100%;
    height: 100vh;
    .toolbox {
      height: 100vh;
      padding: 0 10px 40px;
      overflow-y: auto;
      p {
        font-size: 0.9rem;
        letter-spacing: 0.02rem;
        color: gray;
      }
      .list-group-item {
        border-bottom: 2px solid #DCDCDC;
        border-radius: 2px;
        cursor: pointer;
        &:hover {
          background: #F5F5F5;
        }
      }
      .count {
        font-size: 2rem;
      }
      .chart {
        width: 100%;
        padding: 0.5rem 0.5rem;
        overflow-x: hidden;
      }
      .fa-map-marker-alt {
        color: #f28482;
      }
      .fa-hashtag {
        color: #f2cc8f;
      }
    }
    #map {
    height: 100vh;
    width: 100%;
    overflow: hidden;
  }
}
</style>
