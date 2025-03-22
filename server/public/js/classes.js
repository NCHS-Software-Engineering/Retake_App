// --------------------------
// DOM ELEMENT REFERENCES
// --------------------------
const classList = document.getElementById("classes-list");
const testList = document.getElementById("tests-list");
const testContainer = document.getElementById("test-container");

// Add Item Popup
const addItemPopup = document.getElementById("addItemPopup");
const addItemPopupClose = document.getElementById("addItemPopup-close");
const addItemPopupTitle = document.getElementById("addItemPopup-title");
const addItemPopupInput = document.getElementById("addItemPopup-input");
const addItemPopupSave = document.getElementById("addItemPopup-save");

// Buttons
const addClassBtn = document.getElementById("add-class-btn");
const addTestBtn = document.getElementById("add-test-btn");

// Test Form Modal
const testFormOverlay = document.getElementById("testFormOverlay");
const testFormTitle = document.getElementById("testFormTitle");
const questionsContainer = document.getElementById("questionsContainer");
const addQuestionBtn = document.getElementById("addQuestionBtn");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");

// Draggables
const draggables = document.querySelectorAll('.draggable');
const container = document.querySelector(".scrollable");
const handles = document.querySelectorAll('.handle');


// --------------------------
// EVENT LISTENERS
// --------------------------
/////////////////////////////////////////////////////////
async function sendClassOrder(url = "/teacherClassesController/updateOrder") {
    const classContainer = [...container.querySelectorAll('.draggable')];

    if (!classContainer) {
        console.error("Class container not found.");
        return;
    }

    const classIds = classContainer.map(el => el.dataset.classId);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ classIds })  // Send the classIds array
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.msg);  // Success message
        } else {
            alert(`Error: ${data.err}`);
        }
    } catch (error) {
        console.error("Failed to save order:", error);
    }
}
//////////////////////////////////////////////////////////////


let thinBar = null;
let draggedItem = null;
let lastUpdate = 0;
const debounceDelay = 16; // ~60fps

container.addEventListener("mousedown", (e) => {
    const handle = e.target.closest(".handle"); // Ensure we're clicking the handle
    if (!handle) return; // Ignore clicks elsewhere

    e.preventDefault();
    draggedItem = handle.closest(".draggable");
    console.log(draggedItem);
    draggedItem.classList.add("dragging");

    // Clone for thin bar (drop indicator)
    thinBar = document.createElement("div");
    thinBar.classList.add("thin-bar");
    container.insertBefore(thinBar, draggedItem);

    // Set up drag simulation
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", onDrop, { once: true });
});

// Handle dragging via the handle
handles.forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
        console.log("pressed");
      if (e.target.closest('.item-buttons')) return; // Ignore if clicking a button
      e.preventDefault();
      draggedItem = handle.closest('.draggable');
      draggedItem.classList.add('dragging');

      // Clone for thin bar (drop indicator)
      thinBar = document.createElement('div');
      thinBar.classList.add('thin-bar');
      container.insertBefore(thinBar, draggedItem);

      // Set up drag simulation
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', onDrop, { once: true });
    });
  });

  // Handle dragging with debounce
  function onDrag(e) {
    e.preventDefault();
    const now = Date.now();
    if (now - lastUpdate < debounceDelay) return;
    lastUpdate = now;

    const afterElement = getDragAfterElement(container, e.clientY);
    if (afterElement == null) {
      container.appendChild(thinBar);
    } else {
      container.insertBefore(thinBar, afterElement);
    }
  }

  // Handle drop
  function onDrop() {
    document.removeEventListener('mousemove', onDrag);
    draggedItem.classList.remove('dragging');

    // Replace thin bar with original item
    container.insertBefore(draggedItem, thinBar);
    thinBar.remove();
    thinBar = null;

    // Update order display
    updateOrder();

    //reorder in db
    sendClassOrder();
  }

  // Get element to drop after
  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  // Update order display
  function updateOrder() {
    const order = [...container.querySelectorAll('.draggable')]
      .map(item => item.dataset.classId)
      .join(', ');
    document.getElementById('Order').innerHTML = `Order: ${order}`;
  }

  // Initial order display
  updateOrder();




// Close popup event
addItemPopupClose.addEventListener("click", closePopup);

