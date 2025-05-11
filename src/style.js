document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
});

function clearChat() {
    document.getElementById("chat-body").innerHTML = "";
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    saveTheme();
}

function saveTheme() {
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("chat-theme", isDark ? "dark" : "light");
}

function loadTheme() {
    const savedTheme = localStorage.getItem("chat-theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
}

function exitChat() {
    window.location.href = "main.html";
}


// 8a1