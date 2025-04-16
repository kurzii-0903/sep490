// src/config.js
let config = {};

export async function loadConfig() {
    const response = await fetch('/config.json');
    config = await response.json();
}

export function getConfig(key) {
    return config[key];
}
