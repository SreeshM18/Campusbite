import { MenuItem } from '../models/MenuItem.js';

// Allowed categories for validation
const VALID_CATEGORIES = ['BREAKFAST', 'MEALS', 'FAST_FOOD', 'SNACKS', 'BEVERAGES', 'DESSERTS', 'HEALTHY'];
const VALID_FOOD_TYPES = ['VEG', 'NON_VEG'];
const VALID_AVAILABILITY = ['AVAILABLE', 'SOLD_OUT', 'UNAVAILABLE'];

// @desc    Get public menu items for students / customer catalog
// @route   GET /api/menu
// @access  Public
export const getMenuItems = async (req, res, next) => {
  try {
    const { category, foodType, search, available, featured } = req.query;

    // By default, customer menu hides archived items and items marked UNAVAILABLE
    const query = {
      isArchived: { $ne: true },
      availabilityStatus: { $ne: 'UNAVAILABLE' }
    };

    // Filter by category
    if (category && category.toUpperCase() !== 'ALL') {
      query.category = category.toUpperCase();
    }

    // Filter by foodType (VEG / NON_VEG)
    if (foodType && foodType.toUpperCase() !== 'ALL') {
      query.foodType = foodType.toUpperCase();
    }

    // Filter by availability (if explicitly queried)
    if (available !== undefined) {
      query.available = available === 'true';
    }

    // Filter featured
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Search query
    if (search && search.trim() !== '') {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { subcategory: { $regex: term, $options: 'i' } }
      ];
    }

    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });

    return res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all menu items and operational metrics for staff management
