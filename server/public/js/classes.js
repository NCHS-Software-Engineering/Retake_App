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

// --------------------------
// EVENT LISTENERS
// --------------------------

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

// --------------------------
// MAIN FUNCTIONS
// --------------------------

// Render all classes from the server, if a class is specified select it
async function renderClasses(selectedClassId = null) {
    try {
        const response = await fetch("/dash/listClasses");
        const data = await response.json();

        if (data.err) {
            alert(data.err);
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
            alert(result.err);
            return;
        }

        alert(`${result.msg} (Class ID: ${result.classId})`);
        await renderClasses(result.classId);
    } catch (err) {
        console.error(err);
        alert("Error creating class");
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
            alert(result.err);
            return;
        } else {
            // If a class is selected, rerender tests for that class
            await renderTests(classId);
        }
    } catch (err) {
        alert("Error creating tests")
    }
}

// Render tests for the selected class
async function renderTests(classId) {
    try {
        testList.innerHTML = "";

        const response = await fetch(`/dash/listTests?classId=${classId}`);
        const data = await response.json();

        if (data.err) {
            alert(data.err);
            return;
        }

        data.tests.forEach((test) => {
            testList.innerHTML += createTestItemHTML(test.testName, test.testId);
        });

        addListenersForTestItems();
    } catch (err) {
        console.error("Error fetching tests:", err);
    }
}

// Create the HTML for a class item
function createClassItemHTML(classObj, selectedClassId) {
    const isSelected = selectedClassId === classObj.classId;
    const selectBtnText = isSelected ? "Deselect" : "Select";
    const selectedClass = isSelected ? "selected" : "";

    return `
    <div class="item ${selectedClass}" data-class-id="${classObj.classId}">
      <p>${classObj.className}</p>
      <div class="item-buttons">
        <button class="btn btn-select">${selectBtnText}</button>
        <button class="btn btn-rename">Rename</button>
        <button class="btn btn-delete">Delete</button>
      </div>
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

        selectBtn.addEventListener("click", () => {
            handleSelectedClass(classId, item, selectBtn);
        });

        renameBtn.addEventListener("click", () => {
            openAddItemPopup("Rename Class", item.querySelector("p").textContent, async (newName) => {
                await renameClass(classId, newName);
            });
        });

        deleteBtn.addEventListener("click", () => {
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

        editBtn.addEventListener("click", () => {
            // TODO: Implement "Edit Test" logic
            console.log(`Editing test with ID: ${testId}`);
            alert(`Editing test with ID: ${testId} (server logic not implemented).`);
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
        // /dash/renameClass body: className and classId
        const res = await fetch("/dash/renameClass", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ className: newName, classId: parseInt(classId) })
        })

        const result = await res.json();
        if (result.err) {
            alert(result.err);
        } else {
            await renderClasses(); // Rerender classes
            alert(result.msg);
        }
    } catch (err) {
        console.log(err);
        alert("Cant rename the class right now, try again later");
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
            alert(result.err);
        } else {
            const selectedClass = document.querySelector(".item.selected");
            if (selectedClass) await renderTests(parseInt(selectedClass.getAttribute("data-class-id")));
            alert(result.msg);
        }
    } catch (err) {
        console.log("Err");
        alert(err);
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
            alert(result.err);
        } else {
            testList.innerHTML = "";
            await renderClasses();
            alert(result.msg);
        }
    } catch (err) {
        alert("Something went wrong, cant delete class, try again later.")
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
        if(result.err) {
            alert(result.err);
        } else {
            const selectedClass = document.querySelector(".item.selected");
            if (selectedClass) await renderTests(parseInt(selectedClass.getAttribute("data-class-id")));
            alert(result.msg);
        }

    } catch (err) {
        alert("Something went wrong, cant delete test, try again later");
    }
}


// Function to create and display a temporary alert box
function alertStatus(err, msg) {
    // Create the alert box element
    const alertBox = document.createElement('div');
    alertBox.textContent = msg;

    // Apply styles directly to ensure they are not overridden
    Object.assign(alertBox.style, {
        position: 'fixed',
        bottom: '20px',
        right: '-300px', // Start outside the screen
        backgroundColor: err ? 'red' : 'green',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: '9999',
        transition: 'all 0.5s ease-in-out',
        opacity: '1',
    });

    // Append the alert box to the body
    document.body.appendChild(alertBox);

    // Trigger slide-in animation
    setTimeout(() => {
        alertBox.style.right = '20px';
    }, 50); // Small delay to allow transition to apply

    // Fade out and remove the alert box after 3 seconds
    setTimeout(() => {
        alertBox.style.opacity = '0';
        alertBox.style.transform = 'translateY(20px)'; // Slight slide down on fade out
        setTimeout(() => {
            document.body.removeChild(alertBox);
        }, 500); // Wait for fade-out transition to complete
    }, 3000);
}



// --------------------------
// INITIALIZATION
// --------------------------
renderClasses();
testContainer.classList.add("disabled");
