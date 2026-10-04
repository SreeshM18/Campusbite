// ==========================================================================
// ByteBite — Advanced Menu, Cart, Order Tracker & Audio Engine
// ==========================================================================

// Audio Sound Synthesis Engine (Zero external audio file dependencies)
const soundEngine = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
  },
  playTone(freq, type, duration, startVol = 0.15) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(startVol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone muted/failed', e);
    }
  },
  playAddToCart() {
    this.playTone(520, 'sine', 0.12, 0.2);
    setTimeout(() => this.playTone(780, 'sine', 0.18, 0.2), 80);
  },
  playRemove() {
    this.playTone(400, 'sine', 0.1, 0.15);
    setTimeout(() => this.playTone(280, 'sine', 0.15, 0.15), 60);
  },
  playSuccess() {
    this.playTone(440, 'triangle', 0.15, 0.25);
    setTimeout(() => this.playTone(554, 'triangle', 0.15, 0.25), 100);
    setTimeout(() => this.playTone(659, 'triangle', 0.2, 0.25), 200);
    setTimeout(() => this.playTone(880, 'sine', 0.35, 0.3), 300);
  },
  playNotification() {
    this.playTone(800, 'sine', 0.15, 0.2);
    setTimeout(() => this.playTone(1000, 'sine', 0.25, 0.25), 120);
  }
};

// Categories
const categories = [
  { id: 'all', name: 'All Items', icon: 'fa-utensils' },
  { id: 'meals', name: 'Meals & Biryani', icon: 'fa-bowl-rice' },
  { id: 'snacks', name: 'Snacks & Quick Bites', icon: 'fa-burger' },
  { id: 'beverages', name: 'Beverages & Desserts', icon: 'fa-mug-hot' }
];

// Initial Master Food Dataset
const defaultFoodItems = [
  {
    id: 1,
    name: 'Special Veg Biryani',
    category: 'meals',
    price: 90,
    diet: 'veg',
    tag: 'Bestseller',
    tagColor: 'bg-amber-500',
    prepTime: '8 mins',
    calories: '420 kcal',
    spiceLevel: 2,
    rating: 4.8,
    isAvailable: true,
    description: 'Fragrant basmati rice cooked with fresh seasonal garden veggies, saffron, and aromatic spices. Served with raita.',
    image: 'images/veg_biriyani.jpg'
  },
  {
    id: 2,
    name: 'Hyderabadi Chicken Biryani',
    category: 'meals',
    price: 140,
    diet: 'non-veg',
    tag: 'Chef Special',
    tagColor: 'bg-orange-500',
    prepTime: '10 mins',
    calories: '580 kcal',
    spiceLevel: 3,
    rating: 4.9,
    isAvailable: true,
    description: 'Authentic slow-cooked dum chicken biryani layered with caramelized onions, fresh mint, and tender chicken cuts.',
    image: 'images/chicken_biriyani.jpg'
  },
  {
    id: 3,
    name: 'Crispy Golden French Fries',
    category: 'snacks',
    price: 60,
    diet: 'veg',
    tag: 'Hot & Crisp',
    tagColor: 'bg-red-500',
    prepTime: '5 mins',
    calories: '310 kcal',
    spiceLevel: 1,
    rating: 4.7,
    isAvailable: true,
    description: 'Deep-fried salted potato batons tossed in peri-peri herbs with a cheesy mayo dip.',
    image: 'images/french_fries.jpg'
  },
  {
    id: 4,
    name: 'Mexican Veg Tacos (2 Pcs)',
    category: 'snacks',
    price: 80,
    diet: 'veg',
    tag: 'Popular',
    tagColor: 'bg-blue-500',
    prepTime: '7 mins',
    calories: '340 kcal',
    spiceLevel: 2,
    rating: 4.6,
    isAvailable: true,
    description: 'Crispy corn shells stuffed with refried beans, bell peppers, chipotle salsa, and shredded cheddar cheese.',
    image: 'images/tacos.jpg'
  },
  {
    id: 5,
    name: 'Royal Rasamalai (2 Pcs)',
    category: 'beverages',
    price: 50,
    diet: 'veg',
    tag: 'Sweet Delight',
    tagColor: 'bg-pink-500',
    prepTime: '2 mins',
    calories: '260 kcal',
    spiceLevel: 0,
    rating: 4.9,
    isAvailable: true,
    description: 'Soft cottage cheese patties soaked in chilled, saffron-pistachio flavored thickened milk.',
    image: 'images/rasamalai.jpg'
  },
  {
    id: 6,
    name: 'Belgian Chocolate Ice Cream',
    category: 'beverages',
    price: 40,
    diet: 'veg',
    tag: 'Chilled',
    tagColor: 'bg-cyan-500',
    prepTime: '1 min',
    calories: '220 kcal',
    spiceLevel: 0,
    rating: 4.8,
    isAvailable: true,
    description: 'Rich dark chocolate scoop topped with chocolate fudge sauce and crunchy choco-chips.',
    image: 'images/ice_cream.jpg'
  },
  {
    id: 7,
    name: 'Spicy Crispy Chicken Roll',
    category: 'snacks',
    price: 85,
    diet: 'non-veg',
    tag: 'Spicy Wrap',
    tagColor: 'bg-red-600',
    prepTime: '8 mins',
    calories: '450 kcal',
    spiceLevel: 3,
    rating: 4.7,
    isAvailable: true,
    description: 'Flaky parotta rolled with grilled chicken chunks, sliced red onions, and tangy mint mayo.',
    image: 'images/chicken_roll.jpg'
  },
  {
    id: 8,
    name: 'Cold Coffee with Ice Cream',
    category: 'beverages',
    price: 50,
    diet: 'veg',
    tag: 'Canteen Favorite',
    tagColor: 'bg-cyan-600',
    prepTime: '3 mins',
    calories: '280 kcal',
    spiceLevel: 0,
    rating: 4.9,
    isAvailable: true,
    description: 'Creamy blended espresso coffee served chilled with a scoop of vanilla ice cream and chocolate drizzle.',
    image: 'images/cold_coffee.jpg'
  },
  {
    id: 9,
    name: 'Ghee Podi Idli (3 Pcs)',
    category: 'meals',
    price: 40,
    diet: 'veg',
    tag: 'Healthy',
    tagColor: 'bg-emerald-500',
    prepTime: '4 mins',
    calories: '290 kcal',
    spiceLevel: 1,
    rating: 4.7,
    isAvailable: true,
    description: 'Steamed fluffy rice cakes smeared with pure desi ghee and spiced gun powder. Served with coconut chutney & sambar.',
    image: 'images/idli.jpg'
  },
  {
    id: 10,
    name: 'Crispy Butter Masala Dosa',
    category: 'meals',
    price: 60,
    diet: 'veg',
    tag: 'Bestseller',
    tagColor: 'bg-amber-500',
    prepTime: '6 mins',
    calories: '380 kcal',
    spiceLevel: 1,
    rating: 4.9,
    isAvailable: true,
    description: 'Golden thin crepe filled with spiced mashed potato masala, roasted with butter. Served with 2 chutneys and sambar.',
    image: 'images/masala_dosa.jpg'
  },
  {
    id: 11,
    name: 'Crispy Punjabi Samosa (2 Pcs)',
    category: 'snacks',
    price: 30,
    diet: 'veg',
    tag: 'Hot Snack',
    tagColor: 'bg-red-500',
    prepTime: '3 mins',
    calories: '280 kcal',
    spiceLevel: 2,
    rating: 4.8,
    isAvailable: true,
    description: 'Golden fried crust stuffed with spicy cumin potato and green peas, served with sweet tamarind and spicy mint dip.',
    image: 'images/samosa.jpg'
  },
  {
    id: 12,
    name: 'Crispy Veg Puff Pastry',
    category: 'snacks',
    price: 25,
    diet: 'veg',
    tag: 'Popular',
    tagColor: 'bg-amber-600',
    prepTime: '2 mins',
    calories: '240 kcal',
    spiceLevel: 1,
    rating: 4.6,
    isAvailable: true,
    description: 'Multi-layered flaky bakery pastry filled with spiced curry vegetables.',
    image: 'images/Veg_Puff.jpg'
  }
];

