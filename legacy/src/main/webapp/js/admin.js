// ==========================================================================
// ByteBite — Staff & Kitchen Admin Controller
// ==========================================================================

let activeTab = 'orders'; // 'orders' | 'menu'
let statusFilter = 'ALL';
let searchKeyword = '';
let soundAlertsEnabled = true;
let previousOrderCount = 0;

// Sound Synthesizer for Staff Alerts
const adminAudio = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
  },
  playNewOrderChime() {
    if (!soundAlertsEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.setValueAtTime(880.00, now + 0.15); // A5

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.15);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn('Audio alert muted', e);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const staff = requireAuth('CANTEEN_STAFF');
  if (staff) {
    const staffNameEl = document.getElementById('staffName');
    if (staffNameEl) staffNameEl.textContent = staff.name;
  }

  loadOrders();
  loadMenuItems();

  // Storage listener for cross-tab sync
  window.addEventListener('storage', (e) => {
    if (e.key === 'canteen_orders') {
      loadOrders();
    }
  });

  // Auto-polling every 2.5s for live order stream
  setInterval(() => {
    loadOrders(true);
  }, 2500);
});

// Switch Admin Tabs
function switchAdminTab(tab) {
  activeTab = tab;
  const ordersTabBtn = document.getElementById('tabBtnOrders');
  const menuTabBtn = document.getElementById('tabBtnMenu');
  const ordersSection = document.getElementById('adminOrdersSection');
  const menuSection = document.getElementById('adminMenuSection');

  if (tab === 'orders') {
    if (ordersTabBtn) ordersTabBtn.className = 'px-4 py-2.5 rounded-xl font-black text-xs bg-orange-500 text-white shadow-md shadow-orange-500/20';
    if (menuTabBtn) menuTabBtn.className = 'px-4 py-2.5 rounded-xl font-bold text-xs text-slate-400 hover:text-white hover:bg-slate-800';
    if (ordersSection) ordersSection.classList.remove('hidden');
    if (menuSection) menuSection.classList.add('hidden');
    loadOrders();
  } else {
    if (ordersTabBtn) ordersTabBtn.className = 'px-4 py-2.5 rounded-xl font-bold text-xs text-slate-400 hover:text-white hover:bg-slate-800';
    if (menuTabBtn) menuTabBtn.className = 'px-4 py-2.5 rounded-xl font-black text-xs bg-orange-500 text-white shadow-md shadow-orange-500/20';
    if (ordersSection) ordersSection.classList.add('hidden');
    if (menuSection) menuSection.classList.remove('hidden');
    loadMenuItems();
  }
}

function toggleSoundAlerts() {
  soundAlertsEnabled = !soundAlertsEnabled;
  const soundIcon = document.getElementById('soundToggleIcon');
  const soundLabel = document.getElementById('soundToggleLabel');
  if (soundAlertsEnabled) {
    if (soundIcon) soundIcon.className = 'fas fa-volume-high text-emerald-400';
    if (soundLabel) soundLabel.textContent = 'Audio Alerts: ON';
    adminAudio.playNewOrderChime();
  } else {
    if (soundIcon) soundIcon.className = 'fas fa-volume-xmark text-slate-500';
    if (soundLabel) soundLabel.textContent = 'Audio Alerts: OFF';
  }
}

// ── Orders Management ──

const STATUS_FLOW = {
  'PENDING': 'PREPARING',
  'PREPARING': 'READY_FOR_PICKUP',
  'READY_FOR_PICKUP': 'COMPLETED',
  'COMPLETED': null
};

const STATUS_ACTION_CONFIG = {
  'PENDING': {
    label: 'Start Cooking',
    icon: 'fa-fire-burner',
    btnClass: 'bg-blue-600 hover:bg-blue-500 text-white'
  },
  'PREPARING': {
    label: 'Call to Counter (Ready)',
    icon: 'fa-bell',
    btnClass: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
  },
  'READY_FOR_PICKUP': {
    label: 'Mark Collected',
    icon: 'fa-circle-check',
    btnClass: 'bg-purple-600 hover:bg-purple-500 text-white'
  },
  'COMPLETED': {
    label: 'Done ✓',
    icon: 'fa-check',
    btnClass: 'bg-slate-800 text-slate-500 cursor-default'
  }
};

