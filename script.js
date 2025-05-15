function createSnow() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    

    snowflake.style.left = Math.random() * 100 + 'vw';
    

    const animationDuration = Math.random() * 3 + 2;
    snowflake.style.animation = `snowfall ${animationDuration}s linear`;
    
    document.body.appendChild(snowflake);
    

    setTimeout(() => {
        snowflake.remove();
    }, animationDuration * 1000);
}


setInterval(createSnow, 100);

let currentQuestion;
let score;
let timer;
let timeLeft;
let isAnswering;
let userAnswers;

const questions = [
    {
        question: " A função da linguagem predominante em textos jornalísticos, científicos e informativos é a:",
        options: ["A) emotiva", "B) metalinguística", "C) referencial", "D) poética"],
        correct: 2,
        explanation: "✅ Resposta correta: C\nExplicação: A função referencial (ou denotativa) tem como foco o conteúdo da mensagem, transmitindo informações de forma objetiva."
    },
    {
        question: " Na frase: \"Estou muito triste com tudo isso que aconteceu.\", a função da linguagem predominante é:",
        options: ["A) referencial", "B) emotiva", "C) fática", "D) conativa"],
        correct: 1,
        explanation: "✅ Resposta correta: B\nExplicação: A função emotiva (ou expressiva) tem como foco o emissor e transmite sentimentos, emoções ou opiniões pessoais."
    },
    {
        question: " Assinale a alternativa em que a linguagem está sendo usada na função metalinguística:",
        options: [
            "A) \"Leia este texto com atenção.\"",
            "B) \"A palavra 'casa' é um substantivo comum e concreto.\"",
            "C) \"As flores sorriam para o sol da manhã.\"",
            "D) \"Eu te amo com todas as minhas forças!\""
        ],
        correct: 1,
        explanation: "✅ Resposta correta: B\nExplicação: A função metalinguística ocorre quando a linguagem fala de si mesma, como quando explicamos regras gramaticais ou definimos palavras."
    }
];

function clearMemory() {
    currentQuestion = 0;
    score = 0;
    if (timer) clearInterval(timer);
    timer = null;
    timeLeft = 20;
    isAnswering = false;
    userAnswers = [];
    
    const options = document.querySelectorAll('.option-button');
    options.forEach(button => {
        button.disabled = false;
        button.style.backgroundColor = '';
    });
}

function startGame() {
    clearMemory();
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    document.querySelector('.score').textContent = `Pontuação: ${score}`;
    loadQuestion();
    startTimer();
}

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        endGame();
        return;
    }

    const question = questions[currentQuestion];
    const questionContainer = document.querySelector('.question-container');
    const optionsGrid = document.querySelector('.options-grid');
    const options = document.querySelectorAll('.option-button');


    questionContainer.classList.add('fade-out');
    optionsGrid.classList.add('fade-out');

    setTimeout(() => {

        document.querySelector('.question').textContent = question.question;
        options.forEach((button, index) => {
            button.textContent = question.options[index];
            button.disabled = false;
            button.style.backgroundColor = '';
            if (index === 0) button.style.backgroundColor = 'var(--pastel-orange)';
            if (index === 1) button.style.backgroundColor = 'var(--pastel-peach)';
            if (index === 2) button.style.backgroundColor = 'var(--pastel-coral)';
            if (index === 3) button.style.backgroundColor = 'var(--pastel-apricot)';
        });


        questionContainer.classList.remove('fade-out');
        optionsGrid.classList.remove('fade-out');

        questionContainer.classList.add('question-animate');
        optionsGrid.classList.add('fade-in');


        setTimeout(() => {
            questionContainer.classList.remove('question-animate');
            optionsGrid.classList.remove('fade-in');
        }, 500);

    }, 500);

    timeLeft = 20;
    updateTimer();
    isAnswering = false;
}

function startTimer() {
    if (timer) clearInterval(timer);
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (!isAnswering) {
                isAnswering = true;
                userAnswers.push({ 
                    question: questions[currentQuestion].question,
                    userAnswer: null,
                    correctAnswer: questions[currentQuestion].options[questions[currentQuestion].correct],
                    isCorrect: false
                });
                nextQuestion();
            }
        }
    }, 1000);
}

