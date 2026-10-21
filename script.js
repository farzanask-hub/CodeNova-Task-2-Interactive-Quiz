const screens = {
  welcome: document.getElementById('welcome-screen'),
  quiz: document.getElementById('quiz-screen'),
  result: document.getElementById('result-screen')
};

const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const reviewButton = document.getElementById('review-btn');
const answersContainer = document.getElementById('answers');
const feedback = document.getElementById('feedback');

let questions = [];
let currentIndex = 0;
let score = 0;
let hasAnswered = false;
let userAnswers = [];

function showScreen(name) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    if (!response.ok) throw new Error('Question file could not be loaded.');
    questions = await response.json();
    if (!Array.isArray(questions) || questions.length === 0) throw new Error('No questions found.');
    startQuiz();
  } catch (error) {
    // Helpful fallback for environments that open the page directly as a file.
    questions = [
      {question:'Which language structures a web page?',options:['CSS','HTML','JavaScript','Python'],answer:1,explanation:'HTML defines the structure of web content.'},
      {question:'Which CSS property changes text color?',options:['font-style','background-color','color','text-align'],answer:2,explanation:'The color property changes text color.'},
      {question:'Which keyword declares a reassignable block-scoped variable?',options:['const','let','static','define'],answer:1,explanation:'let declares a block-scoped variable that can be reassigned.'},
      {question:'What is Flexbox mainly used for?',options:['Database tables','Image editing','One-dimensional layouts','Server APIs'],answer:2,explanation:'Flexbox arranges items in a row or column.'},
      {question:'Which element represents main navigation?',options:['nav','footer','aside','strong'],answer:0,explanation:'The nav element marks a navigation section.'}
    ];
    startQuiz();
  }
}

function startQuiz() {
  currentIndex = 0;
  score = 0;
  hasAnswered = false;
  userAnswers = [];
  showScreen('quiz');
  renderQuestion();
}

function renderQuestion() {
  const question = questions[currentIndex];
  hasAnswered = false;
  document.getElementById('question-count').innerHTML =
    `${String(currentIndex + 1).padStart(2, '0')} <span>/ ${String(questions.length).padStart(2, '0')}</span>`;
  document.getElementById('question-number').textContent =
    `QUESTION ${String(currentIndex + 1).padStart(2, '0')}`;
  document.getElementById('question-title').textContent = question.question;
  const percent = Math.round((currentIndex / questions.length) * 100);
  document.getElementById('progress-percent').textContent = `${percent}%`;
  document.getElementById('progress-fill').style.width = `${percent}%`;
  document.getElementById('answer-hint').textContent = 'Select an answer to continue';
  nextButton.disabled = true;
  nextButton.innerHTML = currentIndex === questions.length - 1 ? 'See my results <span>→</span>' : 'Next question <span>→</span>';
  feedback.hidden = true;
  feedback.className = 'feedback';
  answersContainer.innerHTML = '';

  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-option';
    button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span><span></span>`;
    button.querySelector('span:last-child').textContent = option;
    button.addEventListener('click', () => chooseAnswer(index));
    answersContainer.appendChild(button);
  });
}

function chooseAnswer(selectedIndex) {
  if (hasAnswered) return; // Prevents duplicate answers and score changes.
  hasAnswered = true;
  const question = questions[currentIndex];
  const isCorrect = selectedIndex === question.answer;
  if (isCorrect) score++;
  userAnswers.push({ selectedIndex, isCorrect });
  const buttons = [...answersContainer.querySelectorAll('button')];

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === question.answer) button.classList.add('correct');
    if (index === selectedIndex && !isCorrect) button.classList.add('incorrect');
  });

  feedback.hidden = false;
  feedback.classList.toggle('wrong', !isCorrect);
  feedback.textContent = `${isCorrect ? '✓ Correct!' : 'Not quite — the correct answer is ' + question.options[question.answer] + '.'} ${question.explanation}`;
  document.getElementById('answer-hint').textContent = isCorrect ? 'Nice work! Ready for the next one?' : 'Keep going — you’ve got this.';
  document.getElementById('progress-percent').textContent =
    `${Math.round(((currentIndex + 1) / questions.length) * 100)}%`;
  document.getElementById('progress-fill').style.width =
    `${((currentIndex + 1) / questions.length) * 100}%`;
  nextButton.disabled = false;
}

function showResults() {
  showScreen('result');
  const percentage = Math.round((score / questions.length) * 100);
  document.getElementById('final-score').textContent = `${score}/${questions.length}`;
  document.getElementById('correct-count').textContent = score;
  document.getElementById('wrong-count').textContent = questions.length - score;
  document.getElementById('score-ring').style.background =
    `conic-gradient(var(--mint) ${percentage * 3.6}deg, #303958 ${percentage * 3.6}deg)`;

  let title = 'Look at you go!';
  let message = 'Every attempt makes you better. Keep going!';
  let icon = '🏆';
  if (percentage === 100) { title = 'Perfect score!'; message = 'Brilliant work — you got every question right!'; icon = '🏆'; }
  else if (percentage >= 60) { title = 'Great effort!'; message = 'You have a solid start. Keep that curiosity going!'; icon = '✨'; }
  else { title = 'Keep exploring!'; message = 'Every attempt is progress. Review the answers and try again!'; icon = '🌱'; }
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-subtitle').textContent = `You answered ${score} out of ${questions.length} questions correctly.`;
  document.getElementById('result-message').textContent = message;
  document.getElementById('result-icon').textContent = icon;

  const review = document.getElementById('review-list');
  review.innerHTML = '';
  questions.forEach((question, index) => {
    const item = document.createElement('div');
    item.className = 'review-item';
    const selected = userAnswers[index];
    item.innerHTML = `<strong>${index + 1}. ${question.question}</strong>`;
    const detail = document.createElement('span');
    detail.textContent = `${selected.isCorrect ? 'Correct' : 'Your answer: ' + question.options[selected.selectedIndex] + ' · Correct answer: ' + question.options[question.answer]}`;
    item.appendChild(detail);
    review.appendChild(item);
  });
  review.hidden = true;
  reviewButton.textContent = 'Review my answers';
}

startButton.addEventListener('click', loadQuestions);
nextButton.addEventListener('click', () => {
  if (!hasAnswered) return;
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    showResults();
  }
});
restartButton.addEventListener('click', startQuiz);
reviewButton.addEventListener('click', () => {
  const review = document.getElementById('review-list');
  review.hidden = !review.hidden;
  reviewButton.textContent = review.hidden ? 'Review my answers' : 'Hide answer review';
});
