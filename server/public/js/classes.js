// DOM Elements
const classList = document.getElementById("classes-list");
const testList = document.getElementById("tests-list");
const testContainer = document.getElementById("test-container");

// Add Item popup
const addItemPopup = document.getElementById("addItemPopup");
const addItemPopupClose = document.getElementById("addItemPopup-close");
const addItemPopupTitle = document.getElementById("addItemPopup-title");
const addItemPopupInput = document.getElementById("addItemPopup-input");
const addItemPopupSave = document.getElementById("addItemPopup-save");

// Attach event listeners for each class item
document.querySelectorAll(".item").forEach(item => {
    // Make sure no tests are enabled
    testContainer.classList.add("disabled");
    testList.innerHTML = "";

    const classId = item.getAttribute("data-class-id");
  const selectBtn = item.querySelector(".btn-select");

  // Handle "Select/Deselect" button
  selectBtn.addEventListener("click", () => {
    handleSelectedClass(classId, item, selectBtn);
  });

  // Popup to rename class
  item.querySelector(".btn-rename").addEventListener("click", () => {
    // ...
  });

  // Popup to delete class
  item.querySelector(".btn-delete").addEventListener("click", () => {
    // ...
  });
});

function handleSelectedClass(classId, item, selectBtn) {
    const isAlreadySelected = item.classList.contains("selected");
    
    if (isAlreadySelected) {
      // Deselect
      item.classList.remove("selected");
      selectBtn.textContent = "Select";
      
      // Add "disabled" class back to test container
      testContainer.classList.add("disabled");
      testList.innerHTML = "";
    } else {
      // Deselect anything else
      document.querySelectorAll(".item.selected").forEach(selectedItem => {
        selectedItem.classList.remove("selected");
        selectedItem.querySelector(".btn-select").textContent = "Select";
      });
      
      // Select this item
      item.classList.add("selected");
      selectBtn.textContent = "Deselect";
      
      // Remove "disabled" class, making the container active
      testContainer.classList.remove("disabled");
      
      // Now fetch and render tests for the selected class, etc.
      // testList.innerHTML = "...";
    }
  }
  

// Handle opening add item popup
function openAddItemPopup(title, existingValue, callback) {
  addItemPopupTitle.textContent = title;
  addItemPopupInput.value = existingValue;
  addItemPopup.classList.add("active");

  addItemPopupSave.onclick = () => {
    const value = addItemPopupInput.value.trim();
    if(!value) return; // Make sure its truthy
    callback(value);
    closePopup();
  }
}

// Close popup
function closePopup() {
  addItemPopup.classList.remove("active");
}
addItemPopupClose.addEventListener("click", closePopup);

// Handle Adding Class
const addClassBtn = document.getElementById("add-class-btn");
addClassBtn.addEventListener("click", () => {
  openAddItemPopup("Add Class", "", async (newClassName) => {
    // Create new class in server
    try {
      const res = await fetch("/dash/saveClass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ className: newClassName })
      });

      const result = await res.json();
      if(result.err) {
        alert(result.err);
      } else {
        alert(result.msg + result.classId);
        // Rerender classes (ASC)

        // Select the class by default when creating a new class (if desired):
        //   1) Deselect all classes
        //   2) Programmatically create or re-fetch class items
        //   3) Call handleSelectedClass on the new one
        //
        // For the Tests list side, rename title to Tests (Class Name Here) etc.
      }
    } catch(err) {
      console.log(err);
      alert("Error creating class");
    }
  })
});

// Handle Adding Test
const addTestBtn = document.getElementById("add-test-btn");
addTestBtn.addEventListener("click", () => {
  openAddItemPopup("Add Test", "", (newTestName) => {
    // Create new test in server
    // TODO: fetch("/dash/saveTest"...) etc.

    // On success, re-render tests by ASC
  })
});