function updateTimer() {
    document.querySelector('.timer').textContent = timeLeft;
}

function checkAnswer(selectedOption) {
    if (isAnswering) return;
    isAnswering = true;
    
    clearInterval(timer);
    
    const correct = questions[currentQuestion].correct;
    const options = document.querySelectorAll('.option-button');
    
    options.forEach(button => button.disabled = true);
    
    options[correct].style.backgroundColor = 'var(--correct-green)';
    
    const isCorrect = selectedOption === correct;
    if (isCorrect) {
        score += 1;
        document.querySelector('.score').textContent = `Acertos: ${score}`;
    } else {
        options[selectedOption].style.backgroundColor = 'var(--wrong-red)';
    }

    userAnswers.push({
        question: questions[currentQuestion].question,
        userAnswer: questions[currentQuestion].options[selectedOption],
        correctAnswer: questions[currentQuestion].options[correct],
        isCorrect: isCorrect
    });

    setTimeout(nextQuestion, 1500);
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion();
    startTimer();
}

function endGame() {
    if (timer) clearInterval(timer);

    let summaryHTML = `
        <h2 style="color: white; margin-bottom: 20px; text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);">Fim de Jogo!</h2>
        <p class="score">Pontuação Final: ${score} de ${questions.length}</p>
        <div class="answers-summary">
            <h3 style="color: white; text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);">Resumo das Respostas:</h3>
    `;

    userAnswers.forEach((answer, index) => {
        const icon = answer.isCorrect ? '✅' : '❌';
        const question = questions[index];
        summaryHTML += `
            <div class="answer-item" style="text-align: left; margin: 15px 0; padding: 15px; background: rgba(42, 43, 77, 0.95); border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.1); color: white;">
                <p style="margin-bottom: 10px;"><strong style="color: #BEA7FA;">Questão ${index + 1}:</strong> ${answer.question} ${icon}</p>
                <p style="margin-left: 20px; margin-bottom: 8px; color: rgba(255, 255, 255, 0.9);">Sua resposta: ${answer.userAnswer || 'Tempo esgotado'}</p>
                ${!answer.isCorrect ? `<p style="margin-left: 20px; color: #AD98F9;">Resposta correta: ${answer.correctAnswer}</p>` : ''}
                <div class="explanation-box" style="display: none; margin-left: 20px; margin-top: 10px; padding: 12px; background: rgba(62, 63, 97, 0.95); border-radius: 8px; color: white; border: 1px solid rgba(255, 255, 255, 0.15);">
                    ${question.explanation}
                </div>
            </div>
        `;
    });

    summaryHTML += `
        </div>
        <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px; align-items: center;">
            <button class="start-button" onclick="location.reload()">Jogar Novamente</button>
            <button class="explanation-button" onclick="toggleExplanations()" style="
                background: var(--pastel-orange);
                color: white;
                padding: 1rem 2rem;
                border: none;
                border-radius: 25px;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
            ">Ver Explicações</button>
        </div>
    `;

    document.getElementById('game-container').innerHTML = summaryHTML;
}

function toggleExplanations() {
    const explanations = document.querySelectorAll('.explanation-box');
    const button = document.querySelector('.explanation-button');
    const isHidden = explanations[0].style.display === 'none';
    
    explanations.forEach(exp => {
        exp.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
            exp.style.animation = 'fadeIn 0.5s ease forwards';
        }
    });
    
    button.textContent = isHidden ? 'Ocultar Explicações' : 'Ver Explicações';
    button.style.background = isHidden ? 'var(--pastel-coral)' : 'var(--pastel-orange)';
}

function typeWriterEffect() {
    const titles = [
        "Working...",
    ];
    
    let currentTitleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 1000;

    function type() {
        const currentTitle = titles[currentTitleIndex];
        
        if (isDeleting) {
            document.title = currentTitle.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = 500;
        } else {
            document.title = currentTitle.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = Math.random() * 500;
        }

        if (!isDeleting && currentCharIndex === currentTitle.length) {
            isDeleting = true;
            typingSpeed = 500;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentTitleIndex = (currentTitleIndex + 1) % titles.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

typeWriterEffect();

clearMemory(); 