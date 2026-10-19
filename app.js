// Telegram Web A - Interactive Application Logic with Monkey Eye-Tracking & Strict Validation

const COUNTRIES = [
  { name: "Egypt", flag: "🇪🇬", code: "+20", digits: 10 }, // 10 digits after +20 (11 total with leading 0)
  { name: "Saudi Arabia", flag: "🇸🇦", code: "+966", digits: 9 },
  { name: "United Arab Emirates", flag: "🇦🇪", code: "+971", digits: 9 },
  { name: "Kuwait", flag: "🇰🇼", code: "+965", digits: 8 },
  { name: "Qatar", flag: "🇶🇦", code: "+974", digits: 8 },
  { name: "Jordan", flag: "🇯🇴", code: "+962", digits: 9 },
  { name: "Lebanon", flag: "🇱🇧", code: "+961", digits: 8 },
  { name: "Iraq", flag: "🇮🇶", code: "+964", digits: 10 },
  { name: "Syria", flag: "🇸🇾", code: "+963", digits: 9 },
  { name: "Morocco", flag: "🇲🇦", code: "+212", digits: 9 },
  { name: "Algeria", flag: "🇩🇿", code: "+213", digits: 9 },
  { name: "Tunisia", flag: "🇹🇳", code: "+216", digits: 8 },
  { name: "Libya", flag: "🇱🇾", code: "+218", digits: 9 },
  { name: "Sudan", flag: "🇸🇩", code: "+249", digits: 9 },
  { name: "Oman", flag: "🇴🇲", code: "+968", digits: 8 },
  { name: "Bahrain", flag: "🇧🇭", code: "+973", digits: 8 },
  { name: "Yemen", flag: "🇾🇪", code: "+967", digits: 9 },
  { name: "Palestine", flag: "🇵🇸", code: "+970", digits: 9 },
  { name: "United States", flag: "🇺🇸", code: "+1", digits: 10 },
  { name: "United Kingdom", flag: "🇬🇧", code: "+44", digits: 10 },
  { name: "Germany", flag: "🇩🇪", code: "+49", digits: 10 },
  { name: "France", flag: "🇫🇷", code: "+33", digits: 9 },
  { name: "Canada", flag: "🇨🇦", code: "+1", digits: 10 },
  { name: "Turkey", flag: "🇹🇷", code: "+90", digits: 10 },
  { name: "Italy", flag: "🇮🇹", code: "+39", digits: 10 },
  { name: "Spain", flag: "🇪🇸", code: "+34", digits: 9 },
  { name: "Russia", flag: "🇷🇺", code: "+7", digits: 10 }
];

let selectedCountry = COUNTRIES[0]; // Egypt by default

// DOM Elements
const phoneAuthView = document.getElementById("phoneAuthView");
const qrAuthView = document.getElementById("qrAuthView");
const codeAuthView = document.getElementById("codeAuthView");
const chatAppContainer = document.getElementById("chatAppContainer");

const countrySelectorTrigger = document.getElementById("countrySelectorTrigger");
const countryDisplay = document.getElementById("countryDisplay");
const phoneNumberInput = document.getElementById("phoneNumberInput");
const phoneGroup = document.getElementById("phoneGroup");
const nextBtn = document.getElementById("nextBtn");
const phoneForm = document.getElementById("phoneForm");

const countryModalBackdrop = document.getElementById("countryModalBackdrop");
const closeCountryModalBtn = document.getElementById("closeCountryModalBtn");
const countrySearchInput = document.getElementById("countrySearchInput");
const countryList = document.getElementById("countryList");

const switchToQrBtn = document.getElementById("switchToQrBtn");
const switchToPhoneBtn = document.getElementById("switchToPhoneBtn");
const editPhoneBtn = document.getElementById("editPhoneBtn");
const sentPhoneDisplay = document.getElementById("sentPhoneDisplay");
const codeDigitInput = document.getElementById("codeDigitInput");

