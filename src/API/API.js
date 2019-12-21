import axios from './interceptor'



let API = {

  //  页面 登录
  login (params) {
    return axios.post('/login', params )
    }


}

export default API