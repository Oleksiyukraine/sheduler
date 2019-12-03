import Vue from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { firestorePlugin } from 'vuefire'
Vue.use(firestorePlugin)

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: ''
}

let firebaseApp = firebase.initializeApp(firebaseConfig)
let firebaseAuth = firebaseApp.auth()
let firebaseDb = firebaseApp.firestore()

export { firebaseAuth, firebaseDb }
