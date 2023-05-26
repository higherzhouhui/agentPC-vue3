
export const getEnv = (envConf) => {
  const ret = {
    VITE_PORT: 9527,
    VITE_PUBLIC_PATH: '',
    VITE_PROXY_DOMAIN: '',
    // VITE_PROXY_DOMAIN_REAL: 'http://34.150.29.102:8086/',
    VITE_PROXY_DOMAIN_REAL: 'http://34.150.29.102:8086/',
    // VITE_PROXY_DOMAIN: 'http://34.150.29.102:8086/',
    // VITE_PROXY_DOMAIN_REAL: 'http://34.150.29.102:8086/',
    VITE_ROUTER_HISTORY: '',
    VITE_LEGACY: false
  }

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    realName =
      realName === 'true' ? true : realName === 'false' ? false : realName

    if (envName === 'VITE_PORT') {
      realName = Number(realName)
    }
    ret[envName] = realName
    if (typeof realName === 'string') {
      process.env[envName] = realName
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName)
    }
  }
  return ret
}
export const apiUrl = 'http://34.150.29.102:8086';

export const regExps = (value, reg) => {
  return value.replace(new RegExp(`^${reg}`, 'g'), '')
}
