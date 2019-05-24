import 'easyzoom';
import 'flexslider';

export default class ImageGallery {
    init() {
        this.initFlexSlider();
    }

    initFlexSlider() {
        $('.flexslider').flexslider({
            animation: 'slide',
            controlNav: 'thumbnails',
        });
    }
}