// Add Class button
addClassBtn.addEventListener("click", () => {
    openAddItemPopup("Add Class", "", async (newClassName) => {
        await handleAddClass(newClassName);
    });
});

// Add Test button
addTestBtn.addEventListener("click", () => {
    openAddItemPopup("Add Test", "", async (newTestName) => {
        await handleAddTest(newTestName);
    });
});

// Add question to test form
addQuestionBtn.addEventListener("click", () => addQuestionToForm());

// Cancel editing test form
cancelBtn.addEventListener("click", () => {
    questionsContainer.innerHTML = "";
    hideTestForm();
});

// Save test form
saveBtn.addEventListener("click", async () => {
    const questionRows = questionsContainer.querySelectorAll(".test-question-row");
    let questionsData = [];

    questionRows.forEach((row, i) => {
        const textarea = row.querySelector("textarea");
        questionsData.push({
            number: i + 1,
            question: textarea.value
        });
    });

    const testId = parseInt(document.getElementById("testFormTitle").getAttribute("data-class-id"));
    console.log(testId);

    try {
        const res = await fetch("/dash/updateQuestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ testId: testId, questions: questionsData })
        })

        const result = await res.json();
        if (result.err) {
            alertStatus(true, result.err);
        } else {
            alertStatus(false, result.msg);
        }

    } catch (err) {
        if (err) {
            alertStatus(true, "Could not save the test questions");
        }
    }

    // Hide the form afterwards
    hideTestForm();
});

// --------------------------
// MAIN FUNCTIONS
// --------------------------

// Render all classes from the server, if a class is specified select it
async function renderClasses(selectedClassId = null) {
    try {
        const response = await fetch("/dash/listClasses");
        const data = await response.json();

        if (data.err) {
            alertStatus(true, data.err);
            return;
        }

        classList.innerHTML = "";

        data.classes.forEach((classObj) => {
            classList.innerHTML += createClassItemHTML(classObj, selectedClassId);
        });

        addListenersForClassItems();

        // If a class is already selected, enable tests and render them
        if (selectedClassId !== null) {
            testContainer.classList.remove("disabled");
            await renderTests(selectedClassId);
        }
    } catch (err) {
        console.error("Error fetching classes:", err);
    }
}

// Handle adding a new class, then re-render and select the new class
async function handleAddClass(newClassName) {
    try {
        const res = await fetch("/dash/saveClass", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ className: newClassName })
        });

        const result = await res.json();
        if (result.err) {
            alertStatus(true, result.err);
            return;
        }

        alertStatus(false, `${result.msg}`);
        await renderClasses(result.classId);
    } catch (err) {
        console.error(err);
        alertStatus(true, "Error creating class");
    }
}

// Handle adding a new test, then re-render tests for the selected class
async function handleAddTest(newTestName) {
    const selectedClass = document.querySelector(".item.selected");
    const classId = parseInt(selectedClass.getAttribute("data-class-id"));

    try {
        const res = await fetch("/dash/saveTest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ testName: newTestName, classId: classId })
        });

        const result = await res.json();
        if (result.err) {
            alertStatus(true, result.err);
            return;
        } else {
            // If a class is selected, rerender tests for that class
            await renderTests(classId);
            alertStatus(false, result.msg)
        }
    } catch (err) {
        alertStatus(true, "Error creating tests")
    }
}

// Render tests for the selected class
async function renderTests(classId) {
    try {
        testList.innerHTML = "";

        const response = await fetch(`/dash/listTests?classId=${classId}`);
        const data = await response.json();

        if (data.err) {
            alertStatus(true, data.err);
            return;
        }

        data.tests.forEach((test) => {
            testList.innerHTML += createTestItemHTML(test.testName, test.testId);
        });

        addListenersForTestItems();
    } catch (err) {
        alertStatus(true, "Error fetching tests")
    }
}

// Create the HTML for a class item
function createClassItemHTML(classObj, selectedClassId) {
    const isSelected = selectedClassId === classObj.classId;
    const selectBtnText = isSelected ? "Deselect" : "Select";
    const selectedClass = isSelected ? "selected" : "";

    return `
    <div class="item ${selectedClass} draggable" data-class-id="${classObj.classId}">
      <p>${classObj.className}</p>
      <div class="item-buttons">
        <button class="btn btn-select">${selectBtnText}</button>
        <button class="btn btn-rename">Rename</button>
        <button class="btn btn-delete">Delete</button>
      </div>
      <div class="handle"></div>
    </div>
    `;
}

