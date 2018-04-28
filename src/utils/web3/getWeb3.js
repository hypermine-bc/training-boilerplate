import store from '../../store'
import Web3 from 'web3'

export const WEB3_INITIALIZED = 'WEB3_INITIALIZED'
const WEB_SOCKET_ADDR = "ws://172.17.2.166:8546";

function web3Initialized(results) {
  return {
    type: WEB3_INITIALIZED,
    payload: results
  }
}

let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function(dispatch) {
    var results
    var web3 = window.web3

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (web3) {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)
      const web3Ws = new Web3(WEB_SOCKET_ADDR);

      results = {
        web3Instance: web3,
        web3WsInstance: web3Ws
      }

      resolve(store.dispatch('WEB3_INITIALIZED',results).then(res => { // 拉取用户信息
          console.log('Injected web3 detected.');
        }).catch(() => {
          console.log('Web3 present in windows but error in dispatcing to STORE.')
        }))
    } else {

      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      var provider = new Web3.providers.HttpProvider('http://172.17.2.166:8545')

      web3 = new Web3(provider)

      results = {
        web3Instance: web3
      }

      console.log('No web3 instance injected, using Local web3.');

      resolve(store.dispatch('WEB3_INITIALIZED',results).then(res => { // 拉取用户信息
          console.log('Injected web3 detected.');
        }).catch(() => {
          console.log('Web3 present in windows but error in dispatcing to STORE.')
        }))
    }
  })
})

export default getWeb3
