import Vue from 'vue'
import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:8081/',
  json: true
})

export default {
  async execute (method, resource, data) {
    // inject the accessToken for each request
    return client({
      method,
      url: resource,
      data,
    }).then(req => {
      if(req.data.length > 0){
        req.data = req.data.map((d) =>{
          let b64 = 'data:image/png;base64,' + d.image
          d.image = b64
          return d
        })
      }
      return req.data
    })
  },
  getShares () {
    return this.execute('get', '/tests')
  },
  getShare (id) {
    return this.execute('get', `/tests/${id}`)
  },
  createShare (data) {
    return this.execute('post', '/tests', data)
  },
  updateShare (id, data) {
    return this.execute('put', `/tests/${id}`, data)
  },
  deleteShare (id) {
    return this.execute('delete', `/tests/${id}`)
  }
}
