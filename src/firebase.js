import { firebase } from "@firebase/app";
import "@firebase/firestore";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDQLFdo9TkA6-zQW1HLTtvfl1VHSLr10Vc",
  authDomain: "you-can-quit.firebaseapp.com",
  databaseURL: "https://you-can-quit.firebaseio.com",
  projectId: "you-can-quit",
  storageBucket: "",
  messagingSenderId: "73498275239"
});

export const db = firebaseApp.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);