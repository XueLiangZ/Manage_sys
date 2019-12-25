import axios from "./interceptor";

let API = {
  //  页面 登录
  login(params) {
    return axios.post("/login", params);
  },

  //获取左侧菜单数据;
  getMenuList() {
    return axios.get("/menus");
  },

  //获取用户列表;
  userlist(params) {
    return axios.get("/users", { params });
  },

  //更新用户状态

  userstate({ uId, type }) {
    return axios.put(`users/${uId}/state/${type}`);
  },

  // 添加用户
  adduser(params) {
    return axios.post("/users", params);
  },

  //编辑用户
  edituser({ id, email, mobile }) {
    return axios.put(`/users/${id}`, { email, mobile });
  },

  //删除用户
  deleteuser (id) {
    return axios.delete(`/users/${id}`);
  }
};

export default API;
