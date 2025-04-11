const testList = document.getElementById("testDropdown");
const QuestionList = document.getElementById("questionList");

function openPopup(id) {
    document.getElementById(id).style.display = "flex";
}

function closePopup(id) {
    document.getElementById(id).style.display = "none";
}

const classDropdown = document.getElementById("classDropdown");

classDropdown.addEventListener("change", (e) => {
    const selectedOption = e.target.selectedOptions[0];
    const classId = selectedOption.getAttribute("data-class-id");

    if (classId) {
        renderTests(classId);
    }
});

const testDropdown = document.getElementById("testDropdown");

testDropdown.addEventListener("change", (e) => {
    const selectedOption = e.target.selectedOptions[0];
    const testId = selectedOption.value;

    if (testId) {
        renderQuestions(testId);
    }
});

async function renderTests(classId){
    /*
    <% if (!err && tests && tests.length> 0) {  %>
        <% tests.forEach((test)=> { %>
            <option data-class-id="<%= test.testId %>"><%= test.testName %></option>
        <% }); %>
    <% } %>
    */
    try {
        testList.innerHTML = `<option value="" disabled selected>Select a test</option>`;

        const response = await fetch(`/dash/listTests?classId=${classId}`);
        const data = await response.json();

        if (data.err) {
            return;
        }

        data.tests.forEach((test) => {
            testList.innerHTML += createTestItemHTML(test.testName, test.testId);
        });

        addListenersForTestItems();
    } catch (err) {
    }
}

function createClassItemHTML(testName, testId) {
    return `
    <option value="${testId}">${testName}</option>
    `;
}

async function renderQuestions(testId){
    /*
    <ol>
        <% if (!err && questions && questions.length> 0) {  %>
            <% questions.forEach((question)=> { %>
                <li data-class-id="<%= question.questionId %>"><input type="checkbox" /> <%= question.text %></li>
            <% }); %>
        <% } %>
    </ol>
    */
    try {
        questionList.innerHTML = `<ol>`;

        const response = await fetch(`/dash/listQuestions?testId=${testId}`);
        const data = await response.json();

        if (data.err) {
            return;
        }

        data.questions.forEach((question) => {
            questionList.innerHTML += createQuestionItemHTML(question.text, question.questionId);
        });

        questionList.innerHTML += `</ol>`;
    } catch (err) {
    }
}

function createQuestionItemHTML(questionText, questionId) {
    return `
    <li value="${questionId}"><input type="checkbox" /> ${questionText}</li>
    `;
}