// Initialize LocalStorage Menu Items
function getFoodCatalog() {
  const stored = localStorage.getItem('bytebite_catalog_v3');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem('bytebite_catalog_v3', JSON.stringify(defaultFoodItems));
  return defaultFoodItems;
}

let foodItems = getFoodCatalog();

let reviews = [
  {
    id: 1,
    name: 'Karthik R. (CSE 3rd Yr)',
    dept: 'Computer Science',
    rating: 5,
    comment: 'ByteBite saved me 15 minutes of standing in line every day! Chicken biryani was hot and ready at Counter 2 right on time.'
  },
  {
    id: 2,
    name: 'Sneha M. (ECE 2nd Yr)',
    dept: 'Electronics Engg',
    rating: 5,
    comment: 'The UPI pre-payment and live token tracker work smoothly. Cold Coffee and Samosa combo is unbeatable.'
  },
  {
    id: 3,
    name: 'Dr. Anand (Faculty)',
    dept: 'Mechanical Dept',
    rating: 4,
    comment: 'Very hygienic pickup process and clean digital receipts for staff cafeteria expense claims.'
  }
];

// Application State
let activeCategory = 'all';
let activeDiet = 'all';
let sortBy = 'default';
let searchQuery = '';
let cart = [];
let appliedCoupon = null; // { code: 'CAMPUS10', discountPercent: 10, flat: 0 }
let selectedRating = 5;
let currentTrackingOrderId = null;
let simulatedTrackingTimer = null;

// Initialize ByteBite Portal
document.addEventListener('DOMContentLoaded', () => {
  const user = requireAuth();
  if (!user) return;

  // Header user greeting & details
  const greetEl = document.getElementById('userGreeting');
  if (greetEl) {
    greetEl.innerHTML = `<span class="text-orange-400 font-extrabold">Hi, ${user.name.split(' ')[0]}</span> <span class="text-[10px] text-slate-400 block">${user.department || 'Student'}</span>`;
  }

  // Load active saved cart from localStorage if exists
  const savedCart = localStorage.getItem('bytebite_user_cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      cart = [];
    }
  }

  // Check if there is an ongoing order being tracked
  checkActiveOrderTracker();

  renderCategories();
  renderFoodGrid();
  renderReviews();
  updateCartUI();

  // Listen for storage changes from Admin tab (e.g. status updates or stock toggles)
  window.addEventListener('storage', (e) => {
    if (e.key === 'canteen_orders') {
      checkActiveOrderTracker();
    }
    if (e.key === 'bytebite_catalog') {
      foodItems = getFoodCatalog();
      renderFoodGrid();
    }
  });

  // Background poller every 3s to sync live order status with staff updates
  setInterval(() => {
    checkActiveOrderTracker();
  }, 3000);
});

