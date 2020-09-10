var data;
var DEBUG = false;

var fields = ['tool', 'source'];

onmessage = function(e) {
    if (e.data.type === 'data') {
        if (DEBUG) console.log('Got data');
        data = e.data.data;
    } else if (e.data.type === 'query') {
        var src = e.data.src.toLowerCase();
        var target = e.data.target.toLowerCase();

        if (src) {
            if (data[src] && target) {
                postMessage(data[src][target]);
            } else {
                postMessage(Object.values(data[src]).flat());
            }
        } else {
            postMessage([]);
        }
    }
};
