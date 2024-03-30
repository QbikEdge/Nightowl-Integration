// ==UserScript==
// @name         Nightowl Integration
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add Nightowl script to any website and integrate provided code
// @author       Qbikedge
// @match        *://*/*
// @exclude      *://*.pdf*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const storageKey = "nightowl-color-scheme";
    const lightMode = "light";
    const darkMode = "dark";
    let currentMode = lightMode;
    let localStorageSupported = true;

    try {
        localStorage.setItem("test", "test");
        localStorage.removeItem("test");
    } catch {
        localStorageSupported = false;
    }

    function addStyle() {
        const style = document.createElement("style");
        style.innerHTML = `
            .nightowl-dark {
                background-color: #111 !important;
            }

            .nightowl-dark body {
                filter: invert(100%) hue-rotate(180deg) !important;
            }

            .nightowl-dark img,
            .nightowl-dark video,
            .nightowl-dark iframe,
            .nightowl-dark .nightowl-daylight {
                filter: invert(100%) hue-rotate(180deg) !important;
            }

            .nightowl-dark .icon {
                filter: invert(15%) hue-rotate(180deg) !important;
            }

            .nightowl-dark pre {
                filter: invert(6%) !important;
            }

            .nightowl-dark li::marker {
                color: #666 !important;
            }
        `;
        document.head.appendChild(style);
    }

    function toggleMode() {
        currentMode = currentMode === lightMode ? darkMode : lightMode;
        updateUI();
    }

    function updateUI() {
        const button = document.getElementById("nightowl-switcher-default");
        if (button) {
            button.innerHTML = currentMode === lightMode ? getDarkModeIcon() : getLightModeIcon();
        }

        const htmlElement = document.querySelector("html");
        if (htmlElement) {
            htmlElement.classList.toggle("nightowl-light", currentMode === lightMode);
            htmlElement.classList.toggle("nightowl-dark", currentMode === darkMode);
        }

        saveMode();
    }

    function getLightModeIcon() {
        return `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 25px; height: 25px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>`;
    }

    function getDarkModeIcon() {
        return `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 25px; height: 25px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>`;
    }

    function createToggleButton() {
        const button = document.createElement("div");
        button.id = "nightowl-switcher-default";
        button.style.cssText = `
            position: fixed;
            left: calc(100vw - 100px);
            top: calc(10px);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: ${currentMode === darkMode ? "black" : "white"};
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease-in-out;
            overflow: hidden;
            color: ${currentMode === darkMode ? "white" : "black"};
        `;
        button.addEventListener("click", toggleMode);
        button.innerHTML = currentMode === lightMode ? getDarkModeIcon() : getLightModeIcon();
        document.body.appendChild(button);
    }

    function loadMode() {
        if (localStorageSupported) {
            const storedMode = localStorage.getItem(storageKey);
            if (storedMode && (storedMode === lightMode || storedMode === darkMode)) {
                currentMode = storedMode;
            } else {
                currentMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? darkMode : lightMode;
            }
        } else {
            currentMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? darkMode : lightMode;
        }
    }

    function saveMode() {
        if (localStorageSupported) {
            localStorage.setItem(storageKey, currentMode);
        }
    }

    addStyle();
    loadMode();
    createToggleButton();
    updateUI();

})();
