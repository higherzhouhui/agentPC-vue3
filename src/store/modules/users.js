import { defineStore } from 'pinia'
import cookies from '@/utils/cookies'
import { TOKEN, AVATAR } from '@/config/constant'
import { getInfo, login } from '@/api/user'
import router, { resetRouter } from '@/router'
import useTagsViewStore from './tagsView'
import { ElMessage } from 'element-plus';
import { agentTypeDic, RoleTypeDictory } from '@/utils/index';
import { translateTitle } from '@/locale'
const useUserStore = defineStore({
  id: 'users',
  state: () => {
    return {
      token: cookies.get(TOKEN),
      userInfo: cookies.get(TOKEN) ? JSON.parse(sessionStorage.getItem('userInfo')) : {},
      uid: '',
      avatar: AVATAR,
      name: '',
      phone: '',
      email: '',
      identity: '',
      roles: [],
      account: '',
      permissions: [],
      createTime: '',
      rolesType: '',
      validTime: '',
      qq: '',
      availableBalance: '',
      agentLevel: '',
      agentType: '',
      haveMoneyPwd: '',
    }
  },
  actions: {
    SET_TOKEN(token = '') {
      token ? cookies.set(TOKEN, token) : cookies.remove(TOKEN)
      this.token = token
    },
    SET_ROLE_INFO() {
      // userInfo
      this.roles = this.userInfo.roles || ['total']
      this.permissions = this.userInfo.permissions
      return this.roles
    },
    async LOGIN(params) {
      const cres = await login(params)
      // 根据登录账号类型做权限管理agentType代理类别:1-普通代理,2-扶持代理,3-无条件扶持代理,4-团队代理
      //agentLevel 1总代 2一级代理 3二级代理 3三级代理
      let { accountType, agentType, agentLevel } = cres;
      let roles = RoleTypeDictory.Direct;
      if (accountType && accountType === 1) {
        roles = [RoleTypeDictory.Total, RoleTypeDictory.SuperAdmin];
      } else {
        if (agentType === 4) {
          if (agentLevel === 1) {
            // 总代
            roles = [RoleTypeDictory.Total];
          } else {
            //直属代理
            roles = [RoleTypeDictory.Direct];
          }
        } else {
          // 普通代理
          roles = [RoleTypeDictory.Normal];
        }
      }
      let res = { ...cres, roles: roles };
      if (cres !== null) {
        console.log('accountType:' + accountType);
        console.log('agentLevel:' + agentLevel);
        console.log('agentType:' + agentType);
        const { code, msg } = res;
        // 由于成功和失败返回的数据结构不同需要特殊处理
        if (!code) {
          ElMessage.success(`${translateTitle('CUST.translate338')}！`);
          sessionStorage.setItem('userInfo', JSON.stringify(res))
          this.userInfo = res;
          this.SET_TOKEN(res.token)
          router.push('/')
        } else {
          ElMessage.error(msg)
          return 'codeError'
        }
      } else {
        ElMessage.error(translateTitle('CUST.translate339'))
      }
    },
    async GET_USER_INFO() {
      try {
        const { code, data } = await getInfo()
        if (code == 200) {
          const { agentId, agentName, agentAccount, phone, agentType, validTime,
            createTime, qq, availableBalance, agentLevel, email, haveMoneyPwd } = data;
          this.qq = qq;
          this.account = agentAccount;
          this.uid = agentId || '9527';
          this.name = agentName || '';
          this.phone = phone || '';
          this.createTime = createTime;
          this.validTime = validTime;
          this.rolesType = agentTypeDic[agentType];
          this.agentType = agentType;
          this.availableBalance = availableBalance;
          this.agentLevel = agentLevel;
          this.email = email;
          this.haveMoneyPwd = haveMoneyPwd;
        }
      } catch (error) {
        return error
      }
    },
    async LOGIN_OUT() {
      try {
        this.RESET_INFO()
        // const data = await logout()
        // if (data.code == 200) {
        this.token = ''
        this.name = ''
        this.avatar = ''
        this.phone = ''
        this.email = ''
        this.identity = ''
        this.roles = []
        // }
      } catch (error) {
        return error
      }
    },
    // 清空所有登录信息
    RESET_INFO() {
      return new Promise(resolve => {
        const tagsViewStore = useTagsViewStore()
        const acceptLang = cookies.get('acceptLang')
        const lang = cookies.get('lang')
        cookies.clearAll()
        // 保留语言设置
        cookies.set('lang', lang)
        cookies.set('acceptLang', acceptLang)
        sessionStorage.clear()
        resetRouter()
        tagsViewStore.DEL_ALL_VIEWS(null)
        resolve()
      })
    }
  }
})
export default useUserStore