// @route   GET /api/menu/staff
// @access  Private (Staff only)
export const getStaffMenuItems = async (req, res, next) => {
  try {
    const { category, foodType, search, availabilityStatus, featured, archived } = req.query;

    const query = {};

    // Filter archived items
    if (archived === 'true') {
      query.isArchived = true;
    } else if (archived === 'all') {
      // Return both active and archived
    } else {
      query.isArchived = { $ne: true };
    }

    if (category && category.toUpperCase() !== 'ALL') {
      query.category = category.toUpperCase();
    }

    if (foodType && foodType.toUpperCase() !== 'ALL') {
      query.foodType = foodType.toUpperCase();
    }

    if (availabilityStatus && availabilityStatus.toUpperCase() !== 'ALL') {
      query.availabilityStatus = availabilityStatus.toUpperCase();
    }

    if (featured !== undefined && featured !== 'ALL') {
      query.featured = featured === 'true';
    }

    if (search && search.trim() !== '') {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { subcategory: { $regex: term, $options: 'i' } }
      ];
    }

    const [items, allItems] = await Promise.all([
      MenuItem.find(query).sort({ updatedAt: -1, createdAt: -1 }),
      MenuItem.find({ isArchived: { $ne: true } })
    ]);

    // Compute live inventory metrics
    let availableCount = 0;
    let soldOutCount = 0;
    let unavailableCount = 0;
    let featuredCount = 0;
    const categoryCounts = {};

    allItems.forEach((item) => {
      if (item.availabilityStatus === 'AVAILABLE') availableCount++;
      else if (item.availabilityStatus === 'SOLD_OUT') soldOutCount++;
      else if (item.availabilityStatus === 'UNAVAILABLE') unavailableCount++;

      if (item.featured) featuredCount++;

      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    const archivedCount = await MenuItem.countDocuments({ isArchived: true });

    return res.status(200).json({
      success: true,
      count: items.length,
      stats: {
        totalItems: allItems.length,
        availableCount,
        soldOutCount,
        unavailableCount,
        featuredCount,
        archivedCount,
        categoryCounts
      },
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single menu item by ID
// @route   GET /api/menu/:id
// @access  Public
export const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new menu item with strict server-side validation & whitelisting
// @route   POST /api/menu
// @access  Private (Staff only)
export const createMenuItem = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subcategory,
      foodType,
      image,
      availabilityStatus,
      available,
      preparationTime,
      featured,
      mealPeriod,
      spiceLevel
    } = req.body;

    const errors = {};

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.name = 'Dish name is required and must be at least 2 characters.';
    }

    // Validate description
    if (!description || typeof description !== 'string' || description.trim().length < 3) {
      errors.description = 'Description is required and must be at least 3 characters.';
    }

    // Validate price
    const parsedPrice = Number(price);
    if (price === undefined || isNaN(parsedPrice) || parsedPrice <= 0) {
      errors.price = 'Price must be a valid positive number greater than ₹0.';
    }

    // Validate category
    const catUpper = category ? category.toUpperCase() : '';
    if (!catUpper || !VALID_CATEGORIES.includes(catUpper)) {
      errors.category = `Category must be one of: ${VALID_CATEGORIES.join(', ')}`;
    }

    // Validate foodType
    const typeUpper = foodType ? foodType.toUpperCase() : 'VEG';
    if (!VALID_FOOD_TYPES.includes(typeUpper)) {
      errors.foodType = 'Food type must be either VEG or NON_VEG.';
    }

    // Validate prep time
    const parsedPrepTime = preparationTime ? Number(preparationTime) : 10;
    if (isNaN(parsedPrepTime) || parsedPrepTime < 1) {
      errors.preparationTime = 'Preparation time must be at least 1 minute.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for new menu item.',
        errors
      });
    }

    // Determine initial availability
    let finalAvailability = 'AVAILABLE';
    if (availabilityStatus && VALID_AVAILABILITY.includes(availabilityStatus.toUpperCase())) {
      finalAvailability = availabilityStatus.toUpperCase();
    } else if (available === false) {
      finalAvailability = 'SOLD_OUT';
    }

    const newItem = await MenuItem.create({
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      category: catUpper,
      subcategory: subcategory ? subcategory.trim() : 'General',
      foodType: typeUpper,
      image: image && image.trim() ? image.trim() : '/images/veg_biriyani.jpg',
      availabilityStatus: finalAvailability,
      available: finalAvailability === 'AVAILABLE',
      preparationTime: parsedPrepTime,
      featured: !!featured,
      mealPeriod: mealPeriod || 'ALL_DAY',
      spiceLevel: spiceLevel || 'NONE'
    });

    return res.status(201).json({
      success: true,
      message: `"${newItem.name}" added to menu successfully!`,
      data: newItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing menu item (Prevent Mass Assignment via Whitelist)
// @route   PATCH /api/menu/:id
// @access  Private (Staff only)
export const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found.'
      });
    }

    const {
      name,
      description,
      price,
      category,
      subcategory,
      foodType,
      image,
      availabilityStatus,
      available,
      preparationTime,
      featured,
      mealPeriod,
      spiceLevel
    } = req.body;

    const errors = {};

    // Validate name if provided
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2) {
        errors.name = 'Dish name must be at least 2 characters.';
      } else {
        item.name = name.trim();
      }
    }

    // Validate description if provided
    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim().length < 3) {
        errors.description = 'Description must be at least 3 characters.';
      } else {
        item.description = description.trim();
      }
    }

    // Validate price if provided
    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        errors.price = 'Price must be a positive number greater than ₹0.';
      } else {
        item.price = parsedPrice;
      }
    }

    // Validate category if provided
    if (category !== undefined) {
      const catUpper = category.toUpperCase();
      if (!VALID_CATEGORIES.includes(catUpper)) {
        errors.category = `Category must be one of: ${VALID_CATEGORIES.join(', ')}`;
      } else {
        item.category = catUpper;
      }
    }

    if (subcategory !== undefined) {
      item.subcategory = subcategory.trim() || 'General';
    }

    // Validate foodType if provided
    if (foodType !== undefined) {
      const typeUpper = foodType.toUpperCase();
      if (!VALID_FOOD_TYPES.includes(typeUpper)) {
        errors.foodType = 'Food type must be either VEG or NON_VEG.';
      } else {
        item.foodType = typeUpper;
      }
    }

    // Validate prep time if provided
    if (preparationTime !== undefined) {
      const parsedPrep = Number(preparationTime);
      if (isNaN(parsedPrep) || parsedPrep < 1) {
        errors.preparationTime = 'Preparation time must be at least 1 minute.';
      } else {
        item.preparationTime = parsedPrep;
      }
    }

    if (image !== undefined && image.trim()) {
      item.image = image.trim();
    }

    if (featured !== undefined) {
      item.featured = !!featured;
    }

    if (mealPeriod !== undefined) {
      item.mealPeriod = mealPeriod;
    }

    if (spiceLevel !== undefined) {
      item.spiceLevel = spiceLevel;
    }

    // Handle availability updates
    if (availabilityStatus !== undefined) {
      const statusUpper = availabilityStatus.toUpperCase();
      if (VALID_AVAILABILITY.includes(statusUpper)) {
        item.availabilityStatus = statusUpper;
        item.available = statusUpper === 'AVAILABLE';
      }
    } else if (available !== undefined) {
      item.available = !!available;
      item.availabilityStatus = available ? 'AVAILABLE' : 'SOLD_OUT';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for menu update.',
        errors
      });
    }

    await item.save();

    return res.status(200).json({
      success: true,
      message: `"${item.name}" updated successfully!`,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fast inline availability status toggle (High-Frequency Action <50ms)
// @route   PATCH /api/menu/:id/availability
// @access  Private (Staff only)
export const toggleAvailability = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found.'
      });
    }

    const { availabilityStatus, available } = req.body;

    if (availabilityStatus && VALID_AVAILABILITY.includes(availabilityStatus.toUpperCase())) {
      item.availabilityStatus = availabilityStatus.toUpperCase();
      item.available = item.availabilityStatus === 'AVAILABLE';
    } else if (available !== undefined) {
      item.available = !!available;
      item.availabilityStatus = item.available ? 'AVAILABLE' : 'SOLD_OUT';
    } else {
      // Toggle between AVAILABLE and SOLD_OUT
      const nextStatus = item.availabilityStatus === 'AVAILABLE' ? 'SOLD_OUT' : 'AVAILABLE';
      item.availabilityStatus = nextStatus;
      item.available = nextStatus === 'AVAILABLE';
    }

    await item.save();

    return res.status(200).json({
      success: true,
      message: `"${item.name}" stock updated to ${item.availabilityStatus}`,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Archive / unarchive menu item (Non-destructive removal from catalog)
// @route   PATCH /api/menu/:id/archive
// @access  Private (Staff only)
export const archiveMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found.'
      });
    }

    const { isArchived } = req.body;
    item.isArchived = isArchived !== undefined ? !!isArchived : !item.isArchived;
    await item.save();

    return res.status(200).json({
      success: true,
      message: `"${item.name}" ${item.isArchived ? 'archived from active menu' : 'restored to active menu'}.`,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete menu item permanently
// @route   DELETE /api/menu/:id
// @access  Private (Staff only)
export const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found.'
      });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: `"${item.name}" permanently deleted from database.`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update availability for selected items
// @route   PATCH /api/menu/bulk/availability
// @access  Private (Staff only)
export const bulkUpdateAvailability = async (req, res, next) => {
  try {
    const { itemIds, availabilityStatus } = req.body;

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of item IDs to update.'
      });
    }

    const targetStatus = availabilityStatus ? availabilityStatus.toUpperCase() : 'AVAILABLE';
    if (!VALID_AVAILABILITY.includes(targetStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status "${availabilityStatus}". Must be AVAILABLE, SOLD_OUT, or UNAVAILABLE.`
      });
    }

    const result = await MenuItem.updateMany(
      { _id: { $in: itemIds } },
      {
        $set: {
          availabilityStatus: targetStatus,
          available: targetStatus === 'AVAILABLE'
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: `Updated availability to ${targetStatus} for ${result.modifiedCount} items.`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};
