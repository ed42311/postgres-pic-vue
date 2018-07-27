<template>
  <div>
  <h1 class="h1">Picture Test</h1>
    <b-alert :show="loading" variant="info">Loading...</b-alert>
    <b-row>
      <b-col>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Picture</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="share in shares" :key="share.id">
              <td><img id="img" :src="(share.image ? share.image : 'pic not there')" height="20">
              </td>
              <td class="text-right">
                <a href="#" @click.prevent="deleteShare(share.id)">Delete</a>
              </td>
            </tr>
          </tbody>
        </table>
        <img id="img" :src="itemPreviewImage" height="150"/>
      </b-col>
      <b-col lg="3">
        <b-card :title="(model.id ? 'Edit Share ID#' + model.id : 'New Share')">
          <form @submit.prevent="saveShare">
            <b-form-group label="Bike Picture">
              <b-form-file
                id="avatar" name="avatar"
                @change ="uploadFile"
                v-model="model.pic"
                placeholder="Choose a file..."
                accept="image/png, image/jpeg">
              </b-form-file>
            </b-form-group>
            <div>
              <b-btn type="submit" variant="success">Save Picture</b-btn>
            </div>
          </form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import api from '@/api'
export default {
  data () {
    return {
      loading: false,
      shares: [],
      selected: null,
      selectedFile: null,
      model: {},
      itemPreviewImage: null
    }
  },
  async created () {
    this.refreshShares()
  },
  computed: {
    imgURL () {
      return this.item.image
        ? 'data:image/png;charset=utf-8;base64,' + this.item.image
        : '' // some default image

    }
  },
  methods: {
    async refreshShares () {
      this.loading = true
      this.shares = await api.getShares()
      this.loading = false
    },
    async saveShare () {
      if (this.model.id) {
        await api.updateShare(this.model.id, this.model)
      } else {
        await api.createShare(this.model)
      }
      this.model = {} // reset form
      await this.refreshShares()
    },
    async deleteShare (id) {
      if (confirm('Are you sure you want to delete this post?')) {
        if (this.model.id === id) {
          this.model = {}
        }
        await api.deleteShare(id)
        await this.refreshShares()
      }
    },
    uploadFile () {
      const files = event.target.files || event.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    createImage(file) {
      const image = new Image();
      const reader = new FileReader();

      reader.onload = evt => {
        this.itemPreviewImage = evt.target.result
        let b64str = evt.target.result.substr(evt.target.result.indexOf(',')+1, evt.target.result.length)
        this.model.image = b64str
      }
      reader.readAsDataURL(file);
    },
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
