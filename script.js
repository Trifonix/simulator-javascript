function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let shuffledQuestions = shuffleArray([...questions]).slice(0, 20);
let currentQuestionIndex = 0;
let score = 0;
let wrongAnswers = 0;
let incorrectQuestions = [];
let enterBlocked = false;

const QUESTIONS_LENGTH = shuffledQuestions.length;
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer-input');
const progressBar = document.getElementById('progress-bar');

function showQuestion(question) {
    questionElement.textContent = '';
    answerInput.value = '';
    typeText(questionElement, question.q);
    answerInput.focus();
}

function typeText(element, text, index = 0) {
    if (index < text.length) {
        element.textContent += text.charAt(index);
        setTimeout(() => typeText(element, text, index + 1), 16);
    }
}

function updateProgressBar() {
    score++;
    const progress = (score / QUESTIONS_LENGTH) * 100;
    progressBar.style.width = `${progress}%`;
}

function displayCorrectAnswerAndMove() {
    answerInput.style.color = 'red';
    const correctAnswer = shuffledQuestions[currentQuestionIndex].a;
    setTimeout(() => {
        answerInput.value = correctAnswer;
        answerInput.style.color = 'lime';
    }, 1000);
    setTimeout(() => {
        answerInput.value = '';
        answerInput.style.color = '#FFA500';
        moveToNextQuestion();
        enterBlocked = false;
        answerInput.disabled = false;
        answerInput.focus();
    }, 3000);
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim();
    if (userAnswer === shuffledQuestions[currentQuestionIndex].a) {
        answerInput.style.color = 'lime';
        answerInput.value = '+1';
        updateProgressBar(score);
        setTimeout(() => {
            enterBlocked = false;
            answerInput.disabled = false;
            answerInput.focus();
            moveToNextQuestion();
        }, 1000);
    } else {
        wrongAnswers++;
        incorrectQuestions.push(shuffledQuestions[currentQuestionIndex]);
        displayCorrectAnswerAndMove();
    }
}

function moveToNextQuestion() {
    answerInput.style.color = '#FFA500';
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    } else {
        if (incorrectQuestions.length > 0) {
            shuffledQuestions = shuffleArray([...incorrectQuestions]);
            incorrectQuestions.length = 0;
            currentQuestionIndex = 0;
            showQuestion(shuffledQuestions[currentQuestionIndex]);
        } else {
            end();
        }
    }
}

function end() {
    enterBlocked = true;
    answerInput.disabled = true;
    questionElement.style.color = 'red';
    answerInput.style.color = 'lime';
    if (wrongAnswers) {
        questionElement.textContent = `Вы допустили ошибок: ${wrongAnswers}`;
        answerInput.value = `И дали правильных ответов: ${score}`;
    } else {
        questionElement.style.color = 'lime';
        questionElement.textContent = 'Без ошибок!';
        answerInput.value = `А правильных ответов: ${score}`;
    }
}

answerInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' && !enterBlocked) {
        event.preventDefault();
        if (answerInput.value.trim() !== '' && answerInput.value.trim() !== ' ') {
            enterBlocked = true;
            answerInput.disabled = true;
            checkAnswer();
        }
    }
});

showQuestion(shuffledQuestions[currentQuestionIndex]);
