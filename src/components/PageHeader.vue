<script>
import index, { mapMutations, useStore } from 'vuex'
import { onMounted, ref } from 'vue'
import Cookies from 'js-cookie'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
  methods: {
    ...mapMutations(['checkLogin']), // Map Vuex mutation to check login status

    // Uncomment this section if you want to run checkLogin on component mount
    // async onMounted(){
    //   this.checkLogin()
    // }

    // Method to navigate to the replays page
    // pageRoute(){
    //   this.$router.push({path:'/replays'})
    // }
  },
  components: {},

  setup(props, { emit }) {
    const store = useStore(); // Access the Vuex store instance

    // Run on component mount to check if the user is logged in
    onMounted(async () => {
      await checkLogin();
    });

    // Reactive reference for the active menu index
    const activeIndex = ref('1');

    /**
     * Checks if the user is logged in using a token stored in cookies.
     * If the token is valid, performs an automatic login.
     * @return void
     */
    const checkLogin = () => {
      console.log('accessed');
      if (Cookies.get('token') !== undefined) { // Check if token exists in cookies
        const token = Cookies.get('token'); // Retrieve token from cookies
        console.log(token);
        axios({
          method: 'post',
          url: useStore().state.baseUrl + '/user/tokenlogin', // API endpoint for token login
          headers: { "Content-Type": "text/plain" },
          data: token
        }).then(res => {
          console.log(res.data);
          if (res.data.code == 0) { // If login is successful
            successLogin(); // Commit login state changes
            ElMessage({
              message: 'Auto Logged In',
              type: 'success',
            });
          }
        });
      }
    };

    /**
     * Updates Vuex store states to reflect successful login.
     * Hides login dialog, stops loading, and marks user as logged in.
     * @return void
     */
    const successLogin = () => {
      store.commit('setStateValue', { key: 'isLogin', value: true }); // Set login status to true
      store.commit('setStateValue', { key: 'showLoginDialog', value: false }); // Hide login dialog
      store.commit('setStateValue', { key: 'loginLoading', value: false }); // Stop loading animation
    };

    // Return data and methods to be used in the template
    return {
      activeIndex, // Currently active menu item index
      index, // Home component

    };
  },
};
</script>

<template>
  <!-- Horizontal navigation menu using Element Plus -->
  <el-menu
    :default-active="1"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <!-- Menu item for streaming page -->
    <router-link to="/">
      <el-menu-item index="1">
        Streaming
      </el-menu-item>
    </router-link>

    <!-- Menu item for replay list page -->
    <router-link to="/replayList">
      <el-menu-item index="2">
        Replays
      </el-menu-item>
    </router-link>
  </el-menu>
</template>

<style scoped>
/* Scoped styles go here */
</style>
