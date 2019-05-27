/* eslint-disable camelcase */
import 'easyzoom';
import 'slick-carousel';
import 'jquery-lazyload';

export default class MobileImageSlick {
    constructor() {
        $('.pdp-mobile-flexslider').slick({
            infinite: false,
            dots: true,
        });

        $('.pdp-mobile-flexslider .lazyload').lazyload({ data_attribute: 'orig' });
        this.$mainImage = $(`.pdp-mobile-flexslider [data-slick-index=${0}]`).data('thumb');
    }

    init() {
        this.setMainImage();
        this.bindEvents();
    }

    setMainImage() {
        $('.mobile-zoom-container .mobile-zoomviewer-image').attr('data-src', this.$mainImage);
        $('.mobile-zoom-container .mobile-zoomviewer-image').addClass('lazyload');
    }

    imageLoaded() {
        this._IMAGE_WIDTH = $('.mobile-zoomviewer-image').width();
        this._IMAGE_HEIGHT = $('.mobile-zoomviewer-image').height();
        this._IMAGE_LOADED = 1;
        const img_left_new = (window.innerWidth - this._IMAGE_WIDTH) / 2;
        $('.mobile-zoomviewer-image').css({ top: 0, left: `${img_left_new}px` });
    }

    bindEvents() {
        $('.pdp-mobile-flexslider').on('afterChange', (event, slick, currentSlide) => {
            const selectedProductImage = $(`#pdp-mobile-flexslider [data-slick-index=${currentSlide}]`).data('thumb');
            $('.mobile-zoom-container .mobile-zoomviewer-image').attr('data-src', selectedProductImage);
            $('.mobile-zoom-container .mobile-zoomviewer-image').addClass('lazyload');
        });

        // Open Image Viewer
        $('.fa-expand.pdp-mobile-zoomCtrl').on('click', () => {
            $('.mobile-zoom-container').removeClass('hidden');
            $('body').css('overflow', 'hidden');

            this._DRAGGGING_STARTED = 0;
            this._LAST_MOUSEMOVE_POSITION = { x: null, y: null };
            this._DIV_OFFSET = $('.mobile-zoom-container').offset();
            this._CONTAINER_WIDTH = window.innerWidth;
            this._CONTAINER_HEIGHT = window.innerHeight;
            this._IMAGE_LOADED = 0;

            if ($('.mobile-zoomviewer-image').get(0).complete) {
                this.imageLoaded();
            } else {
                $('.mobile-zoomviewer-image').on('load', () => {
                    this.imageLoaded();
                });
            }
        });

        // Close Image Viewer
        $('.fa-compress.pdp-mobile-zoomCtrl').on('click', () => {
            $('.mobile-zoom-container').addClass('hidden');
            $('body').css('overflow', 'auto');
        });

        $('.mobile-zoom-container').on('touchstart', () => {
            this._DRAGGGING_STARTED = 0;
        });

        $('.mobile-zoom-container').on('touchmove', (event) => {
            const touches = event.changedTouches;

            if (this._DRAGGGING_STARTED === 1) {
                const current_mouse_position = { x: touches[0].pageX - this._DIV_OFFSET.left, y: touches[0].pageY - this._DIV_OFFSET.top };
                const change_x = current_mouse_position.x - this._LAST_MOUSE_POSITION.x;
                const change_y = current_mouse_position.y - this._LAST_MOUSE_POSITION.y;

                /* Save mouse position */
                this._LAST_MOUSE_POSITION = current_mouse_position;

                const img_top = parseInt($('.mobile-zoomviewer-image').css('top'), 10);
                const img_left = parseInt($('.mobile-zoomviewer-image').css('left'), 10);

                let img_top_new = img_top + change_y;
                let img_left_new = img_left + change_x;

                /* Validate top and left do not fall outside the image, otherwise white space will be seen */
                const MAX_Y_RANGE = this._CONTAINER_HEIGHT - this._IMAGE_HEIGHT;
                if (img_top_new > 0) { img_top_new = 0; }
                if (img_top_new < MAX_Y_RANGE) {
                    img_top_new = MAX_Y_RANGE;
                }

                const MAX_X_RANGE = this._CONTAINER_WIDTH - this._IMAGE_WIDTH;
                if (img_left_new > 0) { img_left_new = 0; }
                if (img_left_new < MAX_X_RANGE) { img_left_new = MAX_X_RANGE; }
                $('.mobile-zoomviewer-image').css({ top: `${img_top_new}px`, left: `${img_left_new}px` });
            } else {
                this._DRAGGGING_STARTED = 1;
                /* Save mouse position */
                this._LAST_MOUSE_POSITION = { x: touches[0].pageX - this._DIV_OFFSET.left, y: touches[0].pageY - this._DIV_OFFSET.top };
            }
        });
    }
}
