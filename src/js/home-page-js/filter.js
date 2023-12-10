import axios from 'axios';
import { createProductItemMarkup } from '../helpers/markup.js';
import COMMONS from '../commons.js';
import { createPaginationMarkup } from './pagination.js';

const filterForm = document.getElementById('filterForm');
const keywordInput = document.getElementById('keywordInput');
const categorySelectButton = document.getElementById('categorySelect');
const categoryList = document.querySelector('.category-list');
const sortProductsButton = document.getElementById('sortProducts');
const sortProductsList = document.querySelector('.sortProducts-list');
const productsList = document.getElementById('productsList');
const ulContainer = document.querySelector('.product__list');

let categories = [];

export const fetchProducts = async () => {
  try {
    let url = `https://food-boutique.b.goit.study/api/products?page=${COMMONS.filters.page}&limit=${COMMONS.filters.limit}`;

    if (COMMONS.filters.keyword) {
      url += `&keyword=${COMMONS.filters.keyword}`;
    }

    if (COMMONS.filters.category && COMMONS.filters.category !== 'Show all') {
      url += `&category=${COMMONS.filters.category}`;
    }

    if (COMMONS.filters.sort && COMMONS.filters.sort !== 'all') {
      switch (COMMONS.filters.sort) {
        case 'alphabetical':
          url += `&byABC=true`;
          break;
        case 'reverse-alphabetical':
          url += `&byABC=false`;
          break;
        case 'cheap':
          url += `&byPrice=true`;
          break;
        case 'expensive':
          url += `&byPrice=false`;
          break;
        case 'popular':
          url += `&byPopularity=false`;
          break;
        case 'not-popular':
          url += `&byPopularity=true`;
          break;
      }
    }

    const response = await axios.get(url);
    const data = response.data;
    COMMONS.filters.totalHits = data.totalPages;
    displayProducts(data.results);
    createPaginationMarkup(data.totalPages, COMMONS.filters.page);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const displayProducts = products => {
  if (products.length === 0) {
    ulContainer.innerHTML =
      '<div style="display: inline-flex; flex-direction: column; align-items: center; gap: 14px; width: 371px; height: 110px; margin: 0 auto;"><p style="color: #010101; display: inline-flex; justify-content: center; text-align: center; font-size: 20px;">Nothing was found for the selected <span style="color: #6D8434; padding-left: 4px;"> filters...</span></p><p style="color: rgba(1, 1, 1, 0.70); display: inline-flex; text-align: center; justify-content: center; font-size: 18px;">Try adjusting your search parameters or browse our range by other criteria to find the perfect product for you. </p></div>';
  } else {
    ulContainer.innerHTML = products
      .map(product => createProductItemMarkup(product))
      .join('');
  }
};


const fetchCategories = async () => {
  try {
    const response = await axios.get(
      'https://food-boutique.b.goit.study/api/products/categories'
    );
    const data = response.data;
    categories = [...data, 'Show all'];
    displayCategories(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const displayCategories = categories => {
  const listItems = categories
    .map(category => {
      let displayCategory = category.replace(/_/g, ' ');

      if (category === 'Breads_&_Bakery') {
        displayCategory = displayCategory.replace(/&/g, '/');
      }

      return `<li class="category-item" data-value="${category}">${displayCategory}</li>`;
    })
    .join('');

  categoryList.innerHTML = listItems;
};

const updateSortButtonText = sortOption => {
  switch (sortOption) {
    case 'alphabetical':
      sortProductsButton.textContent = 'A to Z';
      break;
    case 'reverse-alphabetical':
      sortProductsButton.textContent = 'Z to A';
      break;
    case 'cheap':
      sortProductsButton.textContent = 'Cheap';
      break;
    case 'expensive':
      sortProductsButton.textContent = 'Expensive';
      break;
    case 'popular':
      sortProductsButton.textContent = 'Popular';
      break;
    case 'not-popular':
      sortProductsButton.textContent = 'Not popular';
      break;
    case 'all':
      sortProductsButton.textContent = 'Show all';
      break;
    default:
      break;
  }
};

const hideSortList = () => {
  sortProductsList.classList.remove('show');
};

sortProductsButton.addEventListener('click', () => {
  sortProductsList.classList.toggle('show');
});

const updateCategoryButtonText = category => {
  categorySelectButton.textContent = category;
};

const getCategoryValue = selectedItem => {
  return selectedItem ? selectedItem.getAttribute('data-value') : null;
};

const hideCategoryList = () => {
  categoryList.classList.remove('show');
};

categorySelectButton.addEventListener('click', () => {
  categoryList.classList.toggle('show');
});

document.addEventListener('click', event => {
  if (
    !event.target.matches('#sortProducts') &&
    !event.target.closest('.sortProducts-list')
  ) {
    hideSortList();
  }
});

document.addEventListener('click', event => {
  if (
    !event.target.matches('#categorySelect') &&
    !event.target.closest('.category-list')
  ) {
    hideCategoryList();
  }
});

keywordInput.addEventListener('input', () => {
  COMMONS.filters.keyword = keywordInput.value;
  COMMONS.filters.page = 1;
  fetchProducts();
});

filterForm.addEventListener('submit', async event => {
  event.preventDefault();
  COMMONS.filters.keyword = keywordInput.value;
  COMMONS.filters.page = 1;
  fetchProducts();
});

categoryList.addEventListener('click', event => {
  if (event.target.classList.contains('category-item')) {
    const selectedCategory = getCategoryValue(event.target);
    COMMONS.filters.category = selectedCategory;
    COMMONS.filters.page = 1;
    fetchProducts();
    updateCategoryButtonText(selectedCategory);
    hideCategoryList();
  }
});

sortProductsList.addEventListener('click', event => {
  if (event.target.classList.contains('category-item')) {
    const selectedSortOption = event.target.getAttribute('data-value');
    COMMONS.filters.sort = selectedSortOption;
    COMMONS.filters.page = 1;
    fetchProducts();
    updateSortButtonText(selectedSortOption);
    hideSortList();
  }
});

// Викликати функції з модуля
fetchCategories();
fetchProducts();
