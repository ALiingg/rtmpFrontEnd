<script lang="ts">
import { ElMessage } from 'element-plus'
import axios from 'axios'
import Cookies from 'js-cookie'
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  computed: {},
  components: {},
  setup() {
    const loginForm = reactive({ name: '', password: '', email: '' })
    const registerForm = reactive({
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      code: '',
      passcode: ''
    })
    const loginLoading = ref(false)
    const activeTab = ref('login')
    const flvPlayers = ref([])
    const store = useStore()
    const router = useRouter()
    const showLoginDialog = ref(false)
    const baseUrl = useStore().state.baseUrl
    const isLogin = ref(false)
    const loginMethod = ref('Username')
    const sendOTPLoading = ref(false)
    const inputColor = ref('black')
    const isCountingDown = ref(false)
    const countdown = ref(60)
    const handelSendCode = () => {
      if (registerForm.email == null || !registerForm.email.includes('@')) {
        ElMessage({
          message: 'Invalid Email',
          type: 'error'
        })
        return null
      } else if (isCountingDown.value) {
        return
      }
      sendOTPLoading.value = true
      axios({
        url: baseUrl + '/user/sendVerificationCode',
        method: 'post',
        params: {
          email: registerForm.email
        }
      }).then((res) => {
        console.log(res.data)
        if (res.data.code == '0') {
          ElMessage({
            message: 'Sent OTP',
            type: 'success'
          })
          startCountdown()

          sendOTPLoading.value = false
        } else {
          ElMessage({
            message: 'Invalid Email',
            type: 'error'
          })
        }
      })
    }
    const checkPassword = () => {
      const hasUpperCase = /[A-Z]/.test(registerForm.password)
      const hasLowerCase = /[a-z]/.test(registerForm.password)
      if (
        registerForm.password == null ||
        registerForm.password.length < 8 ||
        !hasLowerCase ||
        !hasUpperCase
      ) {
        inputColor.value = 'red'

        // console.log(regInpt);
      } else if (registerForm.password.length >= 8 && hasUpperCase && hasLowerCase) {
        inputColor.value = 'green'
      }
    }
    const startCountdown = () => {
      if (Cookies.get('countdown') !== 0) {
        isCountingDown.value = true
      } else {
        return
      }
      isCountingDown.value = true
      countdown.value = 60 // 重置倒计时

      // 每秒更新倒计时
      const timer = setInterval(() => {
        Cookies.set('countdown', countdown)
        countdown.value -= 1
        if (countdown.value <= 0) {
          clearInterval(timer) // 清除计时器
          Cookies.set('countdown', 0)

          isCountingDown.value = false // 重新启用按钮
        }
      }, 1000)
    }
    /**
     * Handles the user login operation.
     * @return void
     */
    const handleLogin = () => {
      loginLoading.value = true
      axios({
        method: 'post',
        url: baseUrl + '/user/login?uname=' + loginForm.name + '&password=' + loginForm.password
      })
        .then((res) => {
          Cookies.set('token', res.data.data.token)
          console.log(res.data.data.token)
          store.commit('setLogin', true) // 设置为已登录
          setTimeout(() => {
            ElMessage({
              message: 'Login Success',
              type: 'success'
            })
          }, 100)
          const targetPath = store.state.targetPath || '/'
          router.push(targetPath) // 登录后跳转到目标路径

          setTimeout(() => {
            successLogin()
          }, 100)
        })
        .catch(() => {
          setTimeout(() => {
            ElMessage({
              message: 'Username or Password Incorrect',
              type: 'error'
            })
          }, 2000)
        })
        .finally(() => {
          loginLoading.value = false
        })
    }
    const successLogin = () => {
      loginLoading.value = false
      showLoginDialog.value = false
      isLogin.value = true
      Cookies.set('isLogin', true)
      router.push('/')
    }
    /**
     * Handles the user registration operation.
     * @return void
     */
    const handleRegister = () => {
      if (registerForm.password != registerForm.confirmPassword) {
        ElMessage({
          message: 'Password Does Not Match!',
          type: 'error'
        })
        return
      }
      // Registration logic can be added here
      axios
        .post(`${baseUrl}/user/register`, null, {
          params: {
            password: registerForm.password,
            uname: registerForm.username,
            email: registerForm.email,
            code: registerForm.code,
            passcode: registerForm.passcode
          }
        })
        .then((res) => {
          console.log(res.data)
          if (res.data.code == '0') {
            ElMessage({
              message: 'Register Success',
              type: 'success'
            })
            window.location.reload()
          } else if (res.data.code == '123') {
            ElMessage({
              message: 'Passcode Incorrect',
              type: 'error'
            })
          }
        })
        .catch((error) => {
          console.error('Error during registration:', error)
        })
    }

    return {
      handelSendCode,
      handleRegister,
      handleLogin,
      checkPassword,
      startCountdown,
      successLogin,
      loginForm,
      registerForm,
      activeTab,

      showLoginDialog,
      loginLoading,
      isLogin,
      loginMethod,
      inputColor,
      sendOTPLoading,
      isCountingDown,
      countdown
    }
  }
}
</script>

