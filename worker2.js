var data;

var fields = ['tool', 'source'];

onmessage = function(e) {
    if (e.data.type === 'data') {
        data = e.data.data;
    } else if (e.data.type === 'query') {
        var src = e.data.src.toLowerCase();
        var target = e.data.target.toLowerCase();

        if (src) {
          if (data[src]) {
            if (target) {
              postMessage(data[src][target]);
            } else {
              postMessage(Object.values(data[src]).flat());
            }
          }
        } else {
            postMessage([]);
        }
    }
};
