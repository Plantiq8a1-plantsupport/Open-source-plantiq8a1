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
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Mật khẩu của bạn hoặc tên người dùng sai!");
        return;
    }

    let userCount = localStorage.getItem("user_count") || 0;
    userCount++;

    let userData = {
        username: username,
        email: email,
        password: password,
    };

    localStorage.setItem(`user_${userCount}`, JSON.stringify(userData));
    localStorage.setItem("user_count", userCount);

    alert("Đăng ký thành công!");
    window.location.href = "login.html";
}

function loginUser() {
    let username = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;

    let userCount = localStorage.getItem("user_count") || 0;
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
        window.location.href = "verify.html"; 
    } else {
        alert("Mật khẩu của bạn hoặc tên người dùng sai!");
    }
}

// 8a1 - Nguyen Binh MInh