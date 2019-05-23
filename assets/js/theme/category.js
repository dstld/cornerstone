import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';

export default class Category extends CatalogPage {
    onReady() {
        compareProducts(this.context.urls);

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }
        this.hideNoSubCategories();
    }

    initFacetedSearch() {
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        });
    }

    hideNoSubCategories() {
        const entireCategories = this.context.categoryList;
        const currentCategory = this.context.currentCategory;
        let currentCatObj = {};
        entireCategories.forEach((mainSub) => {
            if (parseInt(mainSub.id, 10) === parseInt(currentCategory.id, 10)) {
                currentCatObj = mainSub;
            } else {
                const children = mainSub.children.filter(item => item.id === currentCategory.id);
                if (children.length > 0) {
                    currentCatObj = children[0];
                }
            }
        });
        if (currentCatObj.children) {
            currentCatObj.children.forEach((subCat) => {
                if (!subCat.children) {
                    $(`.subcategory-${subCat.id}`).removeClass('hidden');
                }
            });
        }
    }
}
