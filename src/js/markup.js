import sprite from '/img/sprite.svg';
import { loadStorage } from './localeStorageFn';

export function createProductItemMarkup({
  _id,
  name,
  img,
  desc,
  category,
  price,
  size,
  popularity,
  is10PercentOff,
}) {
  const updateCartItems = loadStorage('cartItems');
  const idx = updateCartItems.findIndex(element => element.id === _id);

  console.log(idx);
  return `<li data-id="${_id}" class="product__list__card product_item">
        <svg class="sticker_icon ${
          is10PercentOff ? '' : 'visually-hidden'
        }" width="60" height="60">
          <use xlink:href="${sprite}#discount"></use>
        </svg>
        <div class="product__image__wraper">
          <img
            class="product__image"
            src="${img}"
            alt="${name}"
            width="140px"
            height="140px"
          />
        </div>
        <div class="product__description__wraper">
          <h3 class="product__title">${name}</h3>
          <ul class="product__details">
            <li>
              <p class="product__description__text">
                Category:
                <span id="product_category_name" class="product__description__span"}>${category.replace(
                  /_/g,
                  ' '
                )}</span>
              </p>
            </li>
            <li>
              <p class="product__description__text">
                Size: <span id="product_size" class="product__description__span">${size}</span>
              </p>
            </li>
            <li>
              <p class="product__description__text">
                Popularity: <span class="product__description__span">${popularity}</span>
              </p>
            </li>
          </ul>
        </div>
        <div class="product__order__wraper">
          <p class="product__price">${'$' + price}</p>
          <button data-id="${_id}" class="product__order__btn add-to-cart">
            <svg class="card-icon-cart" ${
              idx === -1 ? "style = 'display:block'" : "style = 'display:none'"
            }  width="18" height="18">
              <use xlink:href="${sprite}#shopping-cart"></use>
            </svg>
            <svg class="card-icon-check" ${
              idx === -1 ? "style = 'display:none'" : "style = 'display:block'"
            }  width="18" height="18">
              <use xlink:href="${sprite}#check"></use>
            </svg>
          </button>
        </div>
      </li>`;
}
