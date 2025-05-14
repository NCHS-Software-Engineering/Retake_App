const testList = document.getElementById("testDropdown");
const QuestionList = document.getElementById("questionList");
const input = document.getElementById("studentEmail");
const suggestions = document.getElementById("suggestions");

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

async function getStudents(query) {
    try {
      // Make a GET request to the backend, sending the query as a parameter
      const response = await fetch(`/dash/getStudentEmailsByLetters?letters=${encodeURIComponent(query)}`);
      // Check if the response is okay (status 200)
      if (!response.ok) {
        throw new Error("Failed to fetch data from server");
      }

      // Parse the JSON response
      const students = await response.json();
      return students;  // Assume the response is an array of student emails
    } catch (error) {
      console.error("Error fetching students:", error);
      return [];  // Return an empty array if there's an error
    }
  }




  ////////////////////////////////////////////////////////////// getStudents function works just fine, issue in here
let debounceTimeout;

  input.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    const query = input.value.trim();

    suggestions.innerHTML = "";

    if (query.length > 0) {
      // Show spinner immediately
      const spinner = document.createElement("div");
      spinner.className = "spinner";
      suggestions.appendChild(spinner);

      debounceTimeout = setTimeout(() => {
        getStudents(query).then((results) => {
          console.log("Results:", results.students); // Log the results for debugging
          suggestions.innerHTML = "";

          results.students.forEach(student => {
            const div = document.createElement("div");
            div.innerHTML = `<p>${student.username}</p> <p>${student.email}</p>`;
            div.classList.add("studentChoice");
            div.classList.add("request-item");
            div.setAttribute("data-student-id", student.userId);
            div.onclick = () => {
              input.value = student.email;
              suggestions.innerHTML = "";
              input.datauserId = student.userId; // Store the userId in the input field
            };
            suggestions.appendChild(div);
          });

          if (results.length === 0) {
            const noResults = document.createElement("div");
            noResults.textContent = "No matches found.";
            noResults.classList.add("suggestion");
            suggestions.appendChild(noResults);
          }
        }).catch((error) => {
          console.error("Error fetching students:", error);
        });
      }, 2000);
    }
  });
//////////////////////////////////////////////////////////////////



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
            QuestionList.innerHTML += createQuestionItemHTML(question.question, question.questionNum);
        });

        QuestionList.innerHTML += `</ul>`;
    } catch (err) {
    }
}

function createQuestionItemHTML(questionText) {
    return `
    <li class="questoin", id="${questionText}">
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
    const usersId = input.datauserId;
    const testId = testDropdown.value;
    let selectedQuestionIds = "";

const checkboxes = document.querySelectorAll(".questoin input[type='checkbox']");
checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
        if (selectedQuestionIds !== "") {
            selectedQuestionIds += "/n";
        }
        selectedQuestionIds += checkbox.parentElement.id;
    }
});
    fetch("/dash/createNewStuRequest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            testId: testDropdown.value,
            usersId: usersId,
            questionString: selectedQuestionIds
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