// Render Category Filter Tabs
function renderCategories() {
  const container = document.getElementById('categoryContainer');
  if (!container) return;

  container.innerHTML = categories.map(cat => {
    const isActive = activeCategory === cat.id;
    return `
      <button 
        onclick="setCategory('${cat.id}')"
        class="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
          isActive 
            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 scale-105' 
            : 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 hover:border-orange-500/40'
        }"
      >
        <i class="fas ${cat.icon} text-xs ${isActive ? 'text-white' : 'text-orange-400'}"></i>
        <span>${cat.name}</span>
      </button>
    `;
  }).join('');
}

function setCategory(catId) {
  activeCategory = catId;
  renderCategories();
  renderFoodGrid();
}

function setDietFilter(diet) {
  activeDiet = diet;
  const allBtn = document.getElementById('dietAllBtn');
  const vegBtn = document.getElementById('dietVegBtn');
  const nonVegBtn = document.getElementById('dietNonVegBtn');

  if (allBtn) allBtn.className = `px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${diet === 'all' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-slate-300 hover:text-white bg-slate-800/80'}`;
  if (vegBtn) vegBtn.className = `px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${diet === 'veg' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'text-slate-300 hover:text-white bg-slate-800/80'}`;
  if (nonVegBtn) nonVegBtn.className = `px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${diet === 'non-veg' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' : 'text-slate-300 hover:text-white bg-slate-800/80'}`;

  renderFoodGrid();
}

function setSortFilter(val) {
  sortBy = val;
  renderFoodGrid();
}

function handleSearch() {
  const input = document.getElementById('searchInput');
  searchQuery = input ? input.value.trim().toLowerCase() : '';
  renderFoodGrid();
}

// Render Food Cards Grid
function renderFoodGrid() {
  const grid = document.getElementById('foodGrid');
  if (!grid) return;

  // Refresh latest stock status from storage
  foodItems = getFoodCatalog();

  let filtered = foodItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesDiet = activeDiet === 'all' || item.diet === activeDiet;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery) ||
                          (item.description && item.description.toLowerCase().includes(searchQuery)) ||
                          (item.tag && item.tag.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesDiet && matchesSearch;
  });

  // Sorting
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'time') {
    filtered.sort((a, b) => parseInt(a.prepTime) - parseInt(b.prepTime));
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const countLabel = document.getElementById('itemCountLabel');
  if (countLabel) {
    countLabel.textContent = `Showing ${filtered.length} freshly prepared items`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center bg-slate-900/80 rounded-3xl border border-slate-800 shadow-xl space-y-3">
        <div class="w-16 h-16 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto text-2xl">
          <i class="fas fa-search-minus"></i>
        </div>
        <h3 class="text-lg font-black text-white">No matching food items found</h3>
        <p class="text-xs text-slate-400 max-w-sm mx-auto">Try changing your search keywords or switching category filters.</p>
        <button onclick="clearAllFilters()" class="mt-2 px-4 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-bold text-xs">
          Reset All Filters
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const cartItem = cart.find(c => c.id === item.id);
    const qty = cartItem ? cartItem.qty : 0;
    const isOutOfStock = item.isAvailable === false;

    // Spice level icons
    const spiceIcons = item.spiceLevel > 0 
      ? Array(item.spiceLevel).fill('<i class="fas fa-pepper-hot text-red-500 text-[10px]"></i>').join('')
      : '';

    return `
      <div class="group rounded-3xl bg-slate-900/85 border border-slate-800/90 hover:border-orange-500/50 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col justify-between relative ${isOutOfStock ? 'opacity-70 grayscale-[0.5]' : ''}">
        
        <div>
          <!-- Card Image Header -->
          <div class="relative h-48 overflow-hidden bg-slate-800">
            <img 
              src="${item.image}" 
              alt="${item.name}" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'"
            />
            
            <!-- Dark Image Vignette -->
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40"></div>

            <!-- Top Badges -->
            <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
              <span class="px-2.5 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider backdrop-blur-md shadow-md ${item.diet === 'veg' ? 'bg-emerald-600/90' : 'bg-rose-600/90'}">
                ${item.diet === 'veg' ? '● Pure Veg' : '● Non-Veg'}
              </span>
              ${item.tag ? `
                <span class="px-2.5 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider ${item.tagColor} shadow-md">
                  ${item.tag}
                </span>
              ` : ''}
            </div>

            <!-- Rating & Prep Badge -->
            <div class="absolute bottom-3 left-3 flex items-center gap-2 z-10">
              <span class="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-black text-amber-300 border border-slate-700/80 flex items-center gap-1">
                <i class="fas fa-star text-amber-400 text-[10px]"></i> ${item.rating || '4.8'}
              </span>
              <span class="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-200 border border-slate-700/80">
                <i class="far fa-clock text-orange-400 mr-1"></i>${item.prepTime}
              </span>
            </div>

            ${isOutOfStock ? `
              <div class="absolute inset-0 bg-slate-950/80 flex items-center justify-center z-20">
                <span class="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-lg">
                  Sold Out Today
                </span>
              </div>
            ` : ''}
          </div>

          <!-- Card Body Content -->
          <div class="p-5 space-y-2.5">
            <div class="flex items-start justify-between gap-2">
              <h3 class="font-black text-white text-base leading-tight group-hover:text-orange-400 transition-colors">
                ${item.name}
              </h3>
              ${spiceIcons ? `<div class="flex items-center gap-0.5 shrink-0" title="Spice Level: ${item.spiceLevel}/3">${spiceIcons}</div>` : ''}
            </div>

            <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              ${item.description || 'Prepared fresh upon order confirmation.'}
            </p>

            <div class="flex items-center justify-between pt-1">
              <div>
                <span class="text-2xl font-black text-orange-400 tracking-tight">₹${item.price}</span>
                <span class="text-[11px] font-semibold text-slate-400 ml-1">(${item.calories})</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Add to Tray Action -->
        <div class="p-5 pt-0">
          ${isOutOfStock ? `
            <button disabled class="w-full py-2.5 rounded-2xl bg-slate-800 text-slate-500 font-black text-xs uppercase tracking-wider cursor-not-allowed">
              Out of Stock
            </button>
          ` : qty === 0 ? `
            <button 
              onclick="addToCart(${item.id})"
              class="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <i class="fas fa-plus text-xs"></i>
              <span>Add to Tray</span>
            </button>
          ` : `
            <div class="flex items-center justify-between bg-slate-800/90 rounded-2xl p-1.5 border border-slate-700 shadow-inner">
              <button onclick="updateQty(${item.id}, -1)" class="w-9 h-9 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold flex items-center justify-center transition-all active:scale-90">
                <i class="fas fa-minus text-xs"></i>
              </button>
              <div class="text-center">
                <span class="font-black text-white text-sm block">${qty}</span>
                <span class="text-[9px] font-bold text-orange-400 uppercase">in tray</span>
              </div>
              <button onclick="updateQty(${item.id}, 1)" class="w-9 h-9 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center justify-center transition-all active:scale-90 shadow-md shadow-orange-500/30">
                <i class="fas fa-plus text-xs"></i>
              </button>
            </div>
          `}
        </div>

      </div>
    `;
  }).join('');
}