// Create the HTML for a test item
function createTestItemHTML(testName, testId) {
    return `
    <div class="test-item" data-test-id="${testId}">
      <p>${testName}</p>
      <div class="item-buttons">
        <button class="btn btn-edit">Edit</button>
        <button class="btn btn-rename">Rename</button>
        <button class="btn btn-delete">Delete</button>
      </div>
    </div>
    `;
}

// --------------------------
// HELPER / UTILITY FUNCTIONS
// --------------------------

function getOrder() {
    const pTag = document.getElementById('Order');
    pTag.innerHTML = "";
    let word = "";
    const data = document.querySelectorAll('.draggable');
    for (let i = 0; i < data.length; i++) {
        word = word+", "+data[i].dataset.classId;
    }
    console.log(word);
    pTag.innerHTML = word;
}

// Add event listeners to each class item
function addListenersForClassItems() {
    const items = document.querySelectorAll("#classes-list .item");

    items.forEach(item => {
        const classId = item.getAttribute("data-class-id");
        const selectBtn = item.querySelector(".btn-select");
        const renameBtn = item.querySelector(".btn-rename");
        const deleteBtn = item.querySelector(".btn-delete");

        testContainer.classList.add("disabled");
        testList.innerHTML = "";

        selectBtn.addEventListener("click", (e) => {
            e.stopPropagation();  // Prevent interference with dragging
            handleSelectedClass(classId, item, selectBtn);
        });

        renameBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            openAddItemPopup("Rename Class", item.querySelector("p").textContent, async (newName) => {
                await renameClass(classId, newName);
            });
        });

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteClass(classId);
        });
    });
}

// Add event listeners to each test item
function addListenersForTestItems() {
    const testItems = document.querySelectorAll("#tests-list .test-item");

    testItems.forEach(testItem => {
        const testId = testItem.getAttribute("data-test-id");
        const editBtn = testItem.querySelector(".btn-edit");
        const renameBtn = testItem.querySelector(".btn-rename");
        const deleteBtn = testItem.querySelector(".btn-delete");

        editBtn.addEventListener("click", async () => {
            document.getElementById("testFormTitle").setAttribute("data-class-id", testId);

            try {
                const res = await fetch(`/dash/listQuestions?testId=${testId}`);
                const data = await res.json();
                if (data.err) {
                    alertStatus(true, data.err);
                    return;
                }
                showTestForm(data.testName, data.questions);
            } catch (err) {
                console.error("Cannot fetch test details", err);
                alertStatus(true, "Cannot load test details");
            }
        });

        renameBtn.addEventListener("click", () => {
            openAddItemPopup("Rename Test", testItem.querySelector("p").textContent, async (newTestName) => {
                await renameTest(testId, newTestName);
            });
        });

        deleteBtn.addEventListener("click", () => {
            deleteTest(testId);
        });
    });
}

// Select or Deselect a class, enable or disable the test container
async function handleSelectedClass(classId, item, selectBtn) {
    const isSelected = item.classList.contains("selected");

    if (isSelected) {
        item.classList.remove("selected");
        selectBtn.textContent = "Select";
        testContainer.classList.add("disabled");
        testList.innerHTML = "";
    } else {
        document.querySelectorAll(".item.selected").forEach(selectedItem => {
            selectedItem.classList.remove("selected");
            selectedItem.querySelector(".btn-select").textContent = "Select";
        });

        item.classList.add("selected");
        selectBtn.textContent = "Deselect";
        testContainer.classList.remove("disabled");

        await renderTests(classId);
    }
}

// Open a popup for adding/renaming
function openAddItemPopup(title, existingValue, callback) {
    addItemPopupTitle.textContent = title;
    addItemPopupInput.value = existingValue;
    addItemPopup.classList.add("active");

    addItemPopupSave.onclick = () => {
        const value = addItemPopupInput.value.trim();
        if (!value) return;
        callback(value);
        closePopup();
    };
}

// Close the popup
function closePopup() {
    addItemPopup.classList.remove("active");
}

