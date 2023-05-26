<template>
  <div class="errPage-container">
    <el-button icon="el-icon-arrow-left" class="pan-back-btn" @click="back"> return </el-button>
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">Oops!</h1>
        gif origin<a href="https://zh.airbnb.com/" target="_blank">airbnb</a> page
        <h2>You have no permission to go to this page</h2>
        <h6>If you have any questions, please contact the webmaster</h6>
        <ul class="list-unstyled">
          <li>Or you can go:</li>
          <li class="link-type">
            <router-link to="/">Back To Home</router-link>
          </li>

          <li><a href="javascript:;" @click.prevent="showImg">Click me to see the picture</a></li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream." />
      </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" title="Just look">
      <img :src="ewizardClap" class="pan-img" />
    </el-dialog>
  </div>
</template>

<script setup>
import img_err from '@/assets/imgs/401.gif'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const errGif = ref( img_err + '?' + new Date() )
const ewizardClap = ref( 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646' )
const dialogVisible = ref( false )

function showImg() {
  dialogVisible.value = true
}

function back() {
  if ( route.query.noGoBack ) {
    router.push( '/' )
  } else {
    router.go( -1 )
  }
}
</script>

<style lang="scss" scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;
  .pan-back-btn {
    background: #008489;
    color: #fff;
    border: none !important;
  }
  .pan-gif {
    margin: 0 auto;
    display: block;
  }
  .pan-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
  .list-unstyled {
    font-size: 14px;
    li {
      padding-bottom: 5px;
    }
    a {
      color: #008489;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
