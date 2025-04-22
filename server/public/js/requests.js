const testList = document.getElementById("testDropdown");
const QuestionList = document.getElementById("questionList");

function openPopup(id) {
    console.log(id);
 document.getElementById(id).style.display = "flex";
}

function closePopup(id) {
    
    var clist=document.getElementsByClassName("questoin");
    for (var i = 0; i < clist.length; ++i) { if (clist[i].checked = "checked") {console.log(clist[i].getAttribute("data-question-id"));} }
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

        console.log(data.tests);

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

function createTestItemHTML(testName, testId) {
    return `
    <option value="${testId}" data-class-id="${testId}">${testName}</option>
    `;
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
        QuestionList.innerHTML = `<ul id="myList">`;

        const response = await fetch(`/dash/listQuestions?testId=${testId}`);
        const data = await response.json();

        if (data.err) {
            return;
        }

        data.questions.forEach((question) => {
            QuestionList.innerHTML += createQuestionItemHTML(question.question, question.questionId);
        });

        QuestionList.innerHTML += `</ul>`;
    } catch (err) {
    }
}

function createQuestionItemHTML(questionText, questionId) {
    return `
    <li class="questoin", data-question-id="${questionId}">
        <input type="checkbox" /> ${questionText}
    </li>
    `;
}

/*

         <div id="questionsList">
                <p>Select questions for the test:</p>
                <ol>
                    <script>
                        </script>
                    <% if (!err && questions && questions.length> 0) {  %>
                        <% questions.forEach((question)=> { %>
                           
                            <li data-class-id="<%= question.questionId %>"><input type="checkbox" /> <%= question.question %></li>
                        <% }); %>
                    <% } %>
                </ol>
            </div>
*/

document.getElementById("createNewStuRequest").addEventListener("click", (e) => {

    // Get the users name from the form and testId from the testDropdown
    const usersName = document.getElementById("usersName").value;
    const testId = testDropdown.value;

    // Make fetch post to /dash/createNewStuRequest with the testId and usersName
    fetch("/dash/createNewStuRequest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            testId: testDropdown.value,
            usersName: usersName
        }),
    })

    // fetch("/dash/createNewStuRequest", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //         testId: testDropdown.value,
    //         questionIds: Array.from(QuestionList.querySelectorAll("input[type='checkbox']:checked")).map((checkbox) => checkbox.parentElement.getAttribute("value"))
    //     }),
    // })

})