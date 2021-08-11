import {Color} from "../core/color.js";

/**
 * @todo 
 * customize icon color
 */
 export const Loader = (() => {

    const section = document.createElement("section");
    const div = document.createElement("div");
    const style = document.createElement("style");

    div.id = "caldro-loader-icon";
    section.id = "caldro-loader";
    section.className = "caldro-loader";

    const api = {

        set color1(v) { 
            section.style.backgroundColor = v instanceof Color ? v.toString() : v;
        },
        set color2(v) { 
            // div.style.borderTop = "10px dotted " + v;
        }

    };

    api.color1 = "rgba(0, 0, 0, .5)";
    api.color2 = "teal";

    style.innerHTML = `
    #caldro-loader-icon {
        width: 100px;
        height: 25px;
        border-top: 10px dotted teal;
        position: absolute;
        left: calc(50vw - 50px);
        top: calc(50vh - 12px);
        animation: spin 2s linear infinite
    }
    @keyframes spin {
        from {
            border-top: 10px dotted teal;
        } 
        to {
            border-top: 5px dotted teal;
        }
    }`;

    function init() {
        section.css({
            width: "100vw",
            height: "100vh",
            backgroundColor: api.color1,
            position: "absolute",
            zIndex: "9999999"
        });
        document.body.appendChild(style);
        section.appendChild(div);
        document.body.appendChild(section);
    };

    api.css = function(styles) {
        section.css(styles);
    };

    api.hide = function() {
        section.style.display = "none";
    };

    api.show = function() {
        section.style.display = "block";
    };

    if(document.readyState === "complete")
        init();
    else {
        window.addEventListener("load", function() {
            init();
        });
    }

    api.hide();

    return api;
})();