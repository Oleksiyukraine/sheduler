import Vue from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { firestorePlugin } from 'vuefire'
Vue.use(firestorePlugin)

const firebaseConfig = {
  apiKey: 'AIzaSyB7rEXgiTo56avNtHDanc52fJebVCgRPRw',
  authDomain: 'bg-test-data.firebaseapp.com',
  databaseURL: 'https://bg-test-data.firebaseio.com',
  projectId: 'bg-test-data',
  storageBucket: 'bg-test-data.appspot.com',
  messagingSenderId: '525999656888',
  appId: '1:525999656888:web:0d0c42365308e556e1494d',
  measurementId: 'G-SBL8PTQJRG'
}

let firebaseApp = firebase.initializeApp(firebaseConfig)
let firebaseAuth = firebaseApp.auth()
let firebaseDb = firebaseApp.firestore()

export { firebaseAuth, firebaseDb }