function getOrders() {
  return JSON.parse(localStorage.getItem('canteen_orders') || '[]');
}

function saveOrders(orders) {
  localStorage.setItem('canteen_orders', JSON.stringify(orders));
}

function setOrderStatusFilter(status) {
  statusFilter = status;
  const tabs = ['ALL', 'ACTIVE', 'PENDING', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED'];
  tabs.forEach(t => {
    const btn = document.getElementById(`filterBtn-${t}`);
    if (btn) {
      btn.className = (t === status)
        ? 'px-3.5 py-1.5 rounded-xl text-xs font-black bg-orange-500 text-white shadow-md'
        : 'px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800';
    }
  });
  loadOrders();
}

function handleOrderSearch(val) {
  searchKeyword = (val || '').trim().toLowerCase();
  loadOrders();
}

function loadOrders(isPolling = false) {
  const allOrders = getOrders();
  
  // Audio chime if new incoming orders arrived while polling
  if (isPolling && allOrders.length > previousOrderCount) {
    adminAudio.playNewOrderChime();
  }
  previousOrderCount = allOrders.length;

  // Calculate Metrics
  const totalCount = allOrders.length;
  const pendingCount = allOrders.filter(o => o.status === 'PENDING').length;
  const preparingCount = allOrders.filter(o => o.status === 'PREPARING').length;
  const readyCount = allOrders.filter(o => o.status === 'READY_FOR_PICKUP').length;
  const completedCount = allOrders.filter(o => o.status === 'COMPLETED').length;
  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Update Stats Cards
  const statTotal = document.getElementById('statTotal');
  const statPending = document.getElementById('statPending');
  const statPreparing = document.getElementById('statPreparing');
  const statReady = document.getElementById('statReady');
  const statRevenue = document.getElementById('statRevenue');
  const orderCountLabel = document.getElementById('orderCountLabel');

  if (statTotal) statTotal.textContent = totalCount;
  if (statPending) statPending.textContent = pendingCount;
  if (statPreparing) statPreparing.textContent = preparingCount;
  if (statReady) statReady.textContent = readyCount;
  if (statRevenue) statRevenue.textContent = `₹${totalRevenue}`;
  if (orderCountLabel) orderCountLabel.textContent = `${totalCount} orders placed today`;

  // Filter Orders
  let displayOrders = allOrders.slice().reverse(); // newest first

  if (statusFilter === 'ACTIVE') {
    displayOrders = displayOrders.filter(o => o.status === 'PENDING' || o.status === 'PREPARING' || o.status === 'READY_FOR_PICKUP');
  } else if (statusFilter !== 'ALL') {
    displayOrders = displayOrders.filter(o => o.status === statusFilter);
  }

  if (searchKeyword) {
    displayOrders = displayOrders.filter(o => {
      const token = String(o.token || o.orderId);
      const name = (o.userName || '').toLowerCase();
      const items = (o.items || []).map(i => i.name.toLowerCase()).join(' ');
      return token.includes(searchKeyword) || name.includes(searchKeyword) || items.includes(searchKeyword);
    });
  }

  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  if (displayOrders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-16 text-slate-400">
          <div class="w-16 h-16 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto text-2xl mb-3 border border-slate-700">
            <i class="fas fa-clipboard-list"></i>
          </div>
          <p class="text-sm font-black text-white">No matching orders found</p>
          <p class="text-xs text-slate-500 mt-0.5">Incoming student pre-orders will appear here automatically.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = displayOrders.map(o => {
    const token = o.token || String(o.orderId).slice(-4);
    const time = new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const itemsHtml = o.items.map(i => `
      <div class="text-xs text-slate-200 font-medium">
        <strong class="text-white font-black">${i.quantity}×</strong> ${i.name}
        ${i.note ? `<span class="block text-[10px] text-amber-400 italic">Note: ${i.note}</span>` : ''}
      </div>
    `).join('');

    const nextStatus = STATUS_FLOW[o.status];
    const actionConfig = STATUS_ACTION_CONFIG[o.status] || STATUS_ACTION_CONFIG['COMPLETED'];

    // Status Badge Style
    let badgeClass = 'bg-slate-800 text-slate-300';
    if (o.status === 'PENDING') badgeClass = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    if (o.status === 'PREPARING') badgeClass = 'bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse';
    if (o.status === 'READY_FOR_PICKUP') badgeClass = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black';
    if (o.status === 'COMPLETED') badgeClass = 'bg-slate-800 text-slate-500';

    return `
      <tr class="border-b border-slate-800/80 hover:bg-slate-800/40 transition-colors">
        <td class="py-4 px-4 font-mono font-black text-base text-orange-400">
          #${token}
        </td>
        <td class="py-4 px-4">
          <span class="text-xs font-black text-white block">${o.userName || 'Student'}</span>
          <span class="text-[10px] text-slate-400">${o.department || 'Campus'}</span>
        </td>
        <td class="py-4 px-4 max-w-xs space-y-1">
          ${itemsHtml}
        </td>
        <td class="py-4 px-4 font-mono font-black text-sm text-slate-100">
          ₹${o.totalAmount}
        </td>
        <td class="py-4 px-4 text-xs font-semibold text-amber-300">
          ${o.pickupTime || 'Immediate'}
        </td>
        <td class="py-4 px-4 text-xs text-slate-400 font-mono">
          ${time}
        </td>
        <td class="py-4 px-4">
          <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${badgeClass}">
            ${o.status.replace(/_/g, ' ')}
          </span>
        </td>
        <td class="py-4 px-4 text-right">
          ${nextStatus ? `
            <button 
              onclick="advanceOrderStatus(${o.orderId})"
              class="px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md ${actionConfig.btnClass}"
            >
              <i class="fas ${actionConfig.icon}"></i>
              <span>${actionConfig.label}</span>
            </button>
          ` : `
            <span class="text-xs font-bold text-slate-500">Collected ✓</span>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

function advanceOrderStatus(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.orderId === orderId);
  if (!order) return;

  const next = STATUS_FLOW[order.status];
  if (!next) return;

  order.status = next;
  saveOrders(orders);
  loadOrders();
}

// ── Menu Catalog & Stock Availability Management ──

function loadMenuItems() {
  const stored = localStorage.getItem('bytebite_catalog_v3');
  let items = [];
  if (stored) {
    try { items = JSON.parse(stored); } catch (e) { items = []; }
  }

  const tbody = document.getElementById('menuTableBody');
  if (!tbody) return;

  tbody.innerHTML = items.map(item => `
    <tr class="border-b border-slate-800/80 hover:bg-slate-800/40 transition-colors">
      <td class="py-4 px-4">
        <div class="flex items-center gap-3">
          <img src="${item.image}" alt="${item.name}" class="w-10 h-10 rounded-xl object-cover border border-slate-700" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'" />
          <div>
            <span class="text-xs font-black text-white block">${item.name}</span>
            <span class="text-[10px] text-slate-400 uppercase tracking-wider">${item.category}</span>
          </div>
        </div>
      </td>
      <td class="py-4 px-4">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${item.diet === 'veg' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">
          ${item.diet === 'veg' ? 'Pure Veg' : 'Non-Veg'}
        </span>
      </td>
      <td class="py-4 px-4 font-mono font-black text-sm text-orange-400">
        ₹${item.price}
      </td>
      <td class="py-4 px-4 text-xs font-semibold text-slate-300">
        ${item.prepTime}
      </td>
      <td class="py-4 px-4">
        <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.isAvailable !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">
          ${item.isAvailable !== false ? 'In Stock' : 'Sold Out'}
        </span>
      </td>
      <td class="py-4 px-4 text-right">
        <button 
          onclick="toggleItemStock(${item.id})"
          class="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
            item.isAvailable !== false 
              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30' 
              : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
          }"
        >
          ${item.isAvailable !== false ? 'Mark Out of Stock' : 'Mark Available'}
        </button>
      </td>
    </tr>
  `).join('');
}

function toggleItemStock(itemId) {
  const stored = localStorage.getItem('bytebite_catalog_v3');
  if (!stored) return;

  const items = JSON.parse(stored);
  const target = items.find(i => i.id === itemId);
  if (target) {
    target.isAvailable = target.isAvailable === false ? true : false;
    localStorage.setItem('bytebite_catalog_v3', JSON.stringify(items));
    loadMenuItems();
  }
}