import * as types from './mutation-types'
import firebase from 'firebase'

export const login = ({ commit }, user) => new Promise((resolve, reject) => {
  firebase.auth().signInWithEmailAndPassword(user.email, user.password).then((response) => {
    commit(types.LOGIN, response.user)
    resolve(response)
  }).catch((error) => {
    reject(error)
  })
})

export const logout = ({ commit }) => new Promise((resolve, reject) => {
  firebase.auth().signOut().then((response) => {
    commit(types.CLEAR)
    resolve(response)
  }).catch((error) => {
    reject(error)
  })
})

export const setUserData = ({ commit }, user) => new Promise((resolve, reject) => {
  try {
    commit(types.LOGIN, user)
    resolve()
  } catch (e) {
    reject(e)
  }
})

export const setRouteData = ({ commit }, routeData) => new Promise((resolve, reject) => {
  try {
    commit(types.SET_ROUTE_DATA, routeData)
    resolve()
  } catch (e) {
    reject(e)
  }
})

export const registration = ({ commit }, user) => new Promise((resolve, reject) => {
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then((response) => {
    commit(types.LOGIN, response.user)
    resolve(response)
  }).catch((error) => {
    reject(error)
  })
})

export const clear = ({ commit }) => new Promise((resolve, reject) => {
  try {
    commit(types.CLEAR)
    resolve()
  } catch (e) {
    reject(e)
  }
})

export const getLocale = ({ commit }) => new Promise((resolve, reject) => {
  // Vue.$http.get(`/v1/settings/getLocale`).then((response) => {
  //   commit(types.FETCH_LOCALE, response.data)
  //   resolve(response)
  // }, (err) => {
  //   reject(err)
  // })
})
export default {
  login,
  logout,
  setUserData,
  setRouteData,
  registration,
  getLocale,
  clear
}
