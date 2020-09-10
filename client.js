var fuse;
var nextQuery = null;
var processing = false;
var currentQuery = null;
var DEBUG = false;
var searchQuery = '';
var pageURL = $(location).attr('href');

$(function() {
    var worker = new Worker('worker2.js');
    $('.input-this').focus();
    $.getJSON('data.json')
        .success(function (json) {
            worker.postMessage({ type: 'data', data: json });
            search();
        })
        .error(function (jqxhr, status, err) {
            if (DEBUG) console.log(jqxhr, status, err);
        });

    worker.onmessage = function (tools) {
        processing = false;
        display_results(tools);
        if (nextQuery !== null) {
            var query = nextQuery;
            nextQuery = null;
            search(query);
        }
    };

    //http://davidwalsh.name/javascript-debounce-function
    function debounce(wait, func, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    function item_to_html(tools) {
        var html = '';
        console.log(tools);
        if (!tools || tools.length < 1) {
            $('.result').css({"transition": "background-color 0.5s ease", "background-color": "#f2e6e2"});
            return `<li> <div class="item"> <a target="_blank" class="tool">⋅ ⋅ ⋅</a> </div> </li>`;
        }
        for (var i = 0; i < tools.length; ++i) {
            $('.result').css({"transition": "background-color 0.5s ease", "background-color": "#f1f9e2"});
            html +=
                `<li> <div class="item"> <a target="_blank" class="tool" href=${tools[i].url}>${tools[i].tool}</a> (${tools[i].source}) </div> </li>`;
        }
        return html;
    };

    function display_results(tools) {
        $('.item-list').html(item_to_html(tools.data));
    };

    var search = function () {
        var src = $('.input-this').val().trim();
        var target = $('.input-that').val().trim();

        processing = true;
        console.log(src, target);
        worker.postMessage({ type: 'query', src: src, target: target });
    };

    $('.input-this').keydown(debounce(200, search));
    $('.input-that').keydown(debounce(200, search));
});