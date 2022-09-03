/* eslint-disable no-unused-vars */
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail,
 } from 'firebase/auth';

 import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc,
    orderBy,
    limit,
    onSnapshot,
    setDoc,
    doc,
    serverTimestamp,
    deleteDoc,
    startAfter,
    getDoc,
  } from 'firebase/firestore';

import { initializeApp } from 'firebase/app';
import { getFirebaseConfig } from './firebase-config';

initializeApp(getFirebaseConfig());

const auth = getAuth();

async function createDocument (collectionPath, document) {
    
    try {
        const docRef = await addDoc(collection(getFirestore(), collectionPath), document);
        return docRef;
      }
      catch(error) {
        console.error('Error writing new message to Firebase Database', error);
      }
};

async function readDocument(collectionPath, id){
//https://softauthor.com/firebase-firestore-get-document-by-id/
  try {

    const docRef = doc(collection(getFirestore(), collectionPath), id);
    
    const docSnap = await getDoc(docRef);

    return docSnap;

  } catch(error) {
    console.log(error)
  }

}

async function readDocuments ({
  collectionPath, 
  queries, 
  orderByField, 
  orderByDirection,
  perPage,
  cursorID
}) {

    let collectionRef = collection(getFirestore(), collectionPath);

    if (queries && queries.length > 0){
        for(const q of queries) {
            collectionRef = query(collectionRef, where(
                q.field, 
                q.condition, 
                q.value
            ));
        }
    }

    if(orderByField && orderByDirection) {
      collectionRef = query(collectionRef, orderBy(orderByField, orderByDirection), limit(perPage)) // , limit(perPage) 
    }

    if(cursorID) {
      const document = await readDocument(collectionPath, cursorID);

      collectionRef = startAfter(document)
    }




    try {
        const docSnap = await getDocs(collectionRef);
        return docSnap;
      }
      catch(error) {
        console.error('Error getting documents from Firebase Database', error);
      }
}

async function updateDocument (collectionPath, id, document) {

    let docRef = doc(getFirestore(), collectionPath, id);

    try {
        const updateDocResponse = await updateDoc(docRef, document);
        return updateDocResponse;
      }
      catch(error) {
        console.error('Error updating documents to Firebase Database', error);
      }
    
}

async function deleteDocument (collectionPath, id) {

  let docRef = doc(getFirestore(), collectionPath, id);

  try {
      const deleteDocResponse = await deleteDoc(docRef);
      return deleteDocResponse;
    }
    catch(error) {
      console.error('Error updating documents to Firebase Database', error);
    }
  
}

const FirebaseFirestoreService = {
    createDocument,
    readDocuments,
    updateDocument,
    deleteDocument,
}
export default FirebaseFirestoreService;