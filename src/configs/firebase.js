import { FirebaseError, initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import firebase from "firebase";
import "firebase/firestore ";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyARZVrq9nZnx2xj4XZvm-i27_DEqRBucmU",
    authDomain: "doan-7e336.firebaseapp.com",
    projectId: "doan-7e336",
    storageBucket: "doan-7e336.appspot.com",
    messagingSenderId: "91193570099",
    appId: "1:91193570099:web:0772e7bd9c55b10cbec446",
    measurementId: "G-N7M8J68SKW"
  };

  firebase.initializeApp(firebaseConfig)