// Monkey Elements (Exact Uploaded Art)
const monkeyWrapper = document.getElementById("monkeyWrapper");
const monkeyStage = document.getElementById("monkeyStage");
const monkeyEyesImg = document.getElementById("monkeyEyesImg");

const themeToggle = document.getElementById("themeToggle");
const previewAppBtn = document.getElementById("previewAppBtn");
const exitAppBtn = document.getElementById("exitAppBtn");

let isCodeInputFocused = false;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderCountries(COUNTRIES);
  initEventListeners();
  drawTelegramQr();
  renderChatList();
  initMonkeyTracking();

  // Initial phone number focus
  phoneNumberInput.focus();
  const len = phoneNumberInput.value.length;
  phoneNumberInput.setSelectionRange(len, len);
});

// Event Listeners
function initEventListeners() {
  // Theme Toggle (if present)
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.contains("theme-dark");
      if (isDark) {
        document.body.classList.replace("theme-dark", "theme-light");
        document.documentElement.classList.replace("theme-dark", "theme-light");
      } else {
        document.body.classList.replace("theme-light", "theme-dark");
        document.documentElement.classList.replace("theme-light", "theme-dark");
      }
    });
  }

  // Country Modal
  countrySelectorTrigger.addEventListener("click", openCountryModal);
  closeCountryModalBtn.addEventListener("click", closeCountryModal);
  countryModalBackdrop.addEventListener("click", (e) => {
    if (e.target === countryModalBackdrop) closeCountryModal();
  });

  // Country Search
  countrySearchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(query) || c.code.includes(query)
    );
    renderCountries(filtered);
  });

  // Phone number typing & formatting
  phoneNumberInput.addEventListener("input", onPhoneInput);
  phoneNumberInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePhoneSubmit();
    }
  });

  // Next Submit button
  nextBtn.addEventListener("click", handlePhoneSubmit);
  phoneForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handlePhoneSubmit();
  });

  // QR <-> Phone Navigation
  switchToQrBtn.addEventListener("click", () => {
    phoneAuthView.classList.add("hidden");
    qrAuthView.classList.remove("hidden");
  });

  switchToPhoneBtn.addEventListener("click", () => {
    qrAuthView.classList.add("hidden");
    phoneAuthView.classList.remove("hidden");
    phoneNumberInput.focus();
  });

  // Edit Phone from Code view (pencil icon ✏️)
  editPhoneBtn.addEventListener("click", () => {
    codeAuthView.classList.add("hidden");
    phoneAuthView.classList.remove("hidden");
    phoneNumberInput.focus();
  });

  // Code input verification & Monkey look-down
  codeDigitInput.addEventListener("focus", () => {
    isCodeInputFocused = true;
    monkeyLookDown();
  });

  codeDigitInput.addEventListener("blur", () => {
    isCodeInputFocused = false;
    monkeyLookNeutral();
  });

  codeDigitInput.addEventListener("input", (e) => {
    // Digits only
    const val = e.target.value.replace(/\D/g, "");
    e.target.value = val;
    monkeyLookDown();

    // When exactly 5 digits are entered
    if (val.length === 5) {
      setTimeout(() => {
        openFullChatApp();
      }, 400);
    }
  });

  // Preview full Web App button (if present)
  if (previewAppBtn) {
    previewAppBtn.addEventListener("click", openFullChatApp);
  }
  if (exitAppBtn) {
    exitAppBtn.addEventListener("click", closeFullChatApp);
  }

  // Chat message sending
  const chatMessageInput = document.getElementById("chatMessageInput");
  const sendMsgBtn = document.getElementById("sendMsgBtn");
  sendMsgBtn.addEventListener("click", sendChatMessage);
  chatMessageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendChatMessage();
  });
}

