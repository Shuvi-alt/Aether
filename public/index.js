const form = document.getElementById("sj-form");
const address = document.getElementById("sj-address");
const searchEngine = document.getElementById("sj-search-engine");
const error = document.getElementById("sj-error");
const errorCode = document.getElementById("sj-error-code");

const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

async function setupTransport() {
    try {
        // Usa un endpoint Wisp público alternativo sobre HTTPS/WSS
        const wispUrl = (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/wisp/";
        await connection.setTransport("/baremux/bare.cjs", [wispUrl]);
    } catch (err) {
        console.error("Transport error:", err);
    }
}

setupTransport();

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
        await registerSW();
    } catch (err) {
        error.textContent = "Failed to register service worker.";
        errorCode.textContent = err.toString();
        return;
    }

    const url = search(address.value, searchEngine.value);

    // Crear o reutilizar iframe en pantalla completa
    let iframe = document.getElementById("sj-frame");
    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "sj-frame";
        document.body.appendChild(iframe);
    }
    
    iframe.src = __scramjet$config.prefix + __scramjet$config.codec.encode(url);
});
