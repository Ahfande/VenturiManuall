console.log("Ada Bang");

document.getElementById('back').addEventListener('click', () =>{
    window.location.href = 'index.html';
});

// Server Untuk Menyalakan LED 
const firebaseConfig = {
    apiKey: "AIzaSyDh7h2pepjv8AIPwVKy30y2tQIkKwNOcmU",
    authDomain: "salmon-17.firebaseapp.com",
    databaseURL: "https://salmon-17-default-rtdb.firebaseio.com",
    projectId: "salmon-17",
    storageBucket: "salmon-17.appspot.com",
    messagingSenderId: "809053328128",
    appId: "1:809053328128:web:446c479d6563c5da1c59e5",
};
// Inisialisasi Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Untuk Menyalakan Lateral 1A
function controlLED(lateral, status) {
    firebase.database().ref(`/${lateral}/status`).set(status)
    .then(() => {
        console.log(`${lateral} set to ${status}`);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


// Button L1A
// OFF
const BtnL1AOFF = document.getElementById("btnL1AOFF").addEventListener('click', () =>{
    database.ref("Manual/L1A/")
    .set({ status: "OFF" })
    .then(() => {
    console.log("L1A OFF");
    document.getElementById("Status").textContent = "Non-Aktif";
    document.getElementById("Status").style.color = "#E92525";
    document.getElementById("Status").style.boxShadow = "0 0 4px 4px rgba(245, 40, 40, 0.8)";
    controlLED("Lateral1", "OFF");
    })
    .catch((error) => {
        console.error("Ada error yaitu: ", error);
    });
});
const BtnL1AON = document.getElementById("btnL1AON").addEventListener('click', () =>{
    database.ref("Manual/L1A/")
    .set({ status: "ON" })
    .then(() => {
    console.log("L1A ON");
    document.getElementById("Status").textContent = "Aktif";
    document.getElementById("Status").style.color = "#008000";
    document.getElementById("Status").style.boxShadow = "0px 0px 4px 4px rgba(76, 167, 113, 1)";
    controlLED("Lateral1", "L1A");
    })
    .catch((error) => {
    console.error("Ada error yaitu: ", error);
    });
});

window.onload = (() => {
    database.ref("Manual/L1A/").get().then((snapshot) => {
        const { status } = snapshot.val();
        if (status == "ON"){
            document.getElementById("Status").textContent = "Aktif";
            document.getElementById("Status").style.color = "#008000";
            document.getElementById("Status").style.boxShadow = "0px 0px 4px 4px rgba(76, 167, 113, 1)";
        }
        else if (status == "OFF"){
            document.getElementById("Status").textContent = "Non-Aktif";
            document.getElementById("Status").style.color = "#E92525";
            document.getElementById("Status").style.boxShadow = "0 0 4px 4px rgba(245, 40, 40, 0.8)";
        }
    });
})