function clearAllFilters() {
  activeCategory = 'all';
  activeDiet = 'all';
  sortBy = 'default';
  searchQuery = '';
  const searchEl = document.getElementById('searchInput');
  if (searchEl) searchEl.value = '';
  renderCategories();
  setDietFilter('all');
  renderFoodGrid();
}

// Cart Management & Local Persistence
function saveCart() {
  localStorage.setItem('bytebite_user_cart', JSON.stringify(cart));
}

function addToCart(id) {
  const item = foodItems.find(f => f.id === id);
  if (!item || item.isAvailable === false) {
    showToast('This item is currently out of stock.', 'error');
    return;
  }

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1, note: '' });
  }

  soundEngine.playAddToCart();
  saveCart();
  showToast(`Added "${item.name}" to your tray`);
  updateCartUI();
  renderFoodGrid();
  animateCartBadge();
}

function updateQty(id, delta) {
  const index = cart.findIndex(c => c.id === id);
  if (index !== -1) {
    cart[index].qty += delta;
    if (delta > 0) soundEngine.playAddToCart();
    else soundEngine.playRemove();

    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
  }
  saveCart();
  updateCartUI();
  renderFoodGrid();
  animateCartBadge();
}

function animateCartBadge() {
  const badge = document.getElementById('cartBadgeCount');
  if (badge) {
    badge.classList.remove('badge-bounce');
    void badge.offsetWidth; // trigger reflow
    badge.classList.add('badge-bounce');
  }
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const rawSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Apply Coupon Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((rawSubtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.flat) {
      discountAmount = Math.min(rawSubtotal, appliedCoupon.flat);
    }
  }

  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  // Update Header Badges
  const badge = document.getElementById('cartBadgeCount');
  if (badge) badge.textContent = totalCount;

  // Drawer Totals
  const subtotalEl = document.getElementById('cartSubtotal');
  const discountEl = document.getElementById('cartDiscount');
  const discountRow = document.getElementById('cartDiscountRow');
  const totalEl = document.getElementById('cartTotal');
  const couponTagEl = document.getElementById('appliedCouponBadge');

  if (subtotalEl) subtotalEl.textContent = `₹${rawSubtotal}`;
  if (totalEl) totalEl.textContent = `₹${finalTotal}`;

  if (discountRow) {
    if (discountAmount > 0) {
      discountRow.classList.remove('hidden');
      if (discountEl) discountEl.textContent = `-₹${discountAmount}`;
      if (couponTagEl) couponTagEl.textContent = appliedCoupon.code;
    } else {
      discountRow.classList.add('hidden');
    }
  }

  const listContainer = document.getElementById('cartItemsList');
  if (!listContainer) return;

  if (cart.length === 0) {
    listContainer.innerHTML = `
      <div class="py-16 text-center space-y-4">
        <div class="w-20 h-20 rounded-3xl bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto text-3xl border border-slate-700/60">
          <i class="fas fa-shopping-bag"></i>
        </div>
        <div class="space-y-1">
          <p class="text-base font-black text-white">Your food tray is empty</p>
          <p class="text-xs text-slate-400 max-w-xs mx-auto">Explore today's special canteen menu and pre-order your favorite items!</p>
        </div>
        <button onclick="toggleCartModal()" class="px-5 py-2.5 rounded-2xl bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 text-xs font-black transition-all">
          Browse Menu Now
        </button>
      </div>
    `;
  } else {
    listContainer.innerHTML = cart.map(item => `
      <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
        <div class="flex items-center justify-between gap-3">
          <div class="space-y-0.5 flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full ${item.diet === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
              <h4 class="text-sm font-black text-white truncate">${item.name}</h4>
            </div>
            <div class="text-xs font-bold text-orange-400">
              ₹${item.price} × ${item.qty} = <span class="text-white font-black">₹${item.price * item.qty}</span>
            </div>
          </div>

          <!-- Quantity Controller -->
          <div class="flex items-center gap-1.5 bg-slate-900/90 rounded-xl p-1 border border-slate-700">
            <button onclick="updateQty(${item.id}, -1)" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs transition-all">
              <i class="fas fa-minus"></i>
            </button>
            <span class="font-black text-white text-xs px-2">${item.qty}</span>
            <button onclick="updateQty(${item.id}, 1)" class="w-7 h-7 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center justify-center text-xs transition-all shadow-sm">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>

        <!-- Custom Kitchen Note / Addon Input -->
        <input 
          type="text" 
          placeholder="Special notes (e.g. extra spicy, no onion)..." 
          value="${item.note || ''}" 
          onchange="updateItemNote(${item.id}, this.value)"
          class="w-full px-3 py-1.5 rounded-xl bg-slate-900/70 border border-slate-700/60 text-slate-200 placeholder-slate-500 text-[11px] focus:outline-none focus:border-orange-500 transition-all font-medium"
        />
      </div>
    `).join('');
  }
}

