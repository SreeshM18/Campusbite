// ─── ByteBite Authentication & Session Manager (localStorage + API Sync) ───

// Pre-populate default demo accounts if not already initialized
function initDefaultUsers() {
    const existing = localStorage.getItem('canteen_users');
    if (!existing) {
        const defaultUsers = [
            {
                userId: 101,
                name: 'Alex Chen',
                email: 'student@bytebite.edu',
                password: 'password123',
                role: 'STUDENT',
                department: 'Computer Science',
                createdAt: new Date().toISOString()
            },
            {
                userId: 102,
                name: 'Chef Marcus (Counter 2)',
                email: 'staff@bytebite.edu',
                password: 'staff123',
                role: 'CANTEEN_STAFF',
                department: 'Canteen Kitchen',
                createdAt: new Date().toISOString()
            },
            {
                userId: 103,
                name: 'Dr. Sarah Miller',
                email: 'faculty@bytebite.edu',
                password: 'password123',
                role: 'STUDENT',
                department: 'Electrical Engineering',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('canteen_users', JSON.stringify(defaultUsers));
    }
}

// Auto-run init
initDefaultUsers();

// Returns the list of all registered users from localStorage
function getUsers() {
    initDefaultUsers();
    return JSON.parse(localStorage.getItem('canteen_users') || '[]');
}

// Saves the user list back to localStorage
function saveUsers(users) {
    localStorage.setItem('canteen_users', JSON.stringify(users));
}

// Handle Registration
function handleRegister(event) {
    if (event) event.preventDefault();

    const name     = document.getElementById('reg-name')?.value.trim();
    const email    = document.getElementById('reg-email')?.value.trim().toLowerCase();
    const password = document.getElementById('reg-password')?.value;
    const confirm  = document.getElementById('confirm-password')?.value;
    const roleRaw  = document.getElementById('reg-role')?.value;

    // Map form role values → internal role constants
    const roleMap = {
        student: 'STUDENT',
        faculty: 'STUDENT',   // Faculty uses student food pre-order portal
        staff:   'CANTEEN_STAFF'
    };
    const role = roleMap[roleRaw] || 'STUDENT';

    // Basic validation
    if (!name || !email || !password) {
        showAuthAlert('Please fill in all required fields.', 'error');
        return;
    }
    if (password !== confirm) {
        showAuthAlert('Passwords do not match. Please try again.', 'error');
        return;
    }
    if (password.length < 6) {
        showAuthAlert('Password must be at least 6 characters long.', 'error');
        return;
    }

    const users = getUsers();

    // Check for duplicate email
    if (users.find(u => u.email === email)) {
        showAuthAlert('An account with this email already exists. Please log in.', 'error');
        return;
    }

    // Save new user
    const newUser = {
        userId: Date.now(),
        name,
        email,
        password,
        role,
        department: role === 'CANTEEN_STAFF' ? 'Kitchen Team' : 'Campus Member',
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);

    showAuthAlert('Account created successfully! Redirecting to login...', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1200);
}

// Handle Login
function handleLogin(event) {
    if (event) event.preventDefault();

    const email    = document.getElementById('login-email')?.value.trim().toLowerCase();
    const password = document.getElementById('login-password')?.value;

    if (!email || !password) {
        showAuthAlert('Please enter both email and password.', 'error');
        return;
    }

    const users = getUsers();
    const user  = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showAuthAlert('Invalid credentials. Try demo student or staff login.', 'error');
        return;
    }

    // Persist session (without raw password for safety)
    const sessionUser = { 
        userId: user.userId, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        department: user.department || 'Campus Member',
        loginTime: new Date().toISOString()
    };
    localStorage.setItem('canteen_session', JSON.stringify(sessionUser));

    showAuthAlert(`Welcome to ByteBite, ${user.name}!`, 'success');

    setTimeout(() => {
        if (user.role === 'CANTEEN_STAFF') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'index.html';
        }
    }, 800);
}

// Quick Demo Login Fill Helper
function fillDemoCredentials(role) {
    const emailInput = document.getElementById('login-email');
    const passInput  = document.getElementById('login-password');
    if (!emailInput || !passInput) return;

    if (role === 'student') {
        emailInput.value = 'student@bytebite.edu';
        passInput.value  = 'password123';
    } else if (role === 'staff') {
        emailInput.value = 'staff@bytebite.edu';
        passInput.value  = 'staff123';
    }
}

// Logout helper
function logout() {
    localStorage.removeItem('canteen_session');
    window.location.href = 'login.html';
}

// Auth guard — call at the top of protected pages
function requireAuth(allowedRole) {
    const user = JSON.parse(localStorage.getItem('canteen_session') || 'null');
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    if (allowedRole && user.role !== allowedRole) {
        alert('Access denied. This page is restricted to ' + (allowedRole === 'CANTEEN_STAFF' ? 'Canteen Staff' : 'Students') + '.');
        window.location.href = user.role === 'CANTEEN_STAFF' ? 'admin.html' : 'index.html';
        return null;
    }
    return user;
}

// Helper to show inline alerts on auth pages
function showAuthAlert(msg, type = 'error') {
    const alertBox = document.getElementById('authAlert');
    if (!alertBox) {
        alert(msg);
        return;
    }
    alertBox.textContent = msg;
    alertBox.className = `p-3 rounded-xl text-xs font-bold text-center mb-4 transition-all duration-300 block ${
        type === 'success' 
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
            : 'bg-red-500/20 text-red-300 border border-red-500/40'
    }`;
}