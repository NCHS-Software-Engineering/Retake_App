document.addEventListener("DOMContentLoaded", () => {
    /* -----------------------------
       Data & State
    ----------------------------- */
    let classesData = [];        // array of { id, name }
    let testsByClassId = {};     // map classId -> array of { id, name }
    let selectedClassId = null;  // which class is currently selected, if any
    let selectedTestId = null;   // which test is currently selected, if any

    /* -----------------------------
       DOM Elements
    ----------------------------- */
    const classesList   = document.getElementById("classes-list");
    const testsList     = document.getElementById("tests-list");
    const testContainer = document.getElementById("test-container");
    
    // Popup
    const popup       = document.getElementById("addItemPopup");
    const popupClose  = document.getElementById("addItemPopup-close");
    const popupTitle  = document.getElementById("addItemPopup-title");
    const popupInput  = document.getElementById("addItemPopup-input");
    const popupSave   = document.getElementById("addItemPopup-save");

    // Buttons
    const addClassBtn = document.getElementById("add-class-btn");
    const addTestBtn  = document.getElementById("add-test-btn");

    /* -----------------------------
       Main Buttons
    ----------------------------- */
    addClassBtn.addEventListener("click", () => {
      openPopup("Add Class", (name) => {
        const newCls = { id: generateId(), name };
        classesData.push(newCls);
        testsByClassId[newCls.id] = [];
        renderClasses();
        // If no class is selected, tests remain greyed out
      });
    });

    addTestBtn.addEventListener("click", () => {
      // Only add tests if a class is currently selected
      if (!selectedClassId) return;
      openPopup("Add Test", (testName) => {
        const newTest = { id: generateId(), name: testName };
        testsByClassId[selectedClassId].push(newTest);
        renderTests(selectedClassId);
      });
    });

    /* -----------------------------
       Popup
    ----------------------------- */
    popupClose.addEventListener("click", closePopup);
    popup.addEventListener("click", (e) => {
      if (e.target === popup) closePopup();
    });

    /* -----------------------------
       Render Functions
    ----------------------------- */
    function renderClasses() {
      classesList.innerHTML = "";
      classesData.forEach(cls => {
        const div = document.createElement("div");
        // highlight if this is the selected class
        div.className = "item" + (cls.id === selectedClassId ? " selected" : "");
        
        div.innerHTML = `
          <p>${cls.name}</p>
          <div class="item-buttons">
            <button class="btn btn-select">${cls.id === selectedClassId ? "Deselect" : "Select"}</button>
            <button class="btn btn-rename">Rename</button>
            <button class="btn btn-delete">Delete</button>
          </div>
        `;

        // "Select" / "Deselect" class
        const selectBtn = div.querySelector(".btn-select");
        selectBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleClassSelection(cls.id);
        });

        // "Rename"
        div.querySelector(".btn-rename").addEventListener("click", (e) => {
          e.stopPropagation();
          openPopup("Rename Class", (newName) => {
            cls.name = newName;
            renderClasses();
            // If this was the selected class, also re-render tests
            if (cls.id === selectedClassId) {
              renderTests(cls.id);
            }
          }, cls.name);
        });

        // "Delete"
        div.querySelector(".btn-delete").addEventListener("click", (e) => {
          e.stopPropagation();
          deleteClass(cls.id);
        });

        classesList.appendChild(div);
      });
    }

    function renderTests(classId) {
      testsList.innerHTML = "";
      const tests = testsByClassId[classId] || [];
      tests.forEach(t => {
        const div = document.createElement("div");
        // highlight if this test is selected
        div.className = "item" + (t.id === selectedTestId ? " selected" : "");
        
        div.innerHTML = `
          <p>${t.name}</p>
          <div class="item-buttons">
            <button class="btn btn-select">${t.id === selectedTestId ? "Deselect" : "Select"}</button>
            <button class="btn btn-rename">Rename</button>
            <button class="btn btn-delete">Delete</button>
          </div>
        `;

        // "Select" / "Deselect" a test
        const selectTestBtn = div.querySelector(".btn-select");
        selectTestBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleTestSelection(t.id);
        });

        // "Rename" test
        div.querySelector(".btn-rename").addEventListener("click", () => {
          openPopup("Rename Test", (newName) => {
            t.name = newName;
            renderTests(classId);
          }, t.name);
        });

        // "Delete" test
        div.querySelector(".btn-delete").addEventListener("click", () => {
          deleteTest(classId, t.id);
        });

        testsList.appendChild(div);
      });
    }

    /* -----------------------------
       Selection Logic
    ----------------------------- */
    // Toggle the currently selected class
    function toggleClassSelection(classId) {
      if (selectedClassId === classId) {
        // Deselect the class
        selectedClassId = null;
        // Also clear/deselect any test
        selectedTestId = null;
        testsList.innerHTML = "";
        updateTestContainerState();
        renderClasses();
        return;
      }
      // Select a different class
      selectedClassId = classId;
      selectedTestId = null; // no test selected initially
      // Render classes to highlight new selection
      renderClasses();
      // Show that class's tests (ungrey the container)
      renderTests(classId);
      updateTestContainerState();
    }

    // Toggle the currently selected test
    function toggleTestSelection(testId) {
      // If we're deselecting the existing test:
      if (selectedTestId === testId) {
        selectedTestId = null;
        // According to your request:
        // "When I deselect from tests, I want to delete everything from the tests container
        // and grey it out again."
        testsList.innerHTML = "";
        // Also unselect the class so we revert to grey
        selectedClassId = null;
        updateTestContainerState();
        // Re-render classes to remove highlight
        renderClasses();
        return;
      }
      // If we are selecting a new test, or no test was selected before
      selectedTestId = testId;
      // highlight it. But if we want ONLY a single test selected, that's fine.
      renderTests(selectedClassId);
    }

    /* -----------------------------
       Class & Test Management
    ----------------------------- */
    function deleteClass(classId) {
      classesData = classesData.filter(c => c.id !== classId);
      delete testsByClassId[classId];
      if (selectedClassId === classId) {
        selectedClassId = null;
        testsList.innerHTML = "";
        selectedTestId = null;
      }
      renderClasses();
      updateTestContainerState();
    }

    function deleteTest(classId, testId) {
      testsByClassId[classId] = testsByClassId[classId].filter(t => t.id !== testId);
      if (testId === selectedTestId) {
        selectedTestId = null;
      }
      renderTests(classId);
    }

    /* -----------------------------
       Popup Handling
    ----------------------------- */
    function openPopup(title, onSaveCallback, existingValue = "") {
      popupTitle.textContent = title;
      popupInput.value = existingValue;
      popup.classList.add("active");

      popupSave.onclick = () => {
        const val = popupInput.value.trim();
        if (!val) return;
        onSaveCallback(val);
        closePopup();
      };
    }

    function closePopup() {
      popup.classList.remove("active");
    }

    /* -----------------------------
       Misc Helpers
    ----------------------------- */
    function updateTestContainerState() {
      // If we have a selected class, ungrey tests. Otherwise grey out
      if (selectedClassId) {
        testContainer.style.opacity = "1";
        testContainer.style.pointerEvents = "auto";
      } else {
        testContainer.style.opacity = "0.5";
        testContainer.style.pointerEvents = "none";
      }
    }

    function generateId() {
      return Math.random().toString(36).substring(2, 9);
    }

    // Initialize
    updateTestContainerState();
  });