function updateItemNote(id, noteText) {
  const item = cart.find(c => c.id === id);
  if (item) {
    item.note = noteText.trim();
    saveCart();
  }
}

// Coupon / Promo Code Logic
function applyPromoCode() {
  const input = document.getElementById('promoCodeInput');
  const code = input ? input.value.trim().toUpperCase() : '';

  if (!code) {
    showToast('Please enter a coupon code.', 'error');
    return;
  }

  if (code === 'CAMPUS10' || code === 'BYTE10') {
    appliedCoupon = { code: 'CAMPUS10', discountPercent: 10 };
    showToast('🎉 CAMPUS10 applied! 10% discount added.');
  } else if (code === 'BYTE50') {
    appliedCoupon = { code: 'BYTE50', flat: 50 };
    showToast('🎉 BYTE50 applied! Flat ₹50 discount added.');
  } else if (code === 'CHEF20') {
    appliedCoupon = { code: 'CHEF20', discountPercent: 20 };
    showToast('🎉 CHEF20 applied! 20% chef discount added.');
  } else {
    showToast('Invalid or expired coupon code. Try CAMPUS10 or BYTE50', 'error');
    return;
  }

  updateCartUI();
}

function removePromoCode() {
  appliedCoupon = null;
  const input = document.getElementById('promoCodeInput');
  if (input) input.value = '';
  showToast('Coupon removed.');
  updateCartUI();
}

// Cart Drawer Open/Close Modal
function toggleCartModal() {
  const modal = document.getElementById('cartModal');
  const backdrop = document.getElementById('cartBackdrop');
  const panel = document.getElementById('cartPanel');
  if (!modal || !backdrop || !panel) return;

  if (modal.classList.contains('invisible')) {
    modal.classList.remove('invisible');
    setTimeout(() => {
      backdrop.classList.add('opacity-100');
      panel.classList.remove('translate-x-full');
    }, 10);
  } else {
    backdrop.classList.remove('opacity-100');
    panel.classList.add('translate-x-full');
    setTimeout(() => {
      modal.classList.add('invisible');
    }, 300);
  }
}

// Proceed to Payment Modal
let currentSelectedPayment = 'upi';

function setPaymentMethod(method) {
  currentSelectedPayment = method;
  const upiOption = document.getElementById('payOptionUpi');
  const idCardOption = document.getElementById('payOptionIdCard');
  const cashOption = document.getElementById('payOptionCash');

  if (upiOption) upiOption.className = `p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${method === 'upi' ? 'bg-orange-500/10 border-orange-500 text-white shadow-lg' : 'bg-slate-800/80 border-slate-700 text-slate-300'}`;
  if (idCardOption) idCardOption.className = `p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${method === 'idcard' ? 'bg-orange-500/10 border-orange-500 text-white shadow-lg' : 'bg-slate-800/80 border-slate-700 text-slate-300'}`;
  if (cashOption) cashOption.className = `p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${method === 'cash' ? 'bg-orange-500/10 border-orange-500 text-white shadow-lg' : 'bg-slate-800/80 border-slate-700 text-slate-300'}`;

  // Toggle UPI QR container view
  const upiQrBox = document.getElementById('upiQrSection');
  if (upiQrBox) {
    if (method === 'upi') upiQrBox.classList.remove('hidden');
    else upiQrBox.classList.add('hidden');
  }
}

function proceedToPayment() {
  if (cart.length === 0) {
    showToast('Add items to your tray before proceeding to checkout!', 'error');
    return;
  }

  const rawSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) discountAmount = Math.round((rawSubtotal * appliedCoupon.discountPercent) / 100);
    else if (appliedCoupon.flat) discountAmount = Math.min(rawSubtotal, appliedCoupon.flat);
  }
  const total = Math.max(0, rawSubtotal - discountAmount);

  const totalDisplay = document.getElementById('paymentModalTotal');
  if (totalDisplay) totalDisplay.textContent = `₹${total}`;

  // Close drawer, open payment modal
  toggleCartModal();

  const paymentModal = document.getElementById('paymentModal');
  if (paymentModal) {
    paymentModal.classList.remove('hidden');
    paymentModal.classList.add('flex');
  }
}

