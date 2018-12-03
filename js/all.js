//Vue component
Vue.component('countycomponent', {
    props: {
        aqielement: {},
        isstar: {
            type: Boolean,
            defalut: false,
        }
    },
    template: '#countycomponent',
    computed: {
        //參考他人作法
        status() {
            if (this.aqielement.AQI <= 50) {
                return
            } else if (this.aqielement.AQI <= 100) {
                return 'status-aqi2';
            } else if (this.aqielement.AQI <= 150) {
                return 'status-aqi3';
            } else if (this.aqielement.AQI <= 200) {
                return 'status-aqi4';
            } else if (this.aqielement.AQI <= 300) {
                return 'status-aqi5';
            } else {
                return 'status-aqi6';
            }
        },
    },
    methods: {
        addStar: function () {
            console.log('addStar');
            this.$emit('addstarmark', this.item);
        },
        removeStar: function () {
            console.log('removeStar');
            this.$emit('removestarmark', this.item);
        }
    }
})

// API 來源
// https://opendata.epa.gov.tw/Data/Contents/AQI/

var app = new Vue({
    el: '#app',
    data: {
        data: [], //物件陣列
        location: [], //縣市
        stared: [], //關注
        filter: '高雄市', //過濾縣市
    },
    // 請在此撰寫 JavaScript
    methods: {
        getData() {
            const vm = this;
            //使用JavaScript下載資料
            const xhr = new XMLHttpRequest();
            //放在github需透過第三方解譯才能夠拉資料
            const corsUrl = 'https://cors-anywhere.herokuapp.com/';
            const api = 'http://opendata2.epa.gov.tw/AQI.json';
            xhr.open('get', corsUrl+api);
            xhr.send(null);
            xhr.onload = function () {
                let jsonCounty = [];
                //獲取全部城市
                vm.data = JSON.parse(xhr.responseText);
                for (let i = 0; i < vm.data.length; i++) {
                    jsonCounty.push(vm.data[i].County);
                };
                //過濾相同城市資料
                jsonCounty.forEach(function (item) {
                    if (vm.location.indexOf(item) == -1) {
                        vm.location.push(item);
                    }
                });
                // console.log(vm.location);
                //獲取上一次關注的資料
                const newStared = JSON.parse(localStorage.getItem('stared')) || [];
                vm.data.forEach(function (item) {
                    newStared.forEach(function (item2) {
                        if (item.SiteName == item2.SiteName) {
                            vm.stared.push(item);
                        }
                    })
                })
            };
        },
        addStar: function (Staritem) {
            let vm = this;
            console.log(vm.stared);
            let data = vm.stared.find(function (item, index, array) {
                return item['SiteName'] == Staritem['SiteName'];
            });
            if (data == undefined) {
                vm.stared.push(Staritem);
                localStorage.setItem("stared", JSON.stringify(vm.stared));
            } else {
                return
            }
            console.log(this.stared);
        },
        removeStar: function (Staritem) {
            let vm = this;
            console.log(Staritem)
            vm.stared.forEach(function (data, key) {
                if (data == Staritem) {
                    console.log('執行刪除程序');
                    JSON.parse(localStorage.getItem('stared', data));
                    localStorage.removeItem('stared', data);
                    return vm.stared.splice(key, 1);
                }
            })
        }
    },
    //生命週期，指定甚麼時候再執行function()
    created() {
        this.getData();
    }
});