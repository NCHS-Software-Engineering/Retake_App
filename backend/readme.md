/requests
    - Pulls up all ongoing retake requests
    - Teacher can sort between stages:
        - pending  : Student applies for a retake and waits for teacher to pick a assignment for them to complete
        - assigned : Teacher assigned the assignment to the student and they have to start completing it
        - submitted: The student submitted the assignment, waiting for teacher to grade/give feedback
        - graded   : The teacher grades the assignmnet, optionally can give percent grade, give feedback, or assign new assignment
    - Option to assign a new student an assignment from popup

/request/id
    - Pulls up specific retake requests
    - Teacher can assign or reassign assignment
    - Teacher can view number of submission attempts and scroll through them (left-right)
    - Teacher can grade the work, give it a score and also give feedback


// TODO:
- Where will I put the route to get teacher/student names when making a search for assigning/applying for retake
    *what should endpoint route be and how should I orginze in code
- In users endpoint /users?role=teacher&search=[name]
- This is also where I put user settings like reading bio, name, ect