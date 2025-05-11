function togglePassword2() {
    var passwordInput = document.getElementById("confirm-password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

// 8a1- Nguyen BInh Minh