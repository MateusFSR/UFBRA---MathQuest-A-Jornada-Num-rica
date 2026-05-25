// Seletores Globais de Telas
const screenLogin = document.getElementById('screen-login');
const screenMap = document.getElementById('screen-map');
const screenGame = document.getElementById('screen-game');

// Elementos Dinâmicos
const btnStart = document.getElementById('btn-start');
const studentNameInput = document.getElementById('student-name');
const playerNameSpan = document.querySelector('.player-name');
const scoreDisplay = document.getElementById('score');
const feedback = document.getElementById('feedback');
const levelBanner = document.getElementById('level-banner');
const levelTitleSpan = document.querySelector('.level-title');

let score = 0;
let currentLevel = 1;
let currentQuestions = [];
let questionIndex = 0;
let levelCorrectCount = 0;

// Navegação: Login -> Mapa
btnStart.addEventListener('click', () => {
    const name = studentNameInput.value.trim();
    if (name === "") {
        alert("Por favor, digite seu nome para começar!");
        return;
    }
    
    // Armazena e exibe o nome do jogador
    playerNameSpan.textContent = name;
    
    // Transiciona tela
    screenLogin.classList.remove('active');
    screenMap.classList.add('active');
});

// Navegação: Mapa -> Jogo
const btnLevel1 = document.getElementById('btn-level-1');
const btnLevel2 = document.getElementById('btn-level-2');
const btnLevel3 = document.getElementById('btn-level-3');
const btnLevel4 = document.getElementById('btn-level-4');
const btnLevel5 = document.getElementById('btn-level-5');

btnLevel1.addEventListener('click', () => startLevel(1));
if (btnLevel2) btnLevel2.addEventListener('click', () => startLevel(2));
if (btnLevel3) btnLevel3.addEventListener('click', () => startLevel(3));
if (btnLevel4) btnLevel4.addEventListener('click', () => startLevel(4));
if (btnLevel5) btnLevel5.addEventListener('click', () => startLevel(5));

function startLevel(level) {
    // evita iniciar níveis bloqueados
    const btn = document.getElementById(`btn-level-${level}`);
    if (btn && btn.disabled) return;

    currentLevel = level;
    screenMap.classList.remove('active');
    screenGame.classList.add('active');
    feedback.textContent = "";
    levelBanner.classList.remove('show');

    // seleciona o conjunto de perguntas do nível
    currentQuestions = questionsByLevel[level] ? questionsByLevel[level].slice() : [];
    questionIndex = 0;
    levelCorrectCount = 0;
    if (currentQuestions.length === 0) {
        // Placeholder: quando não há conteúdo pronto
        feedback.textContent = "🎯 Nível em construção — volte mais tarde!";
        return;
    }
    levelTitleSpan.textContent = getLevelTitle(level);
    loadQuestion(questionIndex);
}

// Voltar dos menus
document.getElementById('btn-back-login').addEventListener('click', () => {
    screenMap.classList.remove('active');
    screenLogin.classList.add('active');
});

document.getElementById('btn-back-map').addEventListener('click', () => {
    screenGame.classList.remove('active');
    screenMap.classList.add('active');
});

// Lógica de Validação da Resposta (Game Loop estático)
const optionButtons = document.querySelectorAll('.option-btn');

optionButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const isCorrect = e.target.getAttribute('data-correct') === 'true';

        if (isCorrect) {
            feedback.textContent = "✨ Muito bem! Resposta Correta! ✨";
            feedback.className = "feedback-msg correct";
            score += 10;
            scoreDisplay.textContent = score;
            levelCorrectCount++;

            disableOptions();

            // Próxima pergunta ou fim de nível
            setTimeout(() => {
                if (questionIndex < currentQuestions.length - 1) {
                    questionIndex++;
                    loadQuestion(questionIndex);
                } else {
                    finishLevel(currentLevel);
                }
            }, 900);
        } else {
            feedback.textContent = "❌ Tente novamente! Observe bem as partes pintadas.";
            feedback.className = "feedback-msg wrong";
        }
    });
});

function disableOptions() {
    optionButtons.forEach(btn => btn.disabled = true);
    setTimeout(() => {
        // Habilita novamente (quando a próxima pergunta for carregada ela reconfigura)
        optionButtons.forEach(btn => btn.disabled = false);
        feedback.textContent = "";
    }, 2500);
}

