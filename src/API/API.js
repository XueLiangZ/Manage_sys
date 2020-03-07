import axios from "axios";

let Request = axios.create({
  baseURL: "http://127.0.0.1:8888/api/private/v1",
  headers: {
    Authorization: window.sessionStorage.getItem("token")
  }
});

export default {
  //页面登录
  login(option) {
    return Request({
      url: "/login",
      method: "POST",
      data: {
        ...option
      }
    });
  },

  //获取左侧菜单数据;
  getMenuList() {
    return Request({
      url: "/menus",
      method: "GET"
    });
  },

  //获取用户列表;
  userlist(option) {
    return Request({
      url: "/users",
      method: "GET",
      params: {
        ...option
      }
    });
  },

  //获取用户列表;
  userstate({ uId, type }) {
    return Request({
      url: `/users/${uId}/state/${type}`,
      method: "PUT"
    });
  },

  // 添加用户
  adduser(option) {
    return Request({
      url: "/users",
      method: "POST",
      data: {
        ...option
      }
    });
  },

  //编辑用户
  edituser ({ id, email, mobile }) {
    return Request({
      url: `/users/${id}`,
      method: "PUT",
      data: {
        email,
        mobile
      }
    });
  },

  //删除用户
  deleteuser(uId) {
    return Request({
      url: `/users/${uId}`,
      method: "DELETE"
    });
  },

  //获取用户权限
  rightslist(type) {
    // return axios.get(`/rights/${type}`);
    return Request({
      url: `/rights/${type}`,
      method: "GET"
    });
  }
};

// let API = {
//   //  页面 登录
//   login(params) {
//     return axios.post("/login", params);
//   },

//   //获取左侧菜单数据;
//   getMenuList() {
//     return axios.get("/menus");
//   },

//   //获取用户列表;
//   userlist(params) {
//     return axios.get("/users", { params });
//   },

//   //更新用户状态

//   userstate({ uId, type }) {
//     return axios.put(`users/${uId}/state/${type}`);
//   },

//   // 添加用户
//   adduser(params) {
//     return axios.post("/users", params);
//   },

//   //编辑用户
//   edituser({ id, email, mobile }) {
//     return axios.put(`/users/${id}`, { email, mobile });
//   },

//   //删除用户
//   deleteuser(id) {
//     return axios.delete(`/users/${id}`);
//   },

//   //获取权限列表
//   rightslist(type) {
//     return axios.get(`/rights/${type}`);
//   }
// };

// export default API;
