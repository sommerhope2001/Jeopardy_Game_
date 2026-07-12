const uploadView = document.getElementById('uploadView');
const approvalView = document.getElementById('approvalView'); // Make sure this element matches your HTML ID

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('file-info');
const generateBtn = document.getElementById('generateBtn');
const questionsContainer = document.getElementById('questionsContainer');
const startGameBtn = document.getElementById('startGameBtn');

let selectedFile = null;
let generatedQuestions = [];

// File selection UI handlers
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => handleFile(e.target.files));
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.background = '#edf2f7'; });
dropZone.addEventListener('dragleave', () => dropZone.style.background = '#f8fafc');
dropZone.addEventListener('drop', (e) => { e.preventDefault(); handleFile(e.dataTransfer.files); });


function handleFile(file) {
    if (!file || file.length === 0) return;
    selectedFile = file[0];
    fileInfo.textContent = `Selected: ${selectedFile.name}`;
}

// Upload file and request strict JSON questions
generateBtn.addEventListener('click', async () => {
    if (!selectedFile) return alert('Please upload a study guide first.');

    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating 30 Questions... (takes a few seconds)';

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        const response = await fetch('http://localhost:5000/generate-quiz', {
            method: 'POST',
            body: formData
        });



        if (!response.ok) throw new Error('Failed to generate quiz.');

        const data = await response.json();
        generatedQuestions = data.questions;


        displayQuestions();
    } catch (error) {
        alert("Error: " + error.message);
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate 30 questions where the answer is only one word. The answer cannot be a sentence. ONLY ONE WORD.';
    }
});


// Render questions on the screen 
function displayQuestions() {
    if (uploadView) uploadView.classList.remove('active');
    if (approvalView) approvalView.classList.add('active');
    questionsContainer.innerHTML = '';

    generatedQuestions.forEach((q, index) => {
        const item = document.createElement('div');
        item.className = 'question-item';
        item.innerHTML = `
            <div>
                <div class="question-text">${index + 1}. ${q.question}</div>
                <div style="font-size:12px; color: #718096; margin-top:4px;"><strong>Correct Answer:</strong> ${q.correctAnswer}</div>
            </div>
        `;
        questionsContainer.appendChild(item);
    });
}




// Will take you to the gameboard
startGameBtn.addEventListener('click', async () => {
    sessionStorage.setItem('generatedQuestions', JSON.stringify(generatedQuestions));
    window.location.href = "/Frontend/GameBoard.html";


});
