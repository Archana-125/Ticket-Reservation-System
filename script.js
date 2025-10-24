// ===== USERS AND LOGIN =====
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Toggle between login and signup
function toggleForm(form) {
  if (form === 'login') {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
  } else {
    document.getElementById('signup-form').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
  }
}

// Signup
function signup() {
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  if (!username || !email || !password) return alert("Please fill all fields!");
  if (users.some(u => u.username === username)) return alert("Username already exists!");

  users.push({ username, email, password, bookings: [] });
  localStorage.setItem('users', JSON.stringify(users));
  alert("Signup successful! Please login.");
  toggleForm('login');
}

// Login
function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return alert("❌Invalid username or password!");
  currentUser = user;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  alert(" ✅Login successful!");
  window.location.href = "home.html";
}

// ===== HOME PAGE LOGIC =====
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById('bookingModal');

   if (!modal) return;
  const closeModal = document.getElementById('closeModal');
  const submitBtn = document.getElementById('submitBtn');
  const modalTitle = document.getElementById('modalTitle');
  const tableBody = document.querySelector('#myBookingTable tbody');
  let currentItem = "";

  // ===== SECTION SWITCHER (Fix smooth navigation) =====
window.showSection = function(sectionId) {
  document.querySelectorAll('.info-section').forEach(sec => sec.classList.add('hidden'));
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove('hidden');
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (sectionId === 'myBookings') updateMyBookings();
};

  /*window.showSection = function(sectionId) {
    document.querySelectorAll('.info-section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
    if (sectionId === 'myBookings') updateMyBookings();
  };*/

  // Book buttons
  document.querySelectorAll('.bookBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentItem = btn.dataset.item;
      const type = btn.dataset.type;
      modalTitle.textContent = `Booking for ${type}: ${currentItem}`;
      document.getElementById('location').value = currentItem;
      modal.style.display = 'flex';
    });
  });

  closeModal.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  // Submit booking
  submitBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const tickets = document.getElementById('tickets').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value;

    if (!name || !email || !phone || !tickets || !date || !time || !location)
      return alert("Please fill all details!");

    // Save booking  
    currentUser.bookings.push({ location, name, email, phone, tickets, date, time });
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Update stored users
    users = users.map(u => u.username === currentUser.username ? currentUser : u);
    localStorage.setItem('users', JSON.stringify(users));

    updateMyBookings();
    alert("🎟️Booking Confirmed!");
    modal.style.display = 'none';
  });

  // Update booking table
  function updateMyBookings() {
    if (!currentUser) {
        alert("⚠️ Please login first!");
        window.location.href = "index.html";
        return;
    }
    tableBody.innerHTML = '';
    currentUser.bookings.forEach(b => {
      const row = tableBody.insertRow();
      row.insertCell(0).textContent = b.location;
      row.insertCell(1).textContent = b.name;
      row.insertCell(2).textContent = b.email;
      row.insertCell(3).textContent = b.phone;
      row.insertCell(4).textContent = b.tickets;
      row.insertCell(5).textContent = b.date;
      row.insertCell(6).textContent = b.time;
    });
  }
});

// ===== LOGOUT FUNCTION =====
function logout() {
  localStorage.removeItem('currentUser');
  alert(" 👋You have been logged out!");
  window.location.href = "index.html"; // your login page
}











