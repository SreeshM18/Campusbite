# CampusBite Menu Architecture & Data Model Specification

## 1. Top-Level Category Architecture

To support a realistic 100+ dish catalog without cognitive overload, CampusBite establishes an 8-category primary architecture with intuitive secondary subcategories:

| Primary Category ID | Display Label | Subcategories Included | Target Proportion |
| :--- | :--- | :--- | :--- |
| `BREAKFAST` | **Breakfast & Tiffin** | Idli & Vada, Dosa & Uttapam, Pongal & Poori, Egg Specials | ~15% (16 items) |
| `MEALS` | **Meals & Biryani** | South Indian Thali, Rice & Biryani, North Indian Breads & Curries, Indo-Chinese Wok | ~25% (30 items) |
| `FAST_FOOD` | **Burgers & Wraps** | Burgers, Sandwiches, Kathi Rolls & Wraps, 7" Pizzas, French Fries | ~15% (16 items) |
| `SNACKS` | **Snacks & Chaat** | Hot Puffs, Samosas & Vadas, Mumbai & Kolkata Chaat, Fresh Bakery | ~15% (16 items) |
| `BEVERAGES` | **Juices & Shakes** | Fresh Pressed Juices, Milkshakes, Cold Coolers, Filter Coffee & Chai | ~22% (26 items) |
| `DESSERTS` | **Sweets & Ice Cream** | Traditional Sweets, Ice Cream Sundaes, Warm Brownies | ~5% (6 items) |
| `HEALTHY` | **Healthy & Protein** | Seasonal Fruit Bowls, High-Protein Salads, Boiled Eggs | ~3% (4 items) |

---

## 2. Menu Item Schema Definition

```javascript
const menuItemSchema = {
  name: String,               // Trimmed dish title (e.g., "Crispy Masala Dosa", 2-120 chars)
  description: String,        // Human-crafted concise description (3-500 chars)
  price: Number,              // Real campus-friendly price in INR (min: 1)
  category: String,           // Top-level enum: BREAKFAST, MEALS, FAST_FOOD, SNACKS, BEVERAGES, DESSERTS, HEALTHY
  subcategory: String,        // Refined subcategory (e.g., "Fresh Juices", "Rice & Biryani")
  foodType: String,           // VEG or NON_VEG
  image: String,              // Optimized cover asset path
  availabilityStatus: String, // AVAILABLE, SOLD_OUT, UNAVAILABLE (Default: AVAILABLE)
  available: Boolean,         // Synced boolean for backward compatibility (Default: true)
  isArchived: Boolean,        // Soft-delete flag (Default: false)
  preparationTime: Number,    // Estimated preparation & packing duration in minutes (min: 1)
  featured: Boolean,          // Flag for Chef's Daily Express Picks (Default: false)
  mealPeriod: String,         // BREAKFAST, LUNCH, EVENING, ALL_DAY (Default: ALL_DAY)
  spiceLevel: String          // MILD, MEDIUM, SPICY, NONE (Default: NONE)
};
```

---

## 3. Search & Matching Logic

1. **Multi-Field Target**: Matches against `name`, `description`, `category`, and `subcategory`.
2. **Instant Local Indexing**: The student client loads the full active menu in-memory and executes 0ms substring & token matching.
3. **Keyword Synonym Mapping**:
   - `coffee` → matches *Filter Coffee*, *Cold Coffee*, *Dark Chocolate Cold Coffee*.
   - `tea` / `chai` → matches *Masala Chai*, *Ginger Tea*, *Sulaimani Tea*, *Green Tea*.
   - `juice` → matches *Watermelon*, *Mosambi*, *Orange*, *Pineapple*, *Pomegranate*.
   - `biryani` → matches *Veg Dum Biryani*, *Hyderabadi Chicken Biryani*, *Paneer Biryani*, *Egg Biryani*.
   - `dosa` → matches *Masala Dosa*, *Ghee Roast*, *Onion Rava Dosa*, *Podi Dosa*, *Kal Dosa*.
