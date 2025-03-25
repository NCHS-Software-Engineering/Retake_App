const questionsContainer = document.getElementById("questionsContainer");

function showTestForm(testName, questions) {
    questionsContainer.innerHTML = "";

    testFormTitle.textContent = testName || "Untitled Test";

    if (questions && questions.length > 0) {
        questions.forEach(q => {
            addQuestionToForm(q.question);
        });
    }
}
function addQuestionToForm(initialText = "") {
    const questionRow = document.createElement("div");
    questionRow.className = "test-question-row";

    const questionHeader = document.createElement("div");
    questionHeader.className = "test-question-header";

    const label = document.createElement("label");
    label.textContent = "";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete-question";
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", () => {
        questionsContainer.removeChild(questionRow);
        renumberQuestions();
    });

    questionHeader.appendChild(label);
    questionHeader.appendChild(deleteBtn);

    const textarea = document.createElement("textarea");
    textarea.className = "test-question-textarea";
    textarea.value = initialText; // prefill if provided
    questionRow.appendChild(questionHeader);
    questionRow.appendChild(textarea);

    questionsContainer.appendChild(questionRow);

    renumberQuestions();
    questionRow.scrollIntoView({ behavior: "smooth", block: "start" });
}