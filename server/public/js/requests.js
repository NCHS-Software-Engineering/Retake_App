const questionsContainer = document.getElementById("questionsContainer");

async function renderQuestions(selectedQuestionId = null) {
    try {
        const response = await fetch("/dash/listQuestiones");
        const data = await response.json();

        if (data.err) {
            alertStatus(true, data.err);
            return;
        }

        questionList.innerHTML = "";

        data.questions.forEach((Question) => {
            QuestionList.innerHTML += createquestionItemHTML(Suestion, selectedQuestionId);
        });

        addListenersForQuestionItems();

        // If a Question is already selected, enable tests and render them
        if (selectedQuestionId !== null) {
            testContainer.questionList.remove("disabled");
            await renderTests(selectedQuestionId);
        }
    } catch (err) {
        console.error("Error fetching questions:", err);
    }
}

function createQuestionItemHTML(questionObj, selectedQuestionId) {
    const isSelected = selectedQuestionId === questionObj.questionId;
    const selectBtnText = isSelected ? "Deselect" : "Select";
    const selectedQuestion = isSelected ? "selected" : "";

    return `
    <li><input type="checkbox" /> ${ questionObj.questionName }</li>
    `;
}

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
    questionRow.QuestionName = "test-question-row";

    const questionHeader = document.createElement("div");
    questionHeader.QuestionName = "test-question-header";

    const label = document.createElement("label");
    label.textContent = "";

    const deleteBtn = document.createElement("button");
    deleteBtn.QuestionName = "btn-delete-question";
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", () => {
        questionsContainer.removeChild(questionRow);
        renumberQuestions();
    });

    questionHeader.appendChild(label);
    questionHeader.appendChild(deleteBtn);

    const textarea = document.createElement("textarea");
    textarea.QuestionName = "test-question-textarea";
    textarea.value = initialText; // prefill if provided
    questionRow.appendChild(questionHeader);
    questionRow.appendChild(textarea);

    questionsContainer.appendChild(questionRow);

    renumberQuestions();
    questionRow.scrollIntoView({ behavior: "smooth", block: "start" });
}