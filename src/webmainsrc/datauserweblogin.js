// settingsdata.js

document.addEventListener("DOMContentLoaded", function () {
    const usernameDisplay = document.getElementById("username-display");
    const emailDisplay = document.getElementById("email-display");

    let userCount = parseInt(localStorage.getItem("user_count")) || 0;
    let currentUser = null;

    for (let i = 1; i <= userCount; i++) {
        let userData = JSON.parse(localStorage.getItem(`user_${i}`));
        if (userData) {
            currentUser = userData;
            break;
        }
    }

    if (currentUser) {
        usernameDisplay.textContent = currentUser.username || "Chưa có dữ liệu";
        emailDisplay.textContent = currentUser.email || "Chưa có dữ liệu";
    } else {
        usernameDisplay.textContent = "Chưa có dữ liệu";
        emailDisplay.textContent = "Chưa có dữ liệu";
    }
});

function updateSettings() {
    let newUsername = document.getElementById("username").value.trim();
    let newEmail = document.getElementById("email").value.trim();
    let oldPassword = document.getElementById("old-password").value.trim();
    let newPassword = document.getElementById("password").value.trim();

    if (!newUsername || !newEmail || !oldPassword || !newPassword) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    let userCount = parseInt(localStorage.getItem("user_count")) || 0;
    let updated = false;

    for (let i = 1; i <= userCount; i++) {
        let userData = JSON.parse(localStorage.getItem(`user_${i}`));
        if (userData && userData.password === oldPassword) {
            userData.username = newUsername;
            userData.email = newEmail;
            userData.password = newPassword;
            localStorage.setItem(`user_${i}`, JSON.stringify(userData));
            updated = true;
            break;
        }
    }

    if (updated) {
        alert("Thông tin đã được cập nhật!");
        window.location.href = "main.html";
    } else {
        alert("Mật khẩu cũ không chính xác hoặc không tìm thấy dữ liệu người dùng!");
    }
}



document.addEventListener("DOMContentLoaded", function () {
    const registerBtn = document.getElementById("signup-btn");
    const loginBtn = document.getElementById("login-btn");

    if (registerBtn) {
        registerBtn.addEventListener("click", registerUser);
    }
    if (loginBtn) {
        loginBtn.addEventListener("click", loginUser);
    }
});

function registerUser() {
    let username = document.getElementById("username").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirm-password").value.trim();

    if (!username || !email || !password || !confirmPassword) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }

    let userCount = parseInt(localStorage.getItem("user_count")) || 0;
    userCount++;

    let userData = { username, email, password };
    localStorage.setItem(`user_${userCount}`, JSON.stringify(userData));
    localStorage.setItem("user_count", userCount.toString());

    alert("Đăng ký thành công!");
    window.location.href = "login.html";
}

function loginUser() {
    let username = document.getElementById("login-username").value.trim();
    let password = document.getElementById("login-password").value.trim();

    if (!username || !password) {
        alert("Vui lòng nhập tên người dùng và mật khẩu!");
        return;
    }

    let userCount = parseInt(localStorage.getItem("user_count")) || 0;
    let found = false;

    for (let i = 1; i <= userCount; i++) {
        let userData = JSON.parse(localStorage.getItem(`user_${i}`));
        if (userData && userData.username === username && userData.password === password) {
            found = true;
            break;
        }
    }

    if (found) {
        alert("Đăng nhập thành công!");
        window.location.href = "src/verify.html";
    } else {
        alert("Tên người dùng hoặc mật khẩu sai!");
    }
}

let growthStage = parseInt(localStorage.getItem(`${currentUser.username}_growthStage`)) || 1;
let chatCount = parseInt(localStorage.getItem(`${currentUser.username}_chatCount`)) || 0;
const achievements = JSON.parse(localStorage.getItem(`${currentUser.username}_achievements`)) || [];


function updateTree() {
    const stages = ["🌱", "🌿", "🌳", "🌲", "🌴"];
    if (tree) {
        tree.textContent = stages[Math.min(growthStage - 1, stages.length - 1)];
    }
}


function updateChatCount() {
    if (chatCountDisplay) {
        chatCountDisplay.textContent = `${chatCount}/50`;
    }
}


function addAchievement(name) {
    if (!achievements.includes(name)) {
        achievements.push(name);
        localStorage.setItem(`${currentUser.username}_achievements`, JSON.stringify(achievements));
        updateAchievements();
    }
}


function updateAchievements() {
    if (achievementList) {
        achievementList.innerHTML = "";
        achievements.forEach(name => {
            const li = document.createElement("li");
            li.textContent = name;
            achievementList.appendChild(li);
        });
    }
}


window.incrementChatCount = function() {
    chatCount++;
    localStorage.setItem(`${currentUser.username}_chatCount`, chatCount);
    updateChatCount();

    if (chatCount === 5) addAchievement("🏅 Người Mới Bắt Đầu");
    if (chatCount === 10) addAchievement("🎖️ Người Trồng Cây Tập Sự");
    if (chatCount === 20) addAchievement("🏆 Nhà Làm Vườn Chuyên Nghiệp");
    if (chatCount === 30) addAchievement("🌟 Chuyên Gia Cây Cảnh");
    if (chatCount >= 50) {
        if (growthStage < 5) {
            growthStage++;
            localStorage.setItem(`${currentUser.username}_growthStage`, growthStage);
            updateTree();
        }
        addAchievement("🤖 Chuyên gia hội thoại AI");
    }
};


window.resetProgress = function() {
    localStorage.removeItem(`${currentUser.username}_chatCount`);
    localStorage.removeItem(`${currentUser.username}_growthStage`);
    localStorage.removeItem(`${currentUser.username}_achievements`);
    location.reload();
};


updateTree();
updateChatCount();
updateAchievements();

// 8a1 - Nguyen Binh Minh