function closePaymentModal() {
  const paymentModal = document.getElementById('paymentModal');
  if (paymentModal) {
    paymentModal.classList.add('hidden');
    paymentModal.classList.remove('flex');
  }
}

// Confirm Order & Generate Live Token
function confirmOrderPayment() {
  if (cart.length === 0) {
    showToast('Your tray is empty!', 'error');
    return;
  }

  const user = JSON.parse(localStorage.getItem('canteen_session') || 'null');
  if (!user || !user.userId) {
    showToast('Please log in before placing an order.', 'error');
    window.location.href = 'login.html';
    return;
  }

  const rawSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) discountAmount = Math.round((rawSubtotal * appliedCoupon.discountPercent) / 100);
    else if (appliedCoupon.flat) discountAmount = Math.min(rawSubtotal, appliedCoupon.flat);
  }
  const total = Math.max(0, rawSubtotal - discountAmount);

  const pickupSelect = document.getElementById('pickupTimeSelect');
  const pickupTime = pickupSelect ? pickupSelect.value : 'Immediate (~5-8 mins)';

  // Build New Order Record
  const newOrderId = Date.now();
  const tokenNumber = String(newOrderId).slice(-4);

  const order = {
    orderId: newOrderId,
    token: tokenNumber,
    userId: user.userId,
    userName: user.name,
    userEmail: user.email,
    department: user.department || 'Student',
    subtotal: rawSubtotal,
    discount: discountAmount,
    coupon: appliedCoupon ? appliedCoupon.code : null,
    totalAmount: total,
    status: 'PENDING', // PENDING -> PREPARING -> READY_FOR_PICKUP -> COMPLETED
    paymentMethod: currentSelectedPayment.toUpperCase(),
    pickupTime: pickupTime,
    counterNumber: 'Counter 2 (Express Food Bar)',
    createdAt: new Date().toISOString(),
    items: cart.map(item => ({
      itemId: item.id,
      name: item.name,
      quantity: item.qty,
      price: item.price,
      note: item.note || '',
      diet: item.diet
    }))
  };

  // Save to master orders list in localStorage
  const allOrders = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
  allOrders.push(order);
  localStorage.setItem('canteen_orders', JSON.stringify(allOrders));

  // Play celebration sound & confetti
  soundEngine.playSuccess();
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

  // Reset cart
  cart = [];
  appliedCoupon = null;
  saveCart();
  updateCartUI();
  renderFoodGrid();

  closePaymentModal();

  // Open Live Tracker for this order immediately
  openOrderTracker(newOrderId);
  showToast(`🎉 Order Placed! Token #${tokenNumber} is now live.`);
}

// ── Live Order Tracker System ──
function checkActiveOrderTracker() {
  const user = JSON.parse(localStorage.getItem('canteen_session') || 'null');
  if (!user) return;

  const orders = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
  // Find latest non-completed order for this user
  const activeOrder = orders.slice().reverse().find(o => o.userId === user.userId && o.status !== 'COMPLETED');

  const banner = document.getElementById('liveOrderStickyBanner');
  if (activeOrder) {
    currentTrackingOrderId = activeOrder.orderId;
    if (banner) {
      banner.classList.remove('hidden');
      document.getElementById('bannerTokenNum').textContent = `#${activeOrder.token || String(activeOrder.orderId).slice(-4)}`;
      document.getElementById('bannerStatusLabel').textContent = formatStatusName(activeOrder.status);
      document.getElementById('bannerStatusPill').className = `px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusBadgeClass(activeOrder.status)}`;
    }

    // If tracker modal is open for this order, refresh its view
    const trackerModal = document.getElementById('orderTrackerModal');
    if (trackerModal && !trackerModal.classList.contains('hidden')) {
      renderTrackerModalContent(activeOrder);
    }
  } else {
    if (banner) banner.classList.add('hidden');
  }
}

function formatStatusName(status) {
  if (status === 'PENDING') return '1. Order Received by Kitchen';
  if (status === 'PREPARING') return '2. Chef is Preparing in Kitchen';
  if (status === 'READY_FOR_PICKUP') return '3. Ready at Counter 2!';
  if (status === 'COMPLETED') return '4. Collected & Completed';
  return status;
}

function getStatusBadgeClass(status) {
  if (status === 'PENDING') return 'bg-amber-500 text-slate-950';
  if (status === 'PREPARING') return 'bg-blue-500 text-white animate-pulse';
  if (status === 'READY_FOR_PICKUP') return 'bg-emerald-500 text-white pulse-glow';
  return 'bg-slate-700 text-slate-300';
}

function openOrderTracker(orderId) {
  const orders = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
  const order = orders.find(o => o.orderId === (orderId || currentTrackingOrderId));

  if (!order) {
    showToast('No active orders found.', 'error');
    return;
  }

  currentTrackingOrderId = order.orderId;
  renderTrackerModalContent(order);

  const trackerModal = document.getElementById('orderTrackerModal');
  if (trackerModal) {
    trackerModal.classList.remove('hidden');
    trackerModal.classList.add('flex');
  }
}

function closeOrderTracker() {
  const trackerModal = document.getElementById('orderTrackerModal');
  if (trackerModal) {
    trackerModal.classList.add('hidden');
    trackerModal.classList.remove('flex');
  }
}

