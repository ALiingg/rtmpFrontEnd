<script>
import { onMounted, ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import StreamComponents from '@/components/StreamComponents.vue'
import Cookies from 'js-cookie';
import axios from 'axios'
import { useStore } from 'vuex';
import index from '@/components/HomeComponents.vue'
import { ElMessage } from 'element-plus'
import { mapMutations } from 'vuex'
export default {
  methods:{
    ...mapMutations(['checkLogin']),
    //   async onMounted(){
    //     this.checkLogin()
    // }
    // pageRoute(){
    //   this.$router.push({path:'/replays'})
    // }
  },
  components: {},
  setup(props, { emit }) {
    const store = useStore();
    onMounted(async () => {
      await checkLogin()
    });
    const activeIndex = ref('1');
    const checkLogin = () => {
      console.log('accessed')
      if (Cookies.get('token') !== undefined){
        const token = Cookies.get('token');
        console.log(token);
        axios({
          method: 'post',
          url: useStore().state.baseUrl + '/user/tokenlogin',
          headers: {"Content-Type": "text/plain"},
          data: token

        }).then(res => {
          console.log(res.data);
          if (res.data.code == 0) {
            successLogin()
            ElMessage({
              message: 'Auto Loggaed In',
              type: 'success',
            })
          }
        })
      }

    }
    const successLogin = () => {
      store.commit('setStateValue', { key: 'isLogin', value: true });
      store.commit('setStateValue', { key: 'showLoginDialog', value: false });
      store.commit('setStateValue', { key: 'loginLoading', value: false });
    }
    // const router = createRouter({ history: createWebHistory(), routes })


    return{
      activeIndex,
      index,
      // checkLogin
      // routes


    }
  },


}

</script>

<template>
  <el-menu
    :default-active="1"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <router-link to="/">
    <el-menu-item index="1">

      Streaming
    </el-menu-item>
    </router-link>
    <router-link to="/replays">

    <el-menu-item index="2">
      Replays
    </el-menu-item>
    </router-link>

  </el-menu>
</template>

<style scoped>

</style>