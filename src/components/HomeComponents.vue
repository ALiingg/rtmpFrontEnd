<template>
  <el-row :gutter="20" class="main-container">
    <!-- 左边实时语音 -->
    <el-col :span="6" class="real-time-voice-container">
      <div class="real-time-voice">
        <div class="login-container" v-show="!isLogin">
          <el-button type="warning" @click="showLoginDialog = true">Login</el-button>
          <el-drawer
            v-model="showLoginDialog"
            title="User Authentication"
            size="40%"
            direction="ltr"
            :before-close="handleClose"

          >
            <el-tabs v-model="activeTab" v-loading="loginLoading">
              <el-tab-pane label="Login" name="login">
                <el-form :model="loginForm" label-width="80px">
                  <el-form-item label="Username">
                    <el-input v-model="loginForm.name" />
                  </el-form-item>
                  <el-form-item label="Password">
                    <el-input type="password" v-model="loginForm.password" />
                  </el-form-item>
                  <el-button type="primary" @click="handleLogin">Login</el-button>
                </el-form>
              </el-tab-pane>

              <el-tab-pane label="Register" name="register">
                <el-form :model="registerForm" label-width="80px">
                  <el-form-item label="Username">
                    <el-input v-model="registerForm.username" />
                  </el-form-item>
                  <el-form-item label="Password">
                    <el-input type="password" v-model="registerForm.password" />
                  </el-form-item>
                  <el-form-item label="Confirm">
                    <el-input type="password" v-model="registerForm.confirmPassword" />
                  </el-form-item>
                  <el-button type="primary" @click="handleRegister">Register</el-button>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-drawer>
        </div>

        <div class="room-box" v-show="isLogin">
          <h3 class="room-title">Voice Channel</h3>
          <ul class="user-list">
            <li v-for="user in rooms[0].users" :key="user" :class="{ 'self-user': user === currentUser }">
              <span :style="{ 'margin-left': user === currentUser ? '0' : '20px' }">{{ user }}</span>
            </li>
          </ul>
          <div class="actions">
            <button class="join-button" @click="joinRoom('room1')">Join</button>
          </div>
          <div class="control-icons">
            <el-icon>
              <microphone v-show="!muted" @click="muteChange"/>

              <mute  v-show="muted" @click="muteChange"/>
            </el-icon>
            <el-icon>
              <headset/>

            </el-icon>
            <el-tooltip
              content="<span>HangUp</span>"
              raw-content
            ><el-icon><Phone @click="leaveChannel('room1')"/></el-icon>
            </el-tooltip>
          </div>
        </div>
      </div>
    </el-col>

    <!-- 右边直播框 -->
    <el-col :span="18" class="live-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="live-box">
            <video id="videoElement1" controls style="width:100%;height:100%;" autoplay/>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="live-box">
            <video id="videoElement2" controls style="width:100%;height:100%;" autoplay/>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <div class="live-box">
            <video id="videoElement3" controls style="width:100%;height:100%;" autoplay/>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="live-box">
            <video id="videoElement4" controls style="width:100%;height:100%;" autoplay muted/>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<style scoped src="@/components/css/HomeComponents.css">


</style>

<script>
import flvjs from 'flv.js';
import mpegtsjs from 'mpegts.js';
import Cookies from 'js-cookie';
import { onMounted, reactive, ref } from 'vue'
import { Headset, Microphone, Mute } from '@element-plus/icons-vue'
import axios  from 'axios'
import { mapState, mapMutations, useStore } from 'vuex'
import { ElMessage } from 'element-plus'
export default {
  computed: {
    ...mapState(['isLogin'])
  },
  methods: {
    ...mapMutations(['setLogin']),
    muteChange() {
      this.muted = !this.muted;
      console.log(this.muted);
    },
    leaveChannel(roomId) {
      // 找到当前的房间
      const room = this.rooms.find(room => room.id === roomId);

      if (room) {
        // 移除当前用户
        room.users = room.users.filter(user => user !== this.currentUser);

        // 如果需要执行离开房间后的操作，可以在这里添加
        console.log(`${this.currentUser} 离开了房间 ${room.name}`);
      }
    },
    joinRoom(roomId) {
      this.rooms.forEach(room => {
        if (room.id === roomId && !room.users.includes(this.currentUser)) {
          room.users.push(this.currentUser);
        }
      });
    }
  },
  components: { Mute, Headset, Microphone },
  setup() {
    const loginForm = reactive({
      name: '',
      password: ''

    })
    const registerForm = reactive({
      username: '',
      password: '',
      confirmPassword:''
    })
    const loginLoading = ref(useStore().state.loginLoading);
    const activeTab = ref('login');
    const flvPlayers = ref([]);
    const showLoginDialog = ref(useStore().state.showLoginDialog);
    const baseUrl = useStore().state.baseUrl
    // const isLogin = ref(false);
    let urls = new Array(4);
    const getUrl = () => {
      axios.get( baseUrl + "/live").then((response) => {
        console.log(response.data);
        urls = response.data;
        flvPlayers.value.push(createVideo('videoElement1', urls[0]));
        flvPlayers.value.push(createVideo('videoElement2', urls[1]));
        flvPlayers.value.push(createVideo('videoElement3', urls[2]));
        flvPlayers.value.push(createVideo('videoElement4', urls[3]));
        console.log(urls[0]);
      })

    }


    const handleLogin = () => {
      loginLoading.value = true;
      axios({
        method: 'post',
        url: baseUrl + '/user/login?uname=' + loginForm.name + "&password=" + loginForm.password,

      }).then(res => {
        console.log(res.data);
        Cookies.set('token', res.data.data.token, { expires: 1, path: '' })
        setTimeout(function() {
          ElMessage({
            message: 'Login Success',
            type: 'success',
          })
          loginLoading.value = false;
        }, 1000)
        setTimeout(function() {
          successLogin();
        }, 2000)

      }).catch(error => {
        setTimeout(function() {
          ElMessage({
            message: "Username or Password Incorrect",
            type: 'error'
          })
          loginLoading.value = false;
        },2000)



      })

      // Cookies.set('test','123', {expires: 3, path:''});
    }
    const handleRegister = () => {

    }

    const createVideo = (videoId, streamUrl) => {
      const videoElement = document.getElementById(videoId);
      if (mpegtsjs.isSupported()) {
        try {
          const flvPlayer = mpegtsjs.createPlayer({
            type: 'flv',
            url: streamUrl,
            isLive: true,
            hasAudio: true,
          });
          flvPlayer.attachMediaElement(videoElement);
          flvPlayer.load();
          flvPlayer.play();
          return flvPlayer;
        } catch (error) {
          console.error(`Error creating FLV player: ${error}`);
        }
      } else {
        console.warn('FLV.js not supported on this browser.');
      }
    };

    onMounted(async () => {
      await getUrl();
      // await checkLogin();
    });

    const handleClose = () => {
      showLoginDialog.value = false;
    }
    return {
      loginForm,
      registerForm,
      handleLogin,
      handleRegister,
      activeTab,
      handleClose,
      showLoginDialog,
      loginLoading,
    };
  },
  data() {
    return {

      muted: false,
      currentUser: 'You',
      rooms: [
        {
          id: 'room1',
          name: 'Voice Channel',
          users: ['Test User 1', 'Test User 2'],
        }
      ]
    };
  },


};
</script>