function renderTrackerModalContent(order) {
  const token = order.token || String(order.orderId).slice(-4);
  document.getElementById('trackerTokenNumber').textContent = `#${token}`;
  document.getElementById('trackerPickupCounter').textContent = order.counterNumber || 'Counter 2 (Express)';
  document.getElementById('trackerPickupTime').textContent = order.pickupTime || 'Immediate';
  document.getElementById('trackerOrderTotal').textContent = `₹${order.totalAmount}`;

  // Steps Progress State
  const steps = [
    { id: 'step-1', statusKey: 'PENDING', label: 'Order Received', desc: 'Ticket sent to kitchen screen' },
    { id: 'step-2', statusKey: 'PREPARING', label: 'In Preparation', desc: 'Chef is cooking & packaging' },
    { id: 'step-3', statusKey: 'READY_FOR_PICKUP', label: 'Ready for Pickup', desc: 'Display at Counter 2' },
    { id: 'step-4', statusKey: 'COMPLETED', label: 'Collected', desc: 'Meal collected with token' }
  ];

  const statusOrder = ['PENDING', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED'];
  const currentIndex = statusOrder.indexOf(order.status);

  steps.forEach((s, idx) => {
    const iconEl = document.getElementById(`stepIcon-${idx + 1}`);
    const textEl = document.getElementById(`stepText-${idx + 1}`);
    const lineEl = document.getElementById(`stepLine-${idx + 1}`);

    if (idx < currentIndex) {
      // Completed step
      if (iconEl) iconEl.className = 'w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-500/30';
      if (iconEl) iconEl.innerHTML = '<i class="fas fa-check"></i>';
      if (textEl) textEl.className = 'text-xs font-black text-emerald-400';
      if (lineEl) lineEl.className = 'w-0.5 sm:w-16 h-8 sm:h-0.5 bg-emerald-500 transition-all';
    } else if (idx === currentIndex) {
      // Active step
      if (iconEl) iconEl.className = 'w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-orange-500/50 pulse-glow ring-4 ring-orange-500/20';
      if (iconEl) iconEl.innerHTML = `<i class="fas ${idx === 1 ? 'fa-fire-burner' : idx === 2 ? 'fa-bell' : 'fa-spinner fa-spin'}"></i>`;
      if (textEl) textEl.className = 'text-xs font-black text-orange-400';
      if (lineEl) lineEl.className = 'w-0.5 sm:w-16 h-8 sm:h-0.5 bg-slate-700 transition-all';
    } else {
      // Future step
      if (iconEl) iconEl.className = 'w-10 h-10 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center font-black text-sm border border-slate-700';
      if (iconEl) iconEl.innerHTML = `<span>${idx + 1}</span>`;
      if (textEl) textEl.className = 'text-xs font-bold text-slate-500';
      if (lineEl) lineEl.className = 'w-0.5 sm:w-16 h-8 sm:h-0.5 bg-slate-800 transition-all';
    }
  });

  // Items list in tracker
  const itemsContainer = document.getElementById('trackerItemsSummary');
  if (itemsContainer) {
    itemsContainer.innerHTML = order.items.map(i => `
      <div class="flex items-center justify-between py-1 text-xs">
        <span class="text-slate-300 font-bold">${i.name} × ${i.quantity}</span>
        <span class="text-slate-400 font-semibold">₹${i.price * i.quantity}</span>
      </div>
    `).join('');
  }
}

// Order History & Digital Invoice
function openOrderHistoryModal() {
  const user = JSON.parse(localStorage.getItem('canteen_session') || 'null');
  if (!user) return;

  const orders = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
  const userOrders = orders.filter(o => o.userId === user.userId).reverse();

  const container = document.getElementById('orderHistoryList');
  if (container) {
    if (userOrders.length === 0) {
      container.innerHTML = `
        <div class="py-12 text-center text-slate-400 space-y-2">
          <i class="fas fa-receipt text-3xl text-slate-600"></i>
          <p class="text-xs font-bold">You have not placed any pre-orders yet.</p>
        </div>
      `;
    } else {
      container.innerHTML = userOrders.map(o => {
        const token = o.token || String(o.orderId).slice(-4);
        const dateStr = new Date(o.createdAt).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short'
        });
        const itemsStr = o.items.map(i => `${i.name} (${i.quantity})`).join(', ');

        return `
          <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm font-black text-white">Token #${token}</span>
                <span class="text-[11px] text-slate-400 block">${dateStr}</span>
              </div>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusBadgeClass(o.status)}">
                ${o.status.replace(/_/g, ' ')}
              </span>
            </div>

            <p class="text-xs text-slate-300 font-medium line-clamp-1">${itemsStr}</p>

            <div class="flex items-center justify-between pt-2 border-t border-slate-700/60">
              <span class="text-sm font-black text-orange-400">Total: ₹${o.totalAmount}</span>
              <div class="flex items-center gap-2">
                <button onclick="viewDigitalReceipt(${o.orderId})" class="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold transition-all flex items-center gap-1">
                  <i class="fas fa-file-invoice text-orange-400"></i> Invoice
                </button>
                <button onclick="reorderPastItems(${o.orderId})" class="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all flex items-center gap-1">
                  <i class="fas fa-rotate-right"></i> Re-Order
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  const modal = document.getElementById('orderHistoryModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeOrderHistoryModal() {
  const modal = document.getElementById('orderHistoryModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Re-order past items helper
function reorderPastItems(orderId) {
  const orders = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
  const order = orders.find(o => o.orderId === orderId);
  if (!order) return;

  order.items.forEach(item => {
    const existing = cart.find(c => c.id === item.itemId);
    if (existing) {
      existing.qty += item.quantity;
    } else {
      cart.push({
        id: item.itemId,
        name: item.name,
        price: item.price,
        qty: item.quantity,
        diet: item.diet || 'veg',
        note: item.note || ''
      });
    }
  });

  saveCart();
  updateCartUI();
  renderFoodGrid();
  closeOrderHistoryModal();
  toggleCartModal();
  showToast(`Added ${order.items.length} past items to your tray!`);
}

// Digital Printable Receipt Modal
function viewDigitalReceipt(orderId) {
  const orders = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
  const order = orders.find(o => o.orderId === (orderId || currentTrackingOrderId));
  if (!order) return;

  const token = order.token || String(order.orderId).slice(-4);
  const dateStr = new Date(order.createdAt).toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  document.getElementById('receiptTokenNum').textContent = `#${token}`;
  document.getElementById('receiptCustomerName').textContent = order.userName || 'Student';
  document.getElementById('receiptDateTime').textContent = dateStr;
  document.getElementById('receiptPaymentMethod').textContent = order.paymentMethod || 'UPI';
  document.getElementById('receiptCounter').textContent = order.counterNumber || 'Counter 2 (Express)';
  document.getElementById('receiptGrandTotal').textContent = `₹${order.totalAmount}`;

  const receiptItems = document.getElementById('receiptTableRows');
  if (receiptItems) {
    receiptItems.innerHTML = order.items.map(i => `
      <tr class="border-b border-slate-700/40">
        <td class="py-2 text-left font-bold text-slate-100">${i.name}</td>
        <td class="py-2 text-center text-slate-300">${i.quantity}</td>
        <td class="py-2 text-right text-slate-300">₹${i.price}</td>
        <td class="py-2 text-right font-black text-slate-100">₹${i.price * i.quantity}</td>
      </tr>
    `).join('');
  }

  const receiptModal = document.getElementById('receiptModal');
  if (receiptModal) {
    receiptModal.classList.remove('hidden');
    receiptModal.classList.add('flex');
  }
}

function closeReceiptModal() {
  const receiptModal = document.getElementById('receiptModal');
  if (receiptModal) {
    receiptModal.classList.add('hidden');
    receiptModal.classList.remove('flex');
  }
}

function printReceipt() {
  window.print();
}

// ── Customer Reviews ──
function renderReviews() {
  const grid = document.getElementById('reviewsGrid');
  if (!grid) return;

  grid.innerHTML = reviews.map(rev => `
    <div class="p-5 rounded-3xl bg-slate-900/85 border border-slate-800/90 shadow-xl flex flex-col justify-between space-y-4 hover:border-orange-500/30 transition-all">
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex text-amber-400 text-xs gap-1">
            ${Array(rev.rating).fill('<i class="fas fa-star"></i>').join('')}
          </div>
          <span class="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Verified Order
          </span>
        </div>
        <p class="text-xs text-slate-300 font-medium leading-relaxed italic">
          "${rev.comment}"
        </p>
      </div>

      <div class="flex items-center gap-3 pt-2 border-t border-slate-800">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-black text-xs flex items-center justify-center">
          ${rev.name.charAt(0)}
        </div>
        <div>
          <span class="text-xs font-black text-slate-200 block">${rev.name}</span>
          <span class="text-[10px] text-slate-400">${rev.dept || 'Campus Member'}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function openReviewModal() {
  const modal = document.getElementById('reviewModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeReviewModal() {
  const modal = document.getElementById('reviewModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function setReviewRating(rating) {
  selectedRating = rating;
  const stars = document.querySelectorAll('#starRatingInput button');
  stars.forEach((btn, index) => {
    btn.className = index < rating ? 'text-amber-400 transition-colors text-lg' : 'text-slate-600 hover:text-amber-400 transition-colors text-lg';
  });
}

function submitReview(e) {
  if (e) e.preventDefault();
  const user = JSON.parse(localStorage.getItem('canteen_session') || 'null');
  const name = document.getElementById('reviewerName')?.value || user?.name || 'Anonymous Student';
  const comment = document.getElementById('reviewerComment')?.value;

  if (!comment) {
    showToast('Please write a brief comment.', 'error');
    return;
  }

  reviews.unshift({
    id: Date.now(),
    name: name,
    dept: user?.department || 'Student',
    rating: selectedRating,
    comment: comment
  });

  renderReviews();
  closeReviewModal();
  soundEngine.playSuccess();
  confetti({ particleCount: 50, spread: 50 });
  showToast('Thank you for sharing your feedback with ByteBite!');
}

// ── Support Modal ──
function openSupportModal() {
  const modal = document.getElementById('supportModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeSupportModal() {
  const modal = document.getElementById('supportModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function submitSupportForm(e) {
  if (e) e.preventDefault();
  closeSupportModal();
  soundEngine.playSuccess();
  showToast('Inquiry received! Canteen desk will assist at Counter 2.');
}

// ── Toast Notification System ──
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `p-4 rounded-2xl text-xs font-black text-white shadow-2xl flex items-center gap-3 pointer-events-auto transition-all transform duration-300 backdrop-blur-xl ${
    type === 'error' 
      ? 'bg-red-900/90 border border-red-700 shadow-red-950/50' 
      : 'bg-slate-900/95 border border-slate-700 shadow-black/80'
  }`;

  toast.innerHTML = `
    <div class="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}">
      <i class="${type === 'error' ? 'fas fa-triangle-exclamation' : 'fas fa-check-circle'}"></i>
    </div>
    <span class="flex-1">${msg}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}