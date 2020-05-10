import axios from "axios";

// 请求拦截器
axios.interceptors.request.use(config => {
  config.baseURL = "http://127.0.0.1:8888/api/private/v1";
  config.headers.Authorization = sessionStorage.getItem("token");
  return config;
});

export default {
  //页面登录
  login(option) {
    return axios({
      url: "/login",
      method: "POST",
      data: {
        ...option
      }
    });
  },

  //获取左侧菜单数据;
  getMenuList() {
    return axios({
      url: "/menus",
      method: "GET"
    });
  },

  //获取用户列表;
  userlist(option) {
    return axios({
      url: "/users",
      method: "GET",
      params: {
        ...option
      }
    });
  },

  //获取用户列表;
  userstate({ uId, type }) {
    return axios({
      url: `/users/${uId}/state/${type}`,
      method: "PUT"
    });
  },

  // 添加用户
  adduser(option) {
    return axios({
      url: "/users",
      method: "POST",
      data: {
        ...option
      }
    });
  },

  //编辑用户
  edituser({ id, email, mobile }) {
    return axios({
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
    return axios({
      url: `/users/${uId}`,
      method: "DELETE"
    });
  },

  /**
   * 分配用户角色
   */
  saveRole(id, rid) {
    return axios({
      url: `/users/${id}/role`,
      method: "PUT",
      data: {
        id,
        rid
      }
    });
  },

  //获取所有权限列表 type = list / tree
  rightsList(type) {
    // return axios.get(`/rights/${type}`);
    return axios({
      url: `/rights/${type}`,
      method: "GET"
    });
  },

  //获取角色列表
  rolesList() {
    return axios({
      url: "/roles",
      method: "GET"
    });
  },

  //添加角色
  addRoles({ roleName, roleDesc }) {
    console.log(roleName, roleDesc);
    return axios({
      url: "/roles",
      method: "POST",
      data: {
        roleName,
        roleDesc
      }
    });
  },

  //编辑角色
  editRoles({ id, roleName, roleDesc }) {
    return axios({
      url: `/roles/${id}`,
      method: "PUT",
      data: {
        roleName,
        roleDesc
      }
    });
  },

  //删除角色
  deleRoles(id) {
    return axios({
      url: `/roles/${id}`,
      method: "DELETE"
    });
  },

  //特定权限移除
  removeRights(roleId, id) {
    return axios({
      url: `/roles/${roleId}/rights/${id}`,
      method: "DELETE"
    });
  },

  //角色授权
  setRoleRights(roleId, rids) {
    return axios({
      url: `/roles/${roleId}/rights`,
      method: "POST",
      data: {
        rids
      }
    });
  },

  //获取商品分类列表
  getCateList({ type = null, pagenum = null, pagesize = null }) {
    return axios({
      url: "/categories",
      method: "GET",
      params: {
        type,
        pagenum,
        pagesize
      }
    });
  },
  //获取所有商品分类

  getAllCateList() {
    return axios({
      url: "/categories",
      method: "GET",
    });
  },

  //  添加商品分类
  addCategory({ cat_pid, cat_name, cat_level }) {
    return axios({
      url: "/categories",
      method: "POST",
      data: {
        cat_pid,
        cat_name,
        cat_level
      }
    });
  },

  //获取所有商品列表数据
  getGoodsList({ query, pagenum, pagesize }) {
    return axios({
      url: "/goods",
      method: "GET",
      params: {
        query,
        pagenum,
        pagesize
      }
    });
  }
};
