// Ticketly - Main Application JavaScript

// ==================== LOCAL STORAGE KEYS ====================
const STORAGE_KEYS = {
  SESSION: "ticketapp_session",
  USER: "ticketapp_user",
  USERS: "ticketapp_users",
  TICKETS: "ticketapp_tickets",
};

// ==================== UTILITY FUNCTIONS ====================
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50 ${
    type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
  }`;

  toast.classList.remove("translate-x-full", "opacity-0");

  setTimeout(() => {
    toast.classList.add("translate-x-full", "opacity-0");
  }, 3000);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// ==================== AUTH FUNCTIONS ====================
function initializeUsers() {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!users) {
    // Seed with default admin user
    const defaultUsers = [
      {
        id: "user_admin",
        email: "admin@ticketly.com",
        password: "password123",
        name: "Admin User",
      },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
}

function getCurrentUser() {
  const session = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!session) return null;

  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
}

function isAuthenticated() {
  return !!localStorage.getItem(STORAGE_KEYS.SESSION);
}

function checkAuth() {
  if (!isAuthenticated() && !window.location.href.includes("index.php")) {
    window.location.href = "/";
  }
}

// ==================== TICKET FUNCTIONS ====================
function initializeTickets() {
  const tickets = localStorage.getItem(STORAGE_KEYS.TICKETS);
  if (!tickets) {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify([]));
  }
}

function getTickets() {
  const tickets = localStorage.getItem(STORAGE_KEYS.TICKETS);
  return tickets ? JSON.parse(tickets) : [];
}

function saveTickets(tickets) {
  localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
}

function getTicketStats() {
  const tickets = getTickets();
  return {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };
}

function createTicket(ticketData) {
  const tickets = getTickets();
  const newTicket = {
    id: generateId(),
    ...ticketData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tickets.push(newTicket);
  saveTickets(tickets);
  return newTicket;
}

function updateTicket(ticketId, updates) {
  const tickets = getTickets();
  const index = tickets.findIndex((t) => t.id === ticketId);
  if (index !== -1) {
    tickets[index] = {
      ...tickets[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveTickets(tickets);
    return tickets[index];
  }
  return null;
}

function deleteTicket(ticketId) {
  const tickets = getTickets();
  const filtered = tickets.filter((t) => t.id !== ticketId);
  saveTickets(filtered);
}

// ==================== MODAL FUNCTIONS ====================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
}

// ==================== FORM VALIDATION ====================
function validateLoginForm(email, password) {
  const errors = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}

function validateSignupForm(name, email, password, confirmPassword) {
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

function validateTicketForm(title, description) {
  const errors = {};

  if (!title || title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  } else if (title.trim().length > 100) {
    errors.title = "Title must be less than 100 characters";
  }

  if (description && description.length > 500) {
    errors.description = "Description must be less than 500 characters";
  }

  return errors;
}

function displayErrors(errors) {
  // Clear previous errors
  document.querySelectorAll(".error-message").forEach((el) => el.remove());
  document.querySelectorAll(".border-red-500").forEach((el) => {
    el.classList.remove("border-red-500");
  });

  // Display new errors
  Object.keys(errors).forEach((field) => {
    const input = document.getElementById(field);
    if (input) {
      input.classList.add("border-red-500");
      const error = document.createElement("p");
      error.className = "error-message text-red-600 text-sm mt-1";
      error.textContent = errors[field];
      input.parentElement.appendChild(error);
    }
  });
}

// ==================== MOBILE MENU ====================
function toggleMobileMenu() {
  const sidebar = document.getElementById("mobile-sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  if (sidebar && overlay) {
    sidebar.classList.toggle("-translate-x-full");
    overlay.classList.toggle("hidden");
  }
}

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", function () {
  // Initialize storage
  initializeUsers();
  initializeTickets();

  // Setup mobile menu toggle
  const menuButton = document.getElementById("mobile-menu-button");
  if (menuButton) {
    menuButton.addEventListener("click", toggleMobileMenu);
  }

  const overlay = document.getElementById("sidebar-overlay");
  if (overlay) {
    overlay.addEventListener("click", toggleMobileMenu);
  }

  // Setup modal close on backdrop click
  document.querySelectorAll("[data-modal]").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.add("hidden");
        document.body.style.overflow = "auto";
      }
    });
  });

  console.log("Ticketly initialized");
});
