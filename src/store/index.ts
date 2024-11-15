// store/index.js
import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      isLogin: false, // 用于保存登录状态
      targetPath: '/', // 用于保存用户登录后要重定向的路径
    };
  },
  mutations: {
    setLogin(state, status) {
      state.isLogin = status;
    },
    setTargetPath(state, path) {
      state.targetPath = path;
    },
  },
});

export default store;
