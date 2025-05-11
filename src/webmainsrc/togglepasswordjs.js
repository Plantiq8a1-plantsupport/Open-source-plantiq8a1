function togglePassword() {
    var passwordInput = document.getElementById("login-password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}


// 8a1 - Nguyen Binh Minh