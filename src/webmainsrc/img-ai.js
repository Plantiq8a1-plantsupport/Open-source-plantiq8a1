const apiKey = process.env.OPENAI_API_KEY;
const apiUrl = "https://api.openai.com/v1/chat/completions";
const iotApiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric";






class LRUCache {
    constructor(limit = 50, ttl = 2 * 60 * 60 * 1000) { 
        this.limit = limit;
        this.ttl = ttl;
        this.cache = new Map();
    }

    get(key) {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const { value, expires } = entry;
        if (Date.now() > expires) {
            this.cache.delete(key);
            return null;
        }
        this.cache.delete(key);
        this.cache.set(key, entry);
        return value;
    }

    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.limit) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, { value, expires: Date.now() + this.ttl });
    }

    cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.cache) {
            if (entry.expires <= now) {
                this.cache.delete(key);
            }
        }
    }
}

const responseCache = new LRUCache(100);
setInterval(() => responseCache.cleanup(), 60 * 1000);


let requestCount = 0;
let isBlocked = false;
let unblockTime = null;


async function fetchTemperature() {
    try {
        const response = await fetch(iotApiUrl);
        if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu thời tiết");
        const data = await response.json();
        
        temperature = data.main.temp; 
    } catch (error) {
        console.error("Lỗi API IoT:", error);
    }
}

setInterval(fetchTemperature, 5000);
fetchTemperature();


setInterval(fetchTemperature, 5000);

document.getElementById("send-btn").addEventListener("click", async () => {
    if (isBlocked) {
        const remainingTime = Math.ceil((unblockTime - Date.now()) / 60000);
        alert(`404 - Vui lòng thử lại sau ${remainingTime} phút.`);
        return;
    }

    requestCount++;
    if (requestCount > 200) {
        isBlocked = true;
        requestCount = 0;
        unblockTime = Date.now() + 90 * 60 * 1000; // 1h30m59s
        return;
    }


    const fileInput = document.getElementById("image-input");
    const aiResponseDiv = document.getElementById("ai-response");
    const file = fileInput.files[0];

    if (!file) {
        alert("Vui lòng chọn ảnh cây trồng để phân tích!");
        return;
    }

    displayImagePreview(file);

    aiResponseDiv.scrollTop = aiResponseDiv.scrollHeight;

    aiResponseDiv.innerText = "Đang phân tích ảnh cây trồng của bạn...";
    aiResponseDiv.classList.add("loading");
    aiResponseDiv.style.display = "block";

    let imageBase64;
    try {
        imageBase64 = await convertImageToBase64(file);
    } catch (error) {
        aiResponseDiv.innerText = "❌ Lỗi khi đọc ảnh!";
        return;
    }

    if (responseCache[imageBase64]) {
        aiResponseDiv.innerHTML = `<div>${responseCache[imageBase64]}</div>`;
        aiResponseDiv.classList.remove("loading");
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", 
                messages: [
                    {
                        role: "system",
                        content: "Bạn là chuyên gia chăm sóc cây tên 'Chuyên gia chăm sóc cây'. Bạn tự xưng là 'Tôi' và gọi người dùng là 'Bạn'. Nhiệm vụ của bạn là chẩn đoán cây bệnh, chăm sóc cây, tìm kiếm thông tin về cây và hướng dẫn trồng cây bằng cách phân tích hình ảnh của cây. Bạn không trả lời các câu hỏi không liên quan đến chủ đề cây."
                    },
                    {
                        role: "user",
                        content: [
                            { type: "image_url", image_url: { url: imageBase64 } },
                            { type: "text", text: `Phân tích ảnh cây trồng/nấm. Đánh giá sức khỏe, dinh dưỡng, tỉ lệ, và ảnh hưởng của nhiệt độ (${temperature}°C). Cung cấp tên (xem xét tỉ mỉ), dòng họ (xem xét tỉ mỉ), tình trạng, dinh dưỡng và lời khuyên.` }
                        ]
                    }
                ],
                max_tokens: 2048,
                temperature: 1.0,
                top_p: 1.0
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message);
        }

        const data = await response.json();
        const aiMessage = data.choices?.[0]?.message?.content || "Lỗi khi nhận phản hồi từ AI.";

        responseCache[imageBase64] = aiMessage;

        aiResponseDiv.innerHTML = `<div>AI:</div><div>${aiMessage.replace(/\n/g, '<br>')}</div>`;

        aiResponseDiv.classList.remove("loading");
    } catch (error) {
        aiResponseDiv.innerText = `❌ Lỗi khi kết nối đến AI: ${error.message}`;
        console.error(error);
    }
});

function displayImagePreview(file) {
    const imagePreview = document.getElementById("image-preview");
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Ảnh xem trước">`;
    };
    reader.readAsDataURL(file);
}

function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const aiResponseDiv = document.getElementById('ai-response');
    aiResponseDiv.innerHTML = `<div>AI: Chào bạn! Bạn cần giúp gì về cây cối hôm nay?</div>`;
  });

// <!--8a1 - Nguyen Binh MInh-->
