console.log('Home Bisa');
// Tanggal, Hari, Tahun
function updateTanggal() {
  const namaHari = [
    'Minggu', 'Senin', 'Selasa', 'Rabu', 
    'Kamis', 'Jumat', 'Sabtu'
  ];
  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 
    'Mei', 'Juni', 'Juli', 'Agustus', 
    'September', 'Oktober', 'November', 'Desember'
  ];

  const tanggalSekarang = new Date();

  const hari = namaHari[tanggalSekarang.getDay()];
  const tanggal = tanggalSekarang.getDate();
  const bulan = namaBulan[tanggalSekarang.getMonth()];
  const tahun = tanggalSekarang.getFullYear();
  const formatTanggal = `${hari}, ${tanggal} ${bulan} ${tahun}`;

  const elementTanggal = document.getElementById('Tanggal');
  if (elementTanggal) {
    elementTanggal.textContent = formatTanggal;
  }
}
console.log(updateTanggal());

// window.onload = function() {
//   updateTanggal();
//   setInterval(updateTanggal, 1000);
// };

// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDh7h2pepjv8AIPwVKy30y2tQIkKwNOcmU",
  authDomain: "salmon-17.firebaseapp.com",
  databaseURL: "https://salmon-17-default-rtdb.firebaseio.com",
  projectId: "salmon-17",
  storageBucket: "salmon-17.appspot.com",
  messagingSelderId: "809053328128",
  appId: "1:809053328128:web:446c479d6563c5da1c59e5",
};
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Wifi ESP32
firebase.database().ref(`Device/Status/Wifi`).once('value').then(snapshot => {
  if("Connected"){
    console.log("Wifi Aman bang");
    document.getElementById('Device').innerText = 'Online';
  }else{
    document.getElementById('Device').innerText = 'Offline';
  }
})

// Pop UP
let activeLateralNumber = null;
function showPopup(lateralNumber) {
  const popup = document.getElementById("popupOverlay");
  const popupTitle = popup.querySelector(".popup-header h2");
  popupTitle.textContent = `Lateral ${lateralNumber}`;
  popup.classList.add("active");
  document.body.style.overflow = "hidden";
  activeLateralNumber = lateralNumber;
}

function closePopup() {
  const popup = document.getElementById("popupOverlay");
  popup.classList.remove("active");
  document.body.style.overflow = "auto";
  activeLateralNumber = null;
}

function navigateToSchedule(type) {
  if (activeLateralNumber === null) return;
  const pages = {
    penyiraman: {
      1: 'L1A.html',
      2: 'L2A.html',
      3: 'JadwalL3A.html',
      4: 'JadwalL4A.html'
    },
    pemupukan: {
      1: 'L1P.html',
      2: 'L2P.html',
      3: 'JadwalL3P.html',
      4: 'JadwalL4P.html'
    }
  };

  const targetPage = pages[type][activeLateralNumber];
  if (targetPage) {
    window.location.href = targetPage;
  }
}

document.querySelectorAll(".boxLateral").forEach((box, index) => {
  const clickableElements = box.querySelectorAll(".circle, .TextLateral");
  clickableElements.forEach((element) => {
    element.addEventListener("click", () => {
      showPopup(index + 1);
    });
  });
  
  const inputField = box.querySelector("input");
  inputField.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

document.querySelector(".close-btn").addEventListener("click", closePopup);

document.getElementById("popupOverlay").addEventListener("click", (e) => {
  if (e.target === document.getElementById("popupOverlay")) {
    closePopup();
  }
});

document.getElementById("penyiraman").addEventListener("click", () => {
  navigateToSchedule('penyiraman');
});

document.getElementById("pemupukan").addEventListener("click", () => {
  navigateToSchedule('pemupukan');
});

// Box Lateral
document.getElementById("form1").addEventListener("submit", function (event) {
  event.preventDefault();
  saveInputToFirebase("lateral1", "inputField1");
});

document.getElementById("form2").addEventListener("submit", function (event) {
  event.preventDefault();
  saveInputToFirebase("lateral2", "inputField2");
});

document.getElementById("form3").addEventListener("submit", function (event) {
  event.preventDefault();
  saveInputToFirebase("lateral3", "inputField3");
});

document.getElementById("form4").addEventListener("submit", function (event) {
  event.preventDefault();
  saveInputToFirebase("lateral4", "inputField4");
});

function loadLastInput(lateralId, inputId) {
  const inputRef = database.ref("Tumbuhan/" + lateralId).limitToLast(1);
  inputRef
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const lastInput = snapshot.val();
        const inputText = Object.values(lastInput)[0].name; 
        document.getElementById(inputId).value = inputText; 
      }
    })
    .catch((error) => {
      console.error("Error getting last input: ", error);
    });
}


loadLastInput("lateral1", "inputField1");
loadLastInput("lateral2", "inputField2");
loadLastInput("lateral3", "inputField3");
loadLastInput("lateral4", "inputField4");

