document.addEventListener("DOMContentLoaded", function () {
   
    const avatarInput = document.getElementById("avatar-upload");
    const avatarImg = document.getElementById("profile-avatar");

    
    const savedAvatar = localStorage.getItem("user_avatar");
    if (savedAvatar) {
        avatarImg.src = savedAvatar;
    }

   
    avatarInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        
        if (!file) return;

        
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validTypes.includes(file.type)) {
            alert("❌ Chỉ chấp nhận ảnh JPG, PNG hoặc GIF!");
            return;
        }

        
        const reader = new FileReader();
        reader.onload = function (e) {
            avatarImg.src = e.target.result;
            avatarImg.classList.add("fade-in"); 

            
            localStorage.setItem("user_avatar", e.target.result);

            
            setTimeout(() => avatarImg.classList.remove("fade-in"), 500);
        };
        reader.readAsDataURL(file);
    });
});

///*<!--8a1 - Nguyen Binh MInh-->*/
