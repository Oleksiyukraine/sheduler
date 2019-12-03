import {
  LOGIN,
  CLEAR,
  SET_ROUTE_DATA,
  FETCH_LOCALE
} from './mutation-types'

export default {
  [LOGIN] (state, user) {
    state.authenticated = true
    state.user.email = user.email
    state.user.id = user.uid
  },
  [CLEAR] (state) {
    state.authenticated = false
    state.user.email = null
    state.user.id = null
  },
  [FETCH_LOCALE] (state, locale) {
    state.locale = locale
  },
  [SET_ROUTE_DATA] (state, routeData) {
    state.routeData = routeData
  }
}