// ------------------ Novas Funções de Perguntas Dinâmicas ------------------
const questionsByLevel = {
    1: [
        { text: 'Qual fração representa a área colorida?', filled: 2, options: ['1/4','2/4','3/4','4/4'], correct: '2/4' },
        { text: 'Qual fração está colorida?', filled: 1, options: ['1/4','1/2','2/4','3/4'], correct: '1/4' },
        { text: 'Quantas fatias estão pintadas?', filled: 3, options: ['1/4','2/4','3/4','4/4'], correct: '3/4' },
        { text: 'Qual fração é igual a 1/2 em forma equivalente?', filled: 2, options: ['2/4','1/4','3/4','4/4'], correct: '2/4' },
        { text: 'Converta: 1/2 em decimal é:', filled: 2, options: ['0.25','0.5','0.75','1.0'], correct: '0.5' },
        { text: 'Some as frações: 1/4 + 1/4 =', filled: 2, options: ['1/4','1/2','2/4','3/4'], correct: '1/2' }
    ],
    2: [
        { text: 'Resolva: x + 5 = 12. x = ?', filled: 0, options: ['5','6','7','8'], correct: '7' },
        { text: 'Resolva: 3x = 12. x = ?', filled: 0, options: ['3','4','6','9'], correct: '4' },
        { text: 'Qual é o valor da expressão: 2 + 3 × 4?', filled: 0, options: ['20','14','10','18'], correct: '14' },
        { text: 'Proporção: 2 é para 6 como 3 é para ?', filled: 0, options: ['6','7','8','9'], correct: '9' },
        { text: 'Se 4a = 20, então a = ?', filled: 0, options: ['4','5','6','8'], correct: '5' }
    ],
    3: [
        { text: 'Área de um retângulo 3×4 é:', filled: 0, options: ['7','12','14','24'], correct: '12' },
        { text: 'Perímetro do mesmo retângulo (3×4) é:', filled: 0, options: ['7','12','14','24'], correct: '14' },
        { text: 'Qual a medida do ângulo reto?', filled: 0, options: ['45°','60°','90°','180°'], correct: '90°' },
        { text: 'Classifique o triângulo com lados 3,4,5 (especial):', filled: 0, options: ['Equilátero','Isósceles','Retângulo','Obtusângulo'], correct: 'Retângulo' },
        { text: 'Qual é a unidade comumente usada para medir ângulos?', filled: 0, options: ['metros','graus','litros','quilogramas'], correct: 'graus' }
    ]
    ,
    4: [
        { text: 'Qual destes números é primo?', filled: 0, options: ['4','6','7','9'], correct: '7' },
        { text: 'Qual é o menor número primo?', filled: 0, options: ['0','1','2','3'], correct: '2' },
        { text: 'Escolha o número composto:', filled: 0, options: ['11','13','15','17'], correct: '15' },
        { text: 'O número 2 é primo, verdadeiro ou falso?', filled: 0, options: ['Verdadeiro','Falso','',''], correct: 'Verdadeiro' }
    ],
    5: [
        { text: 'Quantos centímetros tem 2 metros?', filled: 0, options: ['20','200','2000','2'], correct: '200' },
        { text: 'Quantos mililitros tem 1 litro?', filled: 0, options: ['10','100','1000','10000'], correct: '1000' },
        { text: 'Se um copo tem 250 ml, quantos copos cabem em 1 litro?', filled: 0, options: ['2','3','4','5'], correct: '4' },
        { text: 'Converter: 500 cm = ? m', filled: 0, options: ['0.5','5','50','500'], correct: '5' }
    ]
};

function loadQuestion(i) {
    const q = currentQuestions[i];
    if (!q) return;
    // Atualiza pergunta
    const qh = document.querySelector('.question-box h3');
    qh.textContent = q.text;

    // Atualiza visual das fatias
    const frac = document.getElementById('fraction-visual');
    if (frac) {
        if (currentLevel === 1 && q.filled !== undefined) {
            frac.style.display = '';
            const slices = frac.querySelectorAll('.slice');
            slices.forEach((s, idx) => {
                if (idx < q.filled) s.classList.add('filled');
                else s.classList.remove('filled');
            });
        } else {
            // Oculta o círculo para níveis que não usam a visualização de fração
            frac.style.display = 'none';
        }
    }

    // Embaralha opções e aplica nos botões
    const shuffled = shuffleArray(q.options.slice());
    optionButtons.forEach((btn, idx) => {
        btn.textContent = shuffled[idx] || '';
        btn.setAttribute('data-correct', (shuffled[idx] === q.correct).toString());
        btn.disabled = false;
    });
    feedback.textContent = '';
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function finishLevel(level) {
    levelBanner.textContent = `🎉 Parabéns — Nível ${level} concluído!`;
    levelBanner.classList.add('show');
    // desbloqueia próximo nível, se existir
    unlockLevel(level + 1);
}

function unlockLevel(level) {
    const btn = document.getElementById(`btn-level-${level}`);
    if (!btn) return;
    btn.disabled = false;
    btn.classList.remove('locked');
    btn.classList.add('active');
    const status = btn.querySelector('.status');
    if (status) status.textContent = 'Disponível';
}

function getLevelTitle(level) {
    if (level === 1) return '🏝️ Ilha das Frações';
    if (level === 2) return '⛰️ Montanha de Algebrismo';
    if (level === 3) return '🏰 Castelo da Geometria';
    return 'Missão';
}