const form = document.getElementById("sj-form");
const address = document.getElementById("sj-address");
const searchEngine = document.getElementById("sj-search-engine");
const error = document.getElementById("sj-error");
const errorCode = document.getElementById("sj-error-code");

const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (error) error.textContent = "";
    if (errorCode) errorCode.textContent = "";

    try {
        await registerSW();
    } catch (err) {
        if (error) error.textContent = "Failed to register service worker.";
        if (errorCode) errorCode.textContent = err.toString();
        return;
    }

    const url = search(address.value, searchEngine.value);

    let iframe = document.getElementById("sj-frame");
    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "sj-frame";
        document.body.appendChild(iframe);
    }
    
    iframe.classList.add("active");
    iframe.src = __scramjet$config.prefix + __scramjet$config.codec.encode(url);
});
