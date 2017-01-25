/**
 * jQuery плагин Прелоадер
 *
 * Опции (по-умолчанию пустые, тип - String):
 *      text - будет указан поясняющий текст над анимацией;
 *      percent - процент выполнения, можно указывать от 0 до 100;
 *      duration - продолжительность прелоадера
 * Пример: $('.el').preloader({text: 'example'});
 *
 * Методы:
 *      remove - удаление прелоадера, например, $('.el').preloader('remove');
 *      update - обновление текста и/или процентов, например, $('.el').preloader('update', {percent: '70', text: 'example'});
 *
 */
;(function ($, window, document, undefined) {
    var pluginName = 'preloader',
        defaults = {
            text: '', // explaining text under animation
            percent: '', // from 0 to 100
            duration: '' // in ms
        },
        $preloaderContainer,
        $animationBlock,
        $text,
        $percent,
        textTempl = '<span class="preloader-text"></span>',
        percentTempl = '<span class="preloader-percent"></span>',
        isInited = false;

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    var methods = {
        remove: function () {
            if ($preloaderContainer) {
                isInited = false;
                $preloaderContainer.remove();
            }
        },
        update: function (arg) {
            var options = arg[1];

            if (options.percent.length > 0 && $percent) {
                $percent.text(options.percent + '%');
            } else if (options.text.length > 0 && $text) {
                $text.text(options.text);
            } else if (!$text || !$percent) {
                console.warn('Значение не может быть обновлено');
                return false;
            }
        }
    };

    Plugin.prototype.init = function () {
        var element = $(this.element),
            text,
            percent,
            percentVal,
            elementHeight,
            elementScrollHeight,
            preloaderHeight;

        if (isInited) {
            console.warn('Plugin ' + pluginName + ' is already initialized');
            return false;
        }

        element.prepend('<div class="preloader"><div class="preloader-animation"></div></div>');
        $preloaderContainer = element.find('.preloader');
        $animationBlock = $preloaderContainer.find('.preloader-animation');

        // Установка высоты прелоадера
        elementHeight = element.height();
        elementScrollHeight = element[0].scrollHeight;
        preloaderHeight = $preloaderContainer.height();

        if (elementScrollHeight > preloaderHeight) {
            $preloaderContainer.height(elementScrollHeight);

            // Позиционирование анимации в центре
            element.on('scroll', fixAnimBlock).trigger('scroll');
            function fixAnimBlock () {
                var scrollTop = element.scrollTop(),
                    animPosition,
                    animHeight = $animationBlock.height();

                animPosition = Math.round(elementHeight / 2 - animHeight / 2 + scrollTop) + 'px';
                $animationBlock.css({'top': animPosition});
            }
        }
        
        isInited = true;

        // text option
        if (this.options.text.length > 0) {
            $preloaderContainer.prepend(textTempl);
            $text = element.find('.preloader-text');
            $text.text(this.options.text);
        }

        // percent option
        if (this.options.percent.length > 0) {
            percentVal = this.options.percent;
            if (percentVal < 0) {
                percentVal = 0;
            } else if (percentVal > 100) {
                percentVal = 100;
            }
            $preloaderContainer.prepend(percentTempl);
            $percent = element.find('.preloader-percent');
            $percent.text(percentVal + '%');
        }

        // duration option
        if (this.options.duration.length > 0) {
            setTimeout(function () {
                $preloaderContainer.remove();
                isInited = false;
            }, this.options.duration);
        }
    };

    $.fn[pluginName] = function (method, options) {
        var firstArg = arguments[0],
            argsArr = Array.prototype.slice.call(arguments);

        if (methods[firstArg]) {
            return this.each(function () {
                methods[firstArg].call(this, argsArr);
            });
        } else if (typeof(firstArg) === 'object' || !firstArg) {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName);
                }
                new Plugin(this, firstArg);
            });
        } else {
            $.error('Method ' + firstArg + ' does not exist on jQuery.' + pluginName);
        }
    };
})(jQuery, window, document);