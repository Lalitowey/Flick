  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCrXnG6H615rquhLI-hamYrz2GgLrflf2A",
    authDomain: "flicker-8a847.firebaseapp.com",
    projectId: "flicker-8a847",
    storageBucket: "flicker-8a847.appspot.com",
    messagingSenderId: "24731055597",
    appId: "1:24731055597:web:54cef59f09ad65e58de3e4"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth()

  var username =document.getElementById("username")
  var email =document.getElementById("email")
  var password =document.getElementById("password")

  window.signup = function(e){
    e.preventDefault();
    var obj = {
        username:username.value
        email:email.value
        password:password.value
      }
      createUserWithEmailAndPassword(auth, obj.email,obj.password)
      .then(function(success){
        alert("Signup Successfully")
      })
      .catch(function(err){
        alert("error"  + err)
      })
      console.log(obj)
}; 