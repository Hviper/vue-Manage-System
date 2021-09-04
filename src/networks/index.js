import axios from 'axios'

export default function(options){
    return new Promise((resolve,reject)=>{
        const instance = axios.create({
            baseURL:"http://127.0.0.1:8888/api/private/v1/"
        });
        instance.interceptors.request.use(config => {
            
         
            // 为请求头对象，添加token验证的Authorization字段
            config.headers.Authorization = window.sessionStorage.getItem('token')
            // 在最后必须 return config
            return config
          })

        instance(options).then(res => {
            resolve(res);
        },error=>{
            reject(error);
        })  
    })
    
}