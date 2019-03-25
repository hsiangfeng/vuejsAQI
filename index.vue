<template>
  <div>
    <nav
      class="navbar navbar-expand-md sticky-top"
      data-aos="fade-down"
      data-aos-duration="500"
      style="background-color: rgba(0, 0, 0, 0.9);"
    >
      <a class="navbar-brand d-md-none" href="#">全台AQI</a>
      <button
        class="navbar-toggler ml-auto text-white"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i class="fas fa-bars"></i>
      </button>
      <div class="d-md-flex d-block w-100">
        <div class="collapse navbar-collapse justify-content-center" id="navbarNavAltMarkup">
          <div class="navbar-nav align-items-center">
            <a
              class="nav-item nav-link active text-white"
              style="font-size: 20px"
              href="https://hsiangfeng.github.io/vuejsAQI/"
            >
              首頁
              <span class="sr-only">(current)</span>
            </a>
            <a class="navbar-brand mx-2 d-none d-md-inline px-4" href="/">全台AQI資訊網</a>
            <a
              class="nav-item nav-link text-white"
              style="font-size: 20px"
              href="https://hsiangfeng.github.io/AJAX-HomeWork/"
            >高雄旅遊</a>
          </div>
        </div>
      </div>
    </nav>
    <div class="container bg-data" id="app">
      <h3 class="text-white mb-3 text-center">選擇城市</h3>
      <select class="form-control mb-3" v-model="filter">
        <option value disabled>--- 請選擇城市 ---</option>
        <option v-bind:value="item" v-for="item in location" :key="item">{{item}}</option>
      </select>
      <h4>關注城市</h4>
      <div class="card-columns">
        <countycomponent
          v-for="item in stared"
          :aqielement="item"
          :key="item.SiteName"
          v-on:removestarmark="removeStar(item)"
          :isstar="true"
        ></countycomponent>
      </div>
      <hr>
      <div class="card-columns">
        <countycomponent
          v-for="item in data"
          :aqielement="item"
          :key="item.SiteName"
          v-on:addstarmark="addStar(item)"
        ></countycomponent>
      </div>
      <h4>數據參考值</h4>
      <a
        href="https://hsiangfeng.github.io/vuejsAQI/img/2018-12-03_11-45-32.png"
        data-lightbox="image-box"
        data-title="空氣品質指標(AQI)與健康影響"
      >
        <img
          src="https://hsiangfeng.github.io/vuejsAQI/img/2018-12-03_11-45-32.png"
          class="img-thumbnail rounded"
          alt
        >
      </a>
      <h4>空氣品質指標(AQI)與活動建議</h4>
      <a
        href="https://hsiangfeng.github.io/vuejsAQI/img/2018-12-03_11-45-41.png"
        data-lightbox="image-box"
        data-title="空氣品質指標(AQI)與活動建議"
      >
        <img
          src="https://hsiangfeng.github.io/vuejsAQI/img/2018-12-03_11-45-41.png"
          class="img-thumbnail rounded"
          alt
        >
      </a>
    </div>
    <footer class="container-fluid text-center footer-color">
      <p class="text-block pt-2">AQI監測</p>
      <p class="text-block mb-0 pb-3">資料來源：OpenData.epa 行政院環境保護署環境資源資料開放平台</p>
    </footer>

    <!-- 元件建立 -->
    <script type="text/x-template" id="countycomponent">
      <div class="card" v-if="aqielement === filter">
          <div class="card-header" v-bind:class="status">{{aqielement.County}} - {{aqielement.SiteName}}
              <a href="#" class="float-right" v-on:click.prevent="addStar" v-if="!isstar"><i class="far fa-star" ></i></a>
              <a href="#" class="float-right" v-on:click.prevent="removeStar" v-if="isstar"><i class="fas fa-star" ></i></a>
          </div>
          <div class="card-body">
              <ul class="list-unstyled">
                  <li>AQI 指數: {{aqielement.AQI}}</li>
                  <li>PM2.5: {{aqielement['PM2.5']}}</li>
                  <li>狀況: {{aqielement.Status}}</li>
              </ul>
          </div>
          <div class="card-footer">
                  <small class="text-muted">{{aqielement.PublishTime}}</small>
          </div>
      </div>
  </div>
    </script>
  </div>
</template>
<script>
Vue.component("countycomponent", {
  props: {
    aqielement: {},
    isstar: {
      type: Boolean,
      defalut: false
    }
  },
  template: "#countycomponent",
  computed: {
    /* 參考他人作法 */
    status: function() {
      if (this.aqielement.AQI <= 50) {
        return "status-aqi1";
      } else if (this.aqielement.AQI <= 100) {
        return "status-aqi2";
      } else if (this.aqielement.AQI <= 150) {
        return "status-aqi3";
      } else if (this.aqielement.AQI <= 200) {
        return "status-aqi4";
      } else if (this.aqielement.AQI <= 300) {
        return "status-aqi5";
      } else {
        return "status-aqi6";
      }
    }
  },
  methods: {
    addStar: function() {
      console.log("addStar");
      this.$emit("addstarmark", this.item);
    },
    removeStar: function() {
      console.log("removeStar");
      this.$emit("removestarmark", this.item);
    }
  }
});
export default {
  // Vue component
  // API 來源
  // https://opendata.epa.gov.tw/Data/Contents/AQI/
  data() {
    return {
      data: [], // 物件陣列
      location: [], // 縣市
      stared: [], // 關注
      filter: "高雄市" // 過濾縣市
    }
  },
  // 請在此撰寫 JavaScript
  methods: {
    getData: function() {
      const vm = this;
      // 使用JavaScript下載資料
      const xhr = new window.XMLHttpRequest();
      // 放在github需透過第三方解譯才能夠拉資料
      const corsUrl = "https://cors-anywhere.herokuapp.com/";
      const api = "http://opendata2.epa.gov.tw/AQI.json";
      xhr.open("get", corsUrl + api);
      xhr.send(null);
      xhr.onload = function() {
        let jsonCounty = [];
        // 獲取全部城市
        vm.data = JSON.parse(xhr.responseText);
        for (let i = 0; i < vm.data.length; i++) {
          jsonCounty.push(vm.data[i].County);
        }
        // 過濾相同城市資料
        jsonCounty.forEach(function(item) {
          if (vm.location.indexOf(item) === -1) {
            vm.location.push(item);
          }
        });
        // console.log(vm.location);
        // 獲取上一次關注的資料
        const newStared =
          JSON.parse(window.localStorage.getItem("stared")) || [];
        vm.data.forEach(function(item) {
          newStared.forEach(function(item2) {
            if (item.SiteName === item2.SiteName) {
              vm.stared.push(item);
            }
          });
        });
      };
    },
    addStar: function(Staritem) {
      let vm = this;
      console.log(vm.stared);
      let data = vm.stared.find(function(item, index, array) {
        return item["SiteName"] === Staritem["SiteName"];
      });
      if (data === undefined) {
        vm.stared.push(Staritem);
        window.localStorage.setItem("stared", JSON.stringify(vm.stared));
      } else {
        return;
      }
      console.log(this.stared);
    },
    removeStar: function(Staritem) {
      let vm = this;
      console.log(Staritem);
      vm.stared.forEach(function(data, key) {
        if (data === Staritem) {
          console.log("執行刪除程序");
          JSON.parse(window.localStorage.getItem("stared", data));
          window.localStorage.removeItem("stared", data);
          return vm.stared.splice(key, 1);
        }
      });
    }
  },
  // 生命週期，指定甚麼時候再執行function()
  created() {
    this.getData();
  }
};
</script>