// Phone Number Input Handler & Egypt Validation
function onPhoneInput(e) {
  let val = e.target.value.trim();
  phoneGroup.classList.remove("error");
  phoneGroup.querySelector(".input-box").classList.remove("shake-error");

  // Keep international prefix
  if (!val.startsWith("+")) {
    val = "+" + val.replace(/\D/g, "");
  }

  // Extract raw national digits after country code
  const code = selectedCountry.code; // e.g. "+20"
  let national = "";

  if (val.startsWith(code)) {
    national = val.slice(code.length).replace(/\D/g, "");
  } else {
    // If user deleted code or typed something else
    const raw = val.replace(/\D/g, "");
    if (raw.startsWith("20")) {
      national = raw.slice(2);
    } else if (raw.startsWith("01")) {
      // User typed Egyptian format 010..., 011..., 012..., 015...
      selectedCountry = COUNTRIES[0]; // Egypt
      countryDisplay.textContent = selectedCountry.name;
      national = raw.slice(1); // remove leading 0 for +20
    } else {
      national = raw;
    }
  }

  // For Egypt: max 10 national digits (which equals 11 digits in Egyptian 01XXXXXXXXX)
  const maxDigits = selectedCountry.digits || 10;
  if (national.length > maxDigits) {
    national = national.slice(0, maxDigits);
  }

  // Format as e.g. +20 12 3564 8231
  let formatted = code;
  if (national.length > 0) {
    if (selectedCountry.code === "+20") {
      // Egyptian format: +20 XX XXXX XXXX
      if (national.length <= 2) {
        formatted += " " + national;
      } else if (national.length <= 6) {
        formatted += " " + national.slice(0, 2) + " " + national.slice(2);
      } else {
        formatted += " " + national.slice(0, 2) + " " + national.slice(2, 6) + " " + national.slice(6);
      }
    } else {
      // General format
      formatted += " " + national;
    }
  }

  e.target.value = formatted;

  // Validation: For Egypt must have exactly 10 national digits (11 Egyptian digits total)
  const isValid = national.length === maxDigits;
  if (isValid) {
    nextBtn.classList.add("visible");
  } else {
    nextBtn.classList.remove("visible");
  }
}

// Handle Form Submission (Enter or Next Button)
function handlePhoneSubmit() {
  const val = phoneNumberInput.value.trim();
  const code = selectedCountry.code;
  let national = "";

  if (val.startsWith(code)) {
    national = val.slice(code.length).replace(/\D/g, "");
  } else {
    national = val.replace(/\D/g, "");
  }

  const requiredDigits = selectedCountry.digits || 10;

  // STRICT VALIDATION: If less than required digits (11 digits for Egypt), DO NOT ENTER!
  if (national.length < requiredDigits) {
    triggerPhoneError();
    return;
  }

  // Valid! Proceed to Code verification view
  sentPhoneDisplay.textContent = val;
  phoneAuthView.classList.add("hidden");
  codeAuthView.classList.remove("hidden");
  codeDigitInput.value = "";
  setTimeout(() => {
    codeDigitInput.focus();
    monkeyLookDown();
  }, 100);
}

// Trigger Shake Error Animation
function triggerPhoneError() {
  const inputBox = phoneGroup.querySelector(".input-box");
  phoneGroup.classList.add("error");
  inputBox.classList.remove("shake-error");
  void inputBox.offsetWidth; // trigger reflow
  inputBox.classList.add("shake-error");

  phoneNumberInput.focus();

  setTimeout(() => {
    inputBox.classList.remove("shake-error");
  }, 400);
}

// Interactive Monkey Mascot Eye-Tracking & Head 3D Tilt
function initMonkeyTracking() {
  window.addEventListener("mousemove", (e) => {
    // Only track if on Code view and not focusing on the code input
    if (codeAuthView.classList.contains("hidden")) return;
    if (isCodeInputFocused) return;
    if (!monkeyStage) return;

    const rect = monkeyStage.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    const maxEyeShift = 4.2;
    const eyeX = Math.min(dist / 24, maxEyeShift) * Math.cos(angle);
    const eyeY = Math.min(dist / 24, maxEyeShift) * Math.sin(angle);

    const maxRot = 8;
    const rotY = Math.min(dist / 20, maxRot) * Math.cos(angle);
    const rotX = -Math.min(dist / 20, maxRot) * Math.sin(angle);

    if (monkeyEyesImg) {
      monkeyEyesImg.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
    }
    monkeyStage.style.transform = `perspective(500px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
  });
}

// Monkey looks down directly at the Code input
function monkeyLookDown() {
  if (monkeyEyesImg) {
    monkeyEyesImg.style.transform = "translate(0px, 5.2px) scaleY(0.9)";
  }
  if (monkeyStage) {
    monkeyStage.style.transform = "perspective(500px) rotateX(7deg) translateY(2px)";
  }
}

// Monkey neutral position
function monkeyLookNeutral() {
  if (monkeyEyesImg) {
    monkeyEyesImg.style.transform = "translate(0px, 0px) scaleY(1)";
  }
  if (monkeyStage) {
    monkeyStage.style.transform = "perspective(500px) rotateY(0deg) rotateX(0deg)";
  }
}

// Render Countries List in Modal
function renderCountries(list) {
  countryList.innerHTML = "";
  if (list.length === 0) {
    countryList.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--color-text-secondary);">No countries found</div>`;
    return;
  }

  list.forEach(item => {
    const row = document.createElement("div");
    row.className = `country-item ${item.code === selectedCountry.code ? "selected" : ""}`;
    row.innerHTML = `
      <span class="country-item-flag">${item.flag}</span>
      <span class="country-item-name">${item.name}</span>
      <span class="country-item-code">${item.code}</span>
    `;
    row.addEventListener("click", () => {
      selectedCountry = item;
      countryDisplay.textContent = item.name;
      phoneNumberInput.value = item.code + " ";
      closeCountryModal();
      phoneNumberInput.focus();
      const pos = phoneNumberInput.value.length;
      phoneNumberInput.setSelectionRange(pos, pos);
      nextBtn.classList.remove("visible");
    });
    countryList.appendChild(row);
  });
}

function openCountryModal() {
  countryModalBackdrop.classList.remove("hidden");
  countrySelectorTrigger.classList.add("focused");
  countrySearchInput.value = "";
  renderCountries(COUNTRIES);
  setTimeout(() => countrySearchInput.focus(), 50);
}

function closeCountryModal() {
  countryModalBackdrop.classList.add("hidden");
  countrySelectorTrigger.classList.remove("focused");
}

// Draw Authentic Telegram QR Code on Canvas
function drawTelegramQr() {
  const canvas = document.getElementById("qrCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const modules = 25;
  const cellSize = size / modules;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);

  function isEye(r, c) {
    if (r < 7 && c < 7) return true;
    if (r < 7 && c >= modules - 7) return true;
    if (r >= modules - 7 && c < 7) return true;
    return false;
  }

  function drawEye(topR, leftC) {
    const x = leftC * cellSize;
    const y = topR * cellSize;
    const w = 7 * cellSize;

    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.roundRect(x, y, w, w, 8);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(x + cellSize, y + cellSize, w - 2 * cellSize, w - 2 * cellSize, 6);
    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.roundRect(x + 2 * cellSize, y + 2 * cellSize, w - 4 * cellSize, w - 4 * cellSize, 4);
    ctx.fill();
  }

  drawEye(0, 0);
  drawEye(0, modules - 7);
  drawEye(modules - 7, 0);

  const centerStart = 9;
  const centerEnd = 15;

  ctx.fillStyle = "#000000";
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (isEye(r, c)) continue;
      if (r >= centerStart && r <= centerEnd && c >= centerStart && c <= centerEnd) continue;

      const seed = (r * 37 + c * 41 + (r ^ c)) % 100;
      if (seed < 48) {
        ctx.beginPath();
        ctx.roundRect(c * cellSize + 0.5, r * cellSize + 0.5, cellSize - 1, cellSize - 1, 2);
        ctx.fill();
      }
    }
  }
}

// Telegram Full Web App Simulation
const MOCK_CHATS = [
  {
    id: 1,
    name: "Saved Messages",
    avatar: "S",
    bg: "linear-gradient(135deg, #2aabee, #229ed9)",
    time: "16:15",
    lastMsg: "Welcome to Telegram Web A! 🚀",
    unread: 0,
    status: "cloud storage"
  },
  {
    id: 2,
    name: "Telegram",
    avatar: "T",
    bg: "linear-gradient(135deg, #38AEEB, #279AD1)",
    time: "14:20",
    lastMsg: "Login notification from Telegram Web on Windows",
    unread: 1,
    status: "service notifications"
  },
  {
    id: 3,
    name: "Pavel Durov",
    avatar: "P",
    bg: "linear-gradient(135deg, #af52de, #5856d6)",
    time: "Yesterday",
    lastMsg: "Telegram celebrates another major update! ⚡",
    unread: 0,
    status: "broadcast channel • 2.6M subscribers"
  },
  {
    id: 4,
    name: "Developers Community",
    avatar: "D",
    bg: "linear-gradient(135deg, #34c759, #30b0c7)",
    time: "Oct 18",
    lastMsg: "Ahmed: Check out the new Web A client interface",
    unread: 3,
    status: "14,890 members, 1,234 online"
  }
];

let activeChat = MOCK_CHATS[0];

function renderChatList() {
  const container = document.getElementById("chatItemsList");
  if (!container) return;
  container.innerHTML = "";

  MOCK_CHATS.forEach(chat => {
    const row = document.createElement("div");
    row.className = `chat-row ${chat.id === activeChat.id ? "active" : ""}`;
    row.innerHTML = `
      <div class="chat-avatar" style="background: ${chat.bg}">${chat.avatar}</div>
      <div class="chat-content">
        <div class="chat-row-header">
          <span class="chat-name">${chat.name}</span>
          <span class="chat-time">${chat.time}</span>
        </div>
        <div class="chat-preview">
          <span class="chat-last-msg">${chat.lastMsg}</span>
          ${chat.unread > 0 ? `<span class="chat-unread-badge">${chat.unread}</span>` : ""}
        </div>
      </div>
    `;
    row.addEventListener("click", () => {
      activeChat = chat;
      chat.unread = 0;
      document.getElementById("activeChatTitle").textContent = chat.name;
      document.getElementById("activeChatStatus").textContent = chat.status;
      document.getElementById("activeChatAvatar").textContent = chat.avatar;
      document.getElementById("activeChatAvatar").style.background = chat.bg;
      renderChatList();
    });
    container.appendChild(row);
  });
}

function sendChatMessage() {
  const input = document.getElementById("chatMessageInput");
  const text = input.value.trim();
  if (!text) return;

  const messagesList = document.getElementById("messagesList");
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble outbound";
  bubble.innerHTML = `
    <div class="msg-text">${escapeHtml(text)}</div>
    <div class="msg-meta">
      <span class="msg-time">${timeStr}</span>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="msg-check">
        <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
      </svg>
    </div>
  `;
  messagesList.appendChild(bubble);
  input.value = "";

  const container = document.getElementById("chatMessagesContainer");
  container.scrollTop = container.scrollHeight;
}

async function openFullChatApp() {
  // افتح الشات بعد التأكد من صلاحية الموظف
  chatAppContainer.classList.remove("hidden");

  // سجّل الدخول بعد نجاح التحقق
  const employeeCode =
    document.getElementById("codeDigitInput").value;

  await logEmployeeLogin(employeeCode);
}

function closeFullChatApp() {
  chatAppContainer.classList.add("hidden");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}


async function logEmployeeLogin(employeeCode) {
  const url = "https://script.google.com/macros/s/AKfycbyOH_AzqYK-l2eLXdHH4yK5_50VSmG4Pnz_jtXljY86bsZQznq3CG805VUAqS_0dWK25w/exec";

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      body: new URLSearchParams({ employeeCode })
    });
  } catch (error) {
    console.error("Failed to send login log", error);
  }
}

