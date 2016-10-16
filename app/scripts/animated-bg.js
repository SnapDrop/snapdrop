'use strict';
(function() {
    var requestAnimFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
    var c = document.createElement('canvas');
    document.body.appendChild(c);
    var style = c.style;
    style.width = '100%';
    style.position = 'absolute';
    var ctx = c.getContext('2d');
    var x0, y0, w, h, dw;

    function init() {
        w = window.innerWidth;
        h = window.innerHeight;
        c.width = w;
        c.height = h;
        var offset = h > 380 ? 100 : 65;
        x0 = w / 2;
        y0 = h - offset;
        dw = Math.max(w, h, 1000) / 13;
        drawCircles();
    }
    window.onresize = init;

    function drawCicrle(radius) {
        ctx.beginPath();
        var color = Math.round(255 * (1 - radius / Math.max(w, h)));
        ctx.strokeStyle = 'rgba(' + color + ',' + color + ',' + color + ',0.1)';
        ctx.arc(x0, y0, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.lineWidth = 2;
    }

    var step = 0;

    function drawCircles() {
        ctx.clearRect(0, 0, w, h);
        for (var i = 0; i < 8; i++) {
            drawCicrle(dw * i + step % dw);
        }
        step += 1;
    }

    var loading = true;

    function animate() {
        if (loading || step % dw < dw - 5) {
            requestAnimFrame(function() {
                drawCircles();
                animate();
            });
        }
    }
    window.anim = function(l) {
        loading = l;
        animate();
    };
    init();
    animate();
}());
