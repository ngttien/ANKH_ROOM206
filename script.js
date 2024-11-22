let currentQuestion = 0;
let lives = 5;
let correctAnswerIndex = 0;
let isHelp50Used = false;
let isHelpCorrectUsed = false;
let questionPool = [];
let correctCount = 0;
let highestScore = localStorage.getItem('highestScore') || 0;
let currentGroup = 0; // Theo dõi nhóm câu hỏi hiện tại
const questionsPerPage = 10; // Số câu hỏi hiển thị mỗi lần là 10

// Load câu hỏi từ file JSON
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questionPool = data;  // Lưu câu hỏi vào questionPool
        totalQuestions = questionPool.length;

        // Hiển thị tổng số câu hỏi
        document.getElementById("score").querySelector("#total-questions").textContent = totalQuestions;
        document.getElementById("high-score").querySelector("#total-questions").textContent = totalQuestions;
        document.getElementById("highest-score").textContent = `${highestScore} / ${totalQuestions}`;
        
        displayQuestionCircles(); // Hiển thị nhóm đầu tiên của vòng tròn câu hỏi
        
        // Hiển thị câu hỏi đầu tiên
        loadQuestion();
    })
    .catch(error => {
        console.error("Lỗi khi tải dữ liệu câu hỏi:", error);
    });

// Hiển thị 10 vòng tròn câu hỏi tại một thời điểm
function displayQuestionCircles() {
    const questionTracker = document.getElementById("question-tracker");
    questionTracker.innerHTML = ""; // Xóa các vòng tròn cũ

    // Xác định câu hỏi bắt đầu và kết thúc cho nhóm hiện tại
    const startIndex = currentGroup * questionsPerPage;
    const endIndex = Math.min(startIndex + questionsPerPage, questionPool.length);

    for (let i = startIndex; i < endIndex; i++) {
        const circle = document.createElement('div');
        circle.classList.add('question-circle');
        circle.textContent = i + 1; // Hiển thị số câu hỏi
        questionTracker.appendChild(circle);
    }
}

// Tải câu hỏi hiện tại và hiển thị
function loadQuestion() {
    const questionObj = questionPool[currentQuestion];

    if (!questionObj) {
        finishGame();  // Kết thúc trò chơi nếu không còn câu hỏi nào
        return;
    }

    // Hiển thị câu hỏi
    document.getElementById("question").textContent = questionObj.question;

    // Cập nhật các câu trả lời
    const answerButtons = document.querySelectorAll(".answer");
    questionObj.answers.forEach((answer, index) => {
        answerButtons[index].textContent = answer; // Hiển thị nội dung đáp án
        answerButtons[index].disabled = false; // Bật lại khả năng chọn
        answerButtons[index].classList.remove("selected-correct", "selected-wrong"); // Xóa trạng thái cũ
    });

    // Cập nhật trạng thái vòng tròn câu hỏi
    const questionCircles = document.querySelectorAll(".question-circle");
    if (questionCircles.length > 0) {
        questionCircles[currentQuestion % questionsPerPage].style.backgroundColor = ""; // Reset màu
    }

    correctAnswerIndex = questionObj.correct; // Cập nhật đáp án đúng
}

// Kiểm tra đáp án khi người chơi chọn
function checkAnswer(button, index) {
    const questionObj = questionPool[currentQuestion];
    const answerButtons = document.querySelectorAll(".answer");
    const questionCircles = document.querySelectorAll(".question-circle");

    // Nếu người chơi chọn đúng
    if (index === questionObj.correct) {
        button.classList.add("selected-correct");
        questionCircles[currentQuestion % questionsPerPage].style.backgroundColor = "green";
        correctCount++;
        document.getElementById("correct-count").textContent = correctCount;

        setTimeout(() => {
            nextQuestion();
        }, 3000);
    } else {
        // Nếu chọn sai, tô đỏ đáp án sai
        button.classList.add("selected-wrong");
        const correctButton = answerButtons[correctAnswerIndex];
        correctButton.classList.add("selected-correct");  // Tô xanh đáp án đúng

        questionCircles[currentQuestion % questionsPerPage].style.backgroundColor = "red";  // Đổi màu vòng tròn câu hỏi thành đỏ

        // Trừ mạng sống
        lives--;
        document.getElementById("lives-count").textContent = lives;

        // Kiểm tra nếu không còn mạng sống
        if (lives <= 0) {
            gameOver();  // Gọi hàm kết thúc trò chơi khi hết mạng
        } else {
            setTimeout(() => {
                nextQuestion();
            }, 3000);
        }
    }
    answerButtons.forEach(btn => btn.disabled = true);
}

// Tiến đến câu hỏi tiếp theo
function nextQuestion() {
    currentQuestion++;

    // Nếu chuyển sang nhóm câu hỏi tiếp theo
    if (currentQuestion % questionsPerPage === 0) {
        currentGroup++;
        displayQuestionCircles(); // Hiển thị nhóm vòng tròn câu hỏi tiếp theo
    }
    
    loadQuestion();
}

// Sử dụng trợ giúp 50/50
function useHelp50() {
    if (isHelp50Used) {
        alert("Bạn đã sử dụng quyền trợ giúp 50/50 rồi!");
        return;
    }

    const answerButtons = document.querySelectorAll(".answer");
    let hiddenCount = 0;

    // Ẩn hai đáp án sai
    answerButtons.forEach((button, index) => {
        if (index !== correctAnswerIndex && hiddenCount < 2) {
            button.textContent = ""; // Xóa nội dung của đáp án sai
            button.disabled = true; // Vô hiệu hóa nút
            hiddenCount++;
        }
    });

    isHelp50Used = true; // Đánh dấu đã sử dụng
    document.getElementById("help-50").disabled = true; // Vô hiệu hóa nút 50/50
}

// Sử dụng trợ giúp chọn đáp án đúng
function useHelpCorrect() {
    if (isHelpCorrectUsed) {
        alert("Bạn đã sử dụng quyền trợ giúp chọn đáp án đúng rồi!");
        return;
    }

    const answerButtons = document.querySelectorAll(".answer");
    const correctButton = answerButtons[correctAnswerIndex];

    correctButton.click(); // Gọi hàm `checkAnswer()` cho nút đúng
    isHelpCorrectUsed = true; // Đánh dấu đã sử dụng
    document.getElementById("help-correct").disabled = true; // Vô hiệu hóa nút Chọn đáp án đúng
}

// Kết thúc trò chơi khi hết mạng
function gameOver() {
    const playAgain = confirm("Bạn đã hết lượt! Bạn có muốn chơi lại từ đầu không?");
    if (playAgain) {
        resetGame();
    } else {
        alert("Cảm ơn bạn đã chơi! Trò chơi sẽ kết thúc.");
        window.location.href = 'login.html'; // Chuyển hướng đến trang khác
    }
}

// Đặt lại trạng thái trò chơi
function resetGame() {
    currentQuestion = 0;
    lives = 5;
    correctCount = 0;
    currentGroup = 0;
    isHelp50Used = false;
    isHelpCorrectUsed = false;

    document.getElementById("lives-count").textContent = lives;
    document.getElementById("correct-count").textContent = correctCount;

    document.getElementById("help-50").disabled = false;
    document.getElementById("help-correct").disabled = false;

    displayQuestionCircles();
    loadQuestion();
}

// Kết thúc trò chơi khi hoàn thành
function finishGame() {
    alert("Bạn đã hoàn thành trò chơi!");
    // Logic lưu kết quả hoặc xử lý thêm
}