<template>
  <div class="form-container">
    <!-- Tabs for switching between Login and Register -->
    <el-tabs v-model="activeTab" v-loading="loginLoading" class="auth-tabs">
      <!-- Login tab -->
      <el-tab-pane label="Login" name="login">
        <el-radio-group v-model="loginMethod" class="radio-group" v-on:change="handleChange">
          <el-radio value="Username" size="large">Username</el-radio>
          <el-radio value="Email" size="large">Email</el-radio>
        </el-radio-group>
        <el-form :model="loginForm" label-width="80px" class="form">
          <el-form-item label="Username">
            <el-input v-model="loginForm.name" />
          </el-form-item>
          <el-form-item label="Password">
            <el-input type="password" v-model="loginForm.password" />
          </el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-button">Login</el-button>
        </el-form>
      </el-tab-pane>
      <!-- Register tab -->
      <el-tab-pane label="Register" name="register">
        <el-form :model="registerForm" label-width="80px" class="form">
          <el-form-item label="Email">
            <div style="display: flex; width: 100%">
              <el-input v-model="registerForm.email" style="flex: 4; margin-right: 10px" />
              <el-button
                type="info"
                @click="handelSendCode"
                style="flex: 1"
                :loading="sendOTPLoading"
              >
                {{ isCountingDown ? `${countdown}` : 'Send OTP' }}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item label="Code">
            <el-input v-model="registerForm.code" style="width: 30%" />
          </el-form-item>
          <el-form-item label="Passcode">
            <el-input type="password" v-model="registerForm.passcode" style="width: 30%" />
          </el-form-item>
          <el-form-item label="Username">
            <el-input v-model="registerForm.username" />
          </el-form-item>
          <el-form-item label="Password">
            <el-input
              type="password"
              id="iptregpass"
              v-model="registerForm.password"
              v-on:input="checkPassword"
              show-password="true"
              :style="{ '--el-input-focus-border-color': inputColor }"
            />
            <div style="color: #6b778c">
              Length: 8 <br />
              One UpperCase Letter and One LowerCase Letter
            </div>
          </el-form-item>
          <el-form-item label="Confirm">
            <el-input type="password" v-model="registerForm.confirmPassword" />
          </el-form-item>
          <el-button type="primary" @click="handleRegister" class="register-button"
            >Register</el-button
          >
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5; /* Light background for contrast */
}

.auth-tabs {
  width: 400px; /* Set a fixed width */
  background-color: #ffffff; /* White background */
  padding: 20px; /* Inner padding for spacing */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* Subtle shadow for elevation */
  border-radius: 8px; /* Rounded corners */
}

.radio-group {
  margin-bottom: 20px;
}

.form {
  padding-top: 10px;
}

.login-button,
.register-button {
  width: 100%; /* Full-width buttons */
  margin-top: 10px;
}

.el-form-item {
  margin-bottom: 15px;
}
</style>
