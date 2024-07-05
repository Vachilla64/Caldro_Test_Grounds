// converts object data format to css
// {backgroundColor: red}	#input
// background-color: red	#result
export const stringToCssFormat = (string) => {
    let res = "";
    for(let i=0; i < string.length; i++) {
        if(string[i].codePointAt() >= 65 && string[i].codePointAt() <=90) {
            res += "-";
            res += string[i].toLowerCase();
            res += string[++i];
        } else
            res += string[i];
    };
    return res;
};

export const splitCSSValue = val => {
    let res = ["", ""];
    let i = 0;
    let sVal = String(val);
    while(i < sVal.length) {
        let current = sVal[i];
        if(isNaN(current))
            res[1] += current;
        else if(!isNaN(current))
            res[0] += current;
        i++;
    };
    return res;
};

/**
 * @todo
 * Fix for android check
 */
export const deviceName = () => {
    const devices = [];
    // Opera 8.0+
    const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf('OPR/') >= 0;
    devices.push(isOpera);
    // Firefox 1.0+
    const isFirefox = typeof InstallTrigger !== 'undefined';
    devices.push(isFirefox);
    // At least Safari 3+: "[object HTMLElementConstructor]"
    const isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    devices.push(isSafari);
    // Internet Explorer 6-11
    const isIE = /*@cc_on!@*/false || !!document.documentMode;
    devices.push(isIE);
    // Edge 20+
    const isEdge = !isIE && !!window.StyleMedia;
    devices.push(isEdge);
    // Chrome 1+
    const isChrome = !!window.chrome && !!window.chrome.webstore;
    devices.push(isChrome);
    // Blink engine detection
    const isBlink = (isChrome || isOpera) && !!window.CSS;
    devices.push(isBlink);
    // ios
    const isIos = false;
    devices.push(isIos);
    let names = [
        "opera",
        "firefox",
        "safari",
        "ie",
        "edge",
        "chrome",
        "blink",
        "ios"
    ];
    let res = "android";
    devices.forEach((d, i) => {
        if(d) res = names[i];
    });
    return res;
};