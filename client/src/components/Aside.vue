<template>
  <div class="outer" :class="{active: isActive}">
    <div class="asideMenu">
      <button type="button" class="btn" @click.prevent="toggle">
        <div class="icon" :class="{rotate: isActive}">
          <i class="fas fa-chevron-right fa-2x"></i>
        </div>
      </button>
      <div class="info">
        <h2 class="mb-4">{{ this.case.caseName }}</h2>
        <ul class="mb-4">
          <li>分級：{{ this.case.assetsClassifyName }}</li>
          <li>地點：{{ this.case.belongCity }}</li>
          <li>種類：{{ this.case.assetsTypes[0].name }}</li>
          <li>公告日期：{{ this.case.registerDate }}</li>
        </ul>
        <div class="content">
          <p>{{ this.case.pastHistory }}</p>
          <p>{{ this.case.buildingFeatures }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['case', 'isToggle'],
  data() {
    return {
      isActive: true,
    };
  },
  methods: {
    toggle() {
      this.isActive = !this.isActive;
    },
  },
  watch: {
    /* eslint-disable-next-line */
    isToggle: function (newValue) {
      this.isActive = !newValue;
    },
  },
};
</script>

<style lang="scss" scoped>
.outer {
  position: absolute;
  top: 0;
  right: 0;
  overflow: hidden;
  width: 380px;
  height: 100vh;
  z-index: 1000;
  transform: translateX(0);
  transition: all 0.5s;
  &.active {
    transform: translateX(330px);
  }
  .asideMenu {
    position: absolute;
    width: 400px;
    height: 100%;
    padding-left: 30px;
    overflow-y: auto;
    .btn {
      position: absolute;
      top: 20%;
      left: 0;
      padding: 1.5rem 0.5rem;
      background-color: #ff9a15;
      border-radius: 6px 0 0 6px;
      box-shadow: 0 0 5px hsla(240, 40%, 15%, 0.6);
      .icon {
        color: #474747;
        transform: rotate(0);
        transition: all 0.5s;
        &.rotate {
          transform: rotate(180deg);
        }
      }
    }
    .info{
      color: #fff;
      min-height: 100%;
      padding: 1.5rem 1.5rem 2.5rem 1.5rem;
      background-color: #474747;
      border-left: 6px solid #ff9a15;
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
    }
  }
}
@media(min-width: 1440px) {
  .outer {
    width: 460px;
    &.active {
      transform: translateX(410px);
    }
    .asideMenu {
      width: 480px;
      .info {
        padding: 1.5rem 3rem 2.5rem 1.5rem;
      }
    }
  }
}
</style>
