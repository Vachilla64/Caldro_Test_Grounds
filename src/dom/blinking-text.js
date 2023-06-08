class BlinkingText extends HTMLParagraphElement
{
    constructor()
    {
        this.testText = "Caldro Sample test";
    
    }
};


customElements.define("caldro-blinkText", BlinkingText, {extends: "p"});
