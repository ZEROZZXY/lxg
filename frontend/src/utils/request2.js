/* 做数据请求封装 */
import axios from 'axios'
// 1. axios默认配置
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 2. 开始封装

const request = ({
  // axios选项
  url,
  method = 'GET',
  headers,
  params,
  data,
  withCredentials = false
}) => {
  return new Promise((resolve, reject) => {
    /* 1. 数据请求处理 */
    switch (method) {
      case 'POST':
        axios({
          url,
          method,
          data,
          params,
          headers,
          withCredentials
        }).then(res => resolve(res))
          .catch(err => reject(err))
        break;

      default:
        /* get put  delete */
        axios({
          url,
          method,
          headers,
          params,
          withCredentials
        }).then(res => resolve(res))
          .catch(err => reject(err))
        break;
    }
  })
}


export default request 