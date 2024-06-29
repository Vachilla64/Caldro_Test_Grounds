/**
 * touch [single, double]
 * button [single, double]
 * joystick[single, double]
 */

import "../core/util.js";

export const Controller = (() => {

    let width = 300, height = 300;

    let container = document.createElement("section");

    const L_BTN_WIDTH = 100;
    const L_BTN_HEIGHT = 25;
    const SEL_BTN_WIDTH = parseInt(L_BTN_WIDTH * .5);
    const SEL_BTN_HEIGHT = parseInt(L_BTN_HEIGHT * .5);
    const MARGIN = 5;

    const api = {

        set width(w) {
            width = w;
            container.css({width: w});
            reAdjustButton();
        },

        set height(h) {
            height = h;
            container.css({height: h});
            reAdjustButton();
        },

        get width() { return width },

        get height() { return height }
    };

    let l1 = document.createElement("button");
    l1.innerHTML = "L1";
    l1.className = "container-l-btn lc-btn";
    l1.id = "l1";
    let l2 = document.createElement("button");
    l2.innerHTML = "L2";
    l2.className = "container-l-btn lc-btn";
    l2.id = "l2";
    let r1 = document.createElement("button");
    r1.innerHTML = "R1";
    r1.className = "container-l-btn";
    r1.id = "r1";
    let r2 = document.createElement("button");
    r2.innerHTML = "R2";
    r2.className = "container-l-btn";
    r2.id = "r2";
    let select = document.createElement("button");
    select.innerHTML = "Select";
    select.className = "container-l-btn sel-btn";
    select.id = "select";
    let start = document.createElement("button");
    start.innerHTML = "Start";
    start.className = "container-l-btn sel-btn";
    start.id = "r2";

    let rightS = document.createElement("section");
    rightS.className = "bottom-s-btn";
    rightS.innerHTML = "red"
    let leftS = document.createElement("section");
    leftS.className = "bottom-s-btn";

    let style = document.createElement("style");
    style.innerHTML = `
    button {
        background: none;
        color: lightgray;
    }

    .container-l-btn {
        width: ${L_BTN_WIDTH}px;
        height: ${L_BTN_HEIGHT}px;
        position: absolute;
        margin-top: 5px
    };

    .bottom-s-btn {
        width: 25%;
        height: 25%;
        position: absolute;
        left: 100px;
        top: 100px;
        background: red
    }`;
    document.body.appendChild(style);

    container.appendChild(l1);
    container.appendChild(l2);
    container.appendChild(r1);
    container.appendChild(r2);
    container.appendChild(select);
    container.appendChild(start);
    container.appendChild(rightS);
    container.appendChild(leftS);

    const reAdjustButton = () => {
        l1.css({
            top: `calc(0px)`,
            borderTopLeftRadius: `${L_BTN_WIDTH / 2}px`
        });
        l2.css({
            top: `calc(${L_BTN_HEIGHT + 5}px)`,
            borderBottomLeftRadius: `${L_BTN_WIDTH / 2}px`
        });
        r1.css({
            left: `calc(${api.width} - ${L_BTN_WIDTH}px)`,
            borderTopRightRadius: `${L_BTN_WIDTH / 2}px`
        });
        r2.css({
            left: `calc(${api.width} - ${L_BTN_WIDTH}px)`,
            top: `calc(${L_BTN_HEIGHT + 5}px)`,
            borderBottomRightRadius: `${L_BTN_WIDTH / 2}px`
        });
    };

    if(document.readyState === "complete") {
        api.width = "100vw";
        api.height = "100vh";
        document.body.appendChild(container);
    } else {
        api.width = "100vw";
        api.height = "100vh";
        window.addEventListener("load", function() {
            document.body.appendChild(container);
        });
    };

    container.style.background = "#000";

    api.hide = () => { container.style.display = "none"; };
    api.show = () => { container.style.display = "block"; };

    api.hide();

    return api;

 })();