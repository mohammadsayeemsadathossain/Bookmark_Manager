// Reusable Component: Category Box
function createCategoryBox(category, bookmarks) {
  const categoryBox = document.createElement('div');
  categoryBox.className = 'category-box';

  const categoryTitle = document.createElement('h3');
  categoryTitle.textContent = category;
  categoryBox.appendChild(categoryTitle);

  const bookmarksContainer = document.createElement('div');
  bookmarksContainer.className = 'bookmarks-container';

  bookmarks.forEach(bookmark => {
    const bookmarkElement = document.createElement('div');
    bookmarkElement.className = 'bookmark';

    const bookmarkTitle = document.createElement('span');
    bookmarkTitle.textContent = bookmark.title;
    bookmarkTitle.addEventListener('click', () => openBookmark(bookmark.url));
    bookmarkElement.appendChild(bookmarkTitle);

    const detailsButton = document.createElement('button');
    detailsButton.className = 'details-button';
    detailsButton.textContent = 'Details';
    detailsButton.addEventListener('click', () => toggleBookmarkDetails(bookmark));
    bookmarkElement.appendChild(detailsButton);

    bookmarksContainer.appendChild(bookmarkElement);
  });

  categoryBox.appendChild(bookmarksContainer);

  return categoryBox;
}

// Global Variables
let categories = [];

// Load Categories and Bookmarks from Local Storage
function loadCategories() {
  const storedCategories = localStorage.getItem('categories');

  if (storedCategories) {
    categories = JSON.parse(storedCategories);
  }

  renderCategories();
}

// Render Categories
function renderCategories() {
  const categoriesContainer = document.getElementById('categoriesContainer');
  categoriesContainer.innerHTML = '';

  categories.forEach(category => {
    const categoryBox = createCategoryBox(category.name, category.bookmarks);
    categoriesContainer.appendChild(categoryBox);
  });

  const categorySelect = document.getElementById('category');
  categorySelect.innerHTML = '';

  // Add existing categories as options in the dropdown
  for (const category of categories) {
    const option = document.createElement('option');
    option.value = category.name;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  }
}


// Save Categories and Bookmarks to Local Storage
function saveCategories() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

// Open Bookmark
function openBookmark(url) {
  window.open(url, '_blank');
}

// Toggle Bookmark Details
function toggleBookmarkDetails(bookmark) {
  const detailsContainer = document.getElementById('detailsContainer');
  detailsContainer.innerHTML = '';

  if (detailsContainer.style.display === 'block') {
    detailsContainer.style.display = 'none';
  } else {
    const detailsBox = document.createElement('div');
    detailsBox.className = 'details-box';

    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Title:';
    detailsBox.appendChild(titleLabel);

    const titleValue = document.createElement('span');
    titleValue.textContent = bookmark.title;
    detailsBox.appendChild(titleValue);

    const urlLabel = document.createElement('label');
    urlLabel.textContent = 'URL:';
    detailsBox.appendChild(urlLabel);

    const urlValue = document.createElement('span');
    urlValue.textContent = bookmark.url;
    detailsBox.appendChild(urlValue);

    const categoryLabel = document.createElement('label');
    categoryLabel.textContent = 'Category:';
    detailsBox.appendChild(categoryLabel);

    const categoryValue = document.createElement('span');
    categoryValue.textContent = getCategoryName(bookmark);
    detailsBox.appendChild(categoryValue);

    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => toggleBookmarkDetails(bookmark));
    detailsBox.appendChild(closeButton);

    detailsContainer.appendChild(detailsBox);
    detailsContainer.style.display = 'block';
  }
}

// Get Category Name for Bookmark
function getCategoryName(bookmark) {
  const category = categories.find(category => category.bookmarks.includes(bookmark));
  return category ? category.name : '';
}

// Open Modal
function openModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'block';
}

// Close Modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
  document.getElementById('bookmarkForm').reset();
  toggleCategoryInput();
}

// Toggle Category Input
function toggleCategoryInput() {
  const categorySelect = document.getElementById('category');
  const newCategoryInput = document.getElementById('newCategory');

  if (categorySelect.value === 'new') {
    newCategoryInput.style.display = 'block';
    categorySelect.setAttribute('disabled', 'disabled');
    newCategoryInput.setAttribute('required', 'required');
  } else {
    newCategoryInput.style.display = 'none';
    categorySelect.removeAttribute('disabled');
    newCategoryInput.removeAttribute('required');
  }
}
// Toggle New Category Input
function toggleNewCategoryInput() {
  const categorySelect = document.getElementById('category');
  const addCategoryBtn = document.getElementById('addCategoryBtn');
  const newCategoryInput = document.getElementById('newCategory');

  categorySelect.value = 'new';
  categorySelect.setAttribute('disabled', 'disabled');
  addCategoryBtn.style.display = 'none';
  newCategoryInput.style.display = 'block';
  newCategoryInput.focus();
}

// Add Bookmark
function addBookmark(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const url = document.getElementById('url').value;
  const categorySelect = document.getElementById('category');
  const newCategoryInput = document.getElementById('newCategory');

  let category;
  if (categorySelect.value === 'new') {
    const newCategory = newCategoryInput.value;
    if (!newCategory) return;

    category = newCategory;
    newCategoryInput.value = '';
  } else {
    category = categorySelect.value;
  }

  const bookmark = { title, url };

  const categoryIndex = categories.findIndex(c => c.name === category);
  if (categoryIndex !== -1) {
    categories[categoryIndex].bookmarks.push(bookmark);
  } else {
    categories.push({ name: category, bookmarks: [bookmark] });
  }

  closeModal();
  saveCategories();
  renderCategories();
}

// Initialize Bookmark Manager
function initializeBookmarkManager() {
  loadCategories();
}

// Run Bookmark Manager
initializeBookmarkManager();