// Variabel
function saveInputToFirebase(lateralId, inputFieldId) {
  const inputField = document.getElementById(inputFieldId);
  const inputValue = inputField.value;

  database
    .ref("Tumbuhan/" + lateralId)
    .push({
      name: inputValue,
      timestamp: Date.now(),
    })
    .then(() => {
      console.log("Data berhasil disimpan ke Firebase");
    })
    .catch((error) => {
      console.error("Gagal menyimpan data ke Firebase", error);
    });

  inputField.value = inputValue;
}

// Cuaca  
async function getWeather() {  
  const apiKey = "66d1d968773cf23c7e70e13247990a5c";  
  const city = "Kediri";  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;  

  try {  
    // Tambahkan timeout untuk fetch  
    const controller = new AbortController();  
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 detik timeout  

    const response = await fetch(url, {   
      signal: controller.signal   
    });  

    clearTimeout(timeoutId);  

    // Cek status response  
    if (!response.ok) {  
      throw new Error(`HTTP error! status: ${response.status}`);  
    }  

    const data = await response.json();  

    // Validasi data  
    if (!data || !data.weather || !data.main) {  
      throw new Error('Data cuaca tidak lengkap');  
    }  

    // Menambahkan logika untuk menentukan kondisi cuaca  
    const weatherCondition = data.weather[0].main.toLowerCase();  
    let weatherInfo = getWeatherIcon(weatherCondition);  

    // Fungsi untuk mengamankan pengambilan nilai  
    const safeGetValue = (value, defaultValue = 0) =>   
      value !== undefined ? Math.round(value) : defaultValue;  

    // Update elemen-elemen cuaca dengan pengecekan  
    updateWeatherElement("suhu", `${safeGetValue(data.main.temp)}°`);  
    updateWeatherElement("kelembaban", `${safeGetValue(data.main.humidity)}%`);  
    updateWeatherElement("angin", `${safeGetValue(data.wind.speed)}m/s`);  
    
    // Penanganan rainfall yang lebih aman  
    const rainfall = data.rain && data.rain['1h']   
      ? safeGetValue(data.rain['1h'])   
      : 0;  
    updateWeatherElement("Rainfall", `${rainfall}mm/h`);  
    
    // Update kondisi cuaca  
    updateWeatherCondition(weatherInfo);  

  } catch (error) {  
    handleWeatherError(error);  
  }  
}  

// Fungsi untuk mendapatkan ikon cuaca  
function getWeatherIcon(weatherCondition) {  
  const weatherIcons = {  
    'clear': {   
      icon: '<i class="fa-solid fa-sun"></i>',   
      text: 'Cerah'   
    },  
    'clouds': {   
      icon: '<i class="fa-solid fa-cloud"></i>',   
      text: 'Mendung'   
    },  
    'rain': {   
      icon: '<i class="fa-solid fa-cloud-showers-heavy"></i>',   
      text: 'Hujan'   
    },  
    'thunderstorm': {   
      icon: '<i class="fa-solid fa-cloud-bolt"></i>',   
      text: 'Petir'   
    },  
    'drizzle': {   
      icon: '<i class="fa-solid fa-cloud-rain"></i>',   
      text: 'Gerimis'   
    },  
    'default': {   
      icon: '<i class="fa-solid fa-cloud-sun"></i>',   
      text: 'Cuaca'   
    }  
  };  

  return weatherIcons[weatherCondition] || weatherIcons['default'];  
}  

// Fungsi update elemen dengan pengecekan  
function updateWeatherElement(elementId, value) {  
  const element = document.getElementById(elementId);  
  if (element) {  
    element.textContent = value;  
  } else {  
    console.warn(`Elemen dengan ID ${elementId} tidak ditemukan`);  
  }  
}  

// Fungsi update kondisi cuaca  
function updateWeatherCondition(weatherInfo) {  
  const iconElement = document.getElementById("IconCuaca");  
  const textElement = document.getElementById("KondisiCuaca");  

  if (iconElement) {  
    iconElement.innerHTML = weatherInfo.icon;  
  }  

  if (textElement) {  
    textElement.textContent = weatherInfo.text;  
  }  
}  

// Penanganan error yang lebih informatif  
function handleWeatherError(error) {  
  console.error("Error fetching weather data:", error);  

  // Update elemen dengan pesan error  
  const errorElements = [  
    "suhu", "kelembaban", "angin", "Rainfall",   
    "IconCuaca", "KondisiCuaca"  
  ];  

  errorElements.forEach(elementId => {  
    const element = document.getElementById(elementId);  
    if (element) {  
      element.textContent = error.message || 'Gagal memuat data';  
    }  
  });  

  // Coba ulang setelah beberapa saat  
  setTimeout(getWeather, 30000); // Coba lagi setelah 30 detik  
}  

// Fungsi memulai update cuaca dengan error handling  
function startWeatherUpdates() {  
  // Pastikan DOM sudah selesai dimuat  
  if (document.readyState === 'loading') {  
    document.addEventListener('DOMContentLoaded', initWeatherUpdates);  
  } else {  
    initWeatherUpdates();  
  }  
}  

function initWeatherUpdates() {  
  // Panggil segera  
  getWeather();  

  // Update setiap 10 menit  
  setInterval(getWeather, 600000);  
}  

// Inisiasi update cuaca  
startWeatherUpdates();