// Rename a class 
async function renameClass(classId, newName) {
    try {
        const res = await fetch("/dash/renameClass", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ className: newName, classId: parseInt(classId) })
        })

        const result = await res.json();
        if (result.err) {
            alertStatus(true, result.err);
        } else {
            await renderClasses(); // Rerender classes
            alertStatus(false, result.msg);
        }
    } catch (err) {
        alertStatus(true, "Cant rename the class right now, try again later");
    }
}

// Rename a test 
async function renameTest(testId, newTestName) {
    try {
        const res = await fetch("/dash/renameTest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ testName: newTestName, testId: parseInt(testId) })
        })

        const result = await res.json();
        if (result.err) {
            alertStatus(true, result.err);
        } else {
            const selectedClass = document.querySelector(".item.selected");
            if (selectedClass) await renderTests(parseInt(selectedClass.getAttribute("data-class-id")));
            alertStatus(false, result.msg);
        }
    } catch (err) {
        alertStatus(true, "Error with renaming test");
    }
}

// Delete a class 
async function deleteClass(classId) {
    try {
        const res = await fetch("/dash/deleteClass", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ classId: classId })
        })

        const result = await res.json();
        if (result.err) {
            alertStatus(true, result.err);
        } else {
            testList.innerHTML = "";
            await renderClasses();
            alertStatus(false, result.msg);
        }
    } catch (err) {
        alertStatus(true, "Something went wrong, cant delete class, try again later.")
    }
}

// Delete a test 
async function deleteTest(testId) {
    try {
        const res = await fetch("/dash/deleteTest", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ testId: testId })
        })

        const result = await res.json();
        if (result.err) {
            alertStatus(true, result.err);
        } else {
            const selectedClass = document.querySelector(".item.selected");
            if (selectedClass) await renderTests(parseInt(selectedClass.getAttribute("data-class-id")));
            alertStatus(false, result.msg);
        }

    } catch (err) {
        alertStatus(true, "Something went wrong, cant delete test, try again later");
    }
}


// Alert box function
function alertStatus(err, msg) {
    const alertBox = document.createElement('div');
    alertBox.textContent = msg;
    Object.assign(alertBox.style, {
        position: 'fixed',
        bottom: '50px',
        right: '-400px',
        backgroundColor: err ? '#ff4d4d' : '#4caf50',
        color: 'white',
        padding: '15px 30px',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontWeight: 'bold',
        boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
        zIndex: '9999',
        transition: 'all 0.5s ease-in-out',
        opacity: '1',
        maxWidth: '400px',
        wordWrap: 'break-word',
    });
    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.style.right = '30px';
    }, 50);

    setTimeout(() => {
        alertBox.style.opacity = '0';
        alertBox.style.transform = 'translateY(20px)';
        setTimeout(() => {
            document.body.removeChild(alertBox);
        }, 500);
    }, 3000);
}

function showTestForm(testName, questions) {
    questionsContainer.innerHTML = "";

    testFormTitle.textContent = testName || "Untitled Test";

    if (questions && questions.length > 0) {
        questions.forEach(q => {
            addQuestionToForm(q.question);
        });
    }

    testFormOverlay.classList.remove("hidden");
}



// Hide the modal form 
function hideTestForm() {
    testFormOverlay.classList.add("hidden");
}


// Add a new question row to the form. 
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


// Renumber all questions in the container
function renumberQuestions() {
    const rows = questionsContainer.querySelectorAll(".test-question-row");
    rows.forEach((row, index) => {
        const label = row.querySelector("label");
        label.textContent = `Question ${index + 1}:`;

        const textarea = row.querySelector("textarea");
        textarea.placeholder = `Enter question ${index + 1} here...`;
    });
}

// Example fetch to update a test with new questions
async function updateTest(testId, questions) {
    try {
        const res = await fetch("/dash/updateTest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                testId,
                questions
            })
        });
        const data = await res.json();
        if (data.err) {
            alertStatus(true, data.err);
            return;
        }
        alertStatus(false, data.msg || "Test updated successfully");
    } catch (err) {
        alertStatus(true, "Error updating test");
    }
}

// --------------------------
// INITIALIZATION
// --------------------------
renderClasses();
testContainer.classList.add("disabled");