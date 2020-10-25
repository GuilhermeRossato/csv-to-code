if (window.localStorage.getItem("csv-to-code-language")) {
    document.querySelector("#language").value = window.localStorage.getItem("csv-to-code-language");
    setTimeout(() => {
        try {
            onConvertClick();
        } catch (err) { console.log(err); setTimeout(onConvertClick, 500); }
    }, 1);
}
document.querySelector("#language").onchange = () => {
    window.localStorage.setItem("csv-to-code-language", document.querySelector("#language").value);
    onConvertClick();
}