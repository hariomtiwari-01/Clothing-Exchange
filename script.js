document.addEventListener('DOMContentLoaded', () => {
  highlightActiveNav();
  initLogin();
  initRegister();
  initFormValidation();
  initImageUploadPreview();
  initSwapActions();
  loadItemCards();
  initAdminPanel();
  loadUserProfile();
  initLogout();
});

// === Highlight active nav (if nav is used) ===
function highlightActiveNav() {
  const path = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('nav a, header button');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('underline', 'font-semibold', 'text-green-600');
    }
  });
}

// === Login Functionality ===
function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
      showToast('All fields are required.', 'error');
      return;
    }

    const users = JSON.parse(localStorage.getItem('rewearUsers')) || [];
    const matchedUser = users.find(u => u.email === email && u.password === password);

    if (matchedUser) {
      sessionStorage.setItem('loggedInUser', JSON.stringify(matchedUser));
      showToast('Login successful!');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      showToast('Invalid email or password.', 'error');
    }
  });
}

// === Registration Functionality ===
function initRegister() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const location = form.location.value.trim();

    if (!name || !email || !password || !location) {
      showToast('All fields are required.', 'error');
      return;
    }

    const users = JSON.parse(localStorage.getItem('rewearUsers')) || [];

    if (users.find(u => u.email === email)) {
      showToast('Email already registered.', 'error');
      return;
    }

    const newUser = {
      name,
      email,
      password,
      location,
      points: 0
    };

    users.push(newUser);
    localStorage.setItem('rewearUsers', JSON.stringify(users));
    showToast('Registration successful! Redirecting...');
    setTimeout(() => {
      window.location.href = 'auth.html';
    }, 1200);
  });
}

// === Form Validation (fallback for required fields) ===
function initFormValidation() {
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', e => {
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('border-red-500');
        valid = false;
      } else {
        field.classList.remove('border-red-500');
      }
    });

    if (!valid) {
      e.preventDefault();
      showToast('Please fill in all required fields.', 'error');
    }
  });
}

// === Image Preview for Upload ===
function initImageUploadPreview() {
  const fileInput = document.querySelector('input[type="file"]');
  if (!fileInput) return;

  fileInput.addEventListener('change', () => {
    const previewContainer = document.createElement('div');
    previewContainer.className = 'mt-4 flex flex-wrap gap-4 image-preview';

    Array.from(fileInput.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'w-24 h-24 object-cover rounded shadow';
        previewContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    });

    const form = fileInput.closest('form');
    const oldPreview = form.querySelector('.image-preview');
    if (oldPreview) oldPreview.remove();

    form.appendChild(previewContainer);
  });
}

// === Toast Messages ===
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.className = `fixed top-4 right-4 px-4 py-2 text-white rounded shadow z-50 animate-fade-in ${
    type === 'success' ? 'bg-green-600' : 'bg-red-600'
  }`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// === Swap and Redeem Buttons ===
function initSwapActions() {
  const swapBtn = document.querySelector('#swapRequest');
  const redeemBtn = document.querySelector('#redeemPoints');
  const status = document.querySelector('#itemStatus');

  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      status.textContent = 'Pending';
      showToast('Swap request sent!');
    });
  }

  if (redeemBtn) {
    redeemBtn.addEventListener('click', () => {
      status.textContent = 'Pending';
      showToast('Item redeemed with points!');
    });
  }
}

// === Item Cards Loader ===
function loadItemCards() {
  const itemList = document.querySelector('#itemList');
  if (!itemList) return;

  const items = JSON.parse(localStorage.getItem('rewearItems')) || getMockItems();
  itemList.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded shadow overflow-hidden';
    card.innerHTML = `
      <img src="${item.image}" class="w-full h-40 object-cover" />
      <div class="p-4">
        <h3 class="font-semibold">${item.title}</h3>
        <p class="text-sm text-gray-600">${item.category} · ${item.size}</p>
        <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">${item.status}</span>
      </div>
    `;
    itemList.appendChild(card);
  });
}

function getMockItems() {
  return [
    {
      title: 'Vintage Jacket',
      category: 'Outerwear',
      size: 'M',
      status: 'Available',
      image: 'images/item-placeholder.jpg',
    },
    {
      title: 'Classic Tee',
      category: 'Top',
      size: 'L',
      status: 'Swapped',
      image: 'images/item-placeholder.jpg',
    },
  ];
}

// === Admin Panel Actions ===
function initAdminPanel() {
  const approveBtns = document.querySelectorAll('.approve-btn');
  const rejectBtns = document.querySelectorAll('.reject-btn');

  approveBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      btn.closest('.admin-item').querySelector('.status').textContent = 'Approved';
      showToast('Item approved.');
    })
  );

  rejectBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      btn.closest('.admin-item').querySelector('.status').textContent = 'Rejected';
      showToast('Item rejected.', 'error');
    })
  );
}

// === Dashboard Profile Loader ===
function loadUserProfile() {
  if (!window.location.pathname.includes('dashboard.html')) return;

  const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  const nameEl = document.getElementById('profileName');
  const emailEl = document.getElementById('profileEmail');
  const locationEl = document.getElementById('profileLocation');
  const pointsEl = document.getElementById('profilePoints');

  if (nameEl) nameEl.textContent = user.name;
  if (emailEl) emailEl.textContent = user.email;
  if (locationEl) locationEl.textContent = user.location || 'Not specified';
  if (pointsEl) pointsEl.textContent = `${user.points || 0} pts`;
}

// === Logout Handler ===
function initLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('loggedInUser');
    showToast('Logged out successfully.', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  });
}

// === Animation Keyframes for Toasts ===
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
`;
document.head.appendChild(style);
