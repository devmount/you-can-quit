import { firebase } from "@firebase/app";
import "@firebase/firestore";
import { config } from "./config";

const firebaseApp = firebase.initializeApp(config);
export const db = firebaseApp.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);