// External JavaScript file: gpa.js

let subjectCount = 6;
const container = document.getElementById('subjects-container');

// Function to create a subject row
function createSubjectRow(index) {
    return `<div class="subject-row" id="subject-row-${index}">
        <input type="text" placeholder="Subject Name" id="subject${index}-name" />
        <input type="number" placeholder="Credit Hours" id="subject${index}-credits" min="0" />
        <select id="subject${index}-grade">
            <option value="4.00">A</option>
            <option value="3.70">A-</option>
            <option value="3.30">B+</option>
            <option value="3.00">B</option>
            <option value="2.70">B-</option>
            <option value="2.30">C+</option>
            <option value="2.00">C</option>
            <option value="1.70">C-</option>
            <option value="1.00">D</option>
            <option value="0.00">F</option>
        </select>
        <button class="remove-btn" onclick="removeSubject(${index})">Remove</button>
    </div>`;
}

// Function to initialize default subjects
function initializeSubjects() {
    for (let i = 1; i <= subjectCount; i++) {
        container.innerHTML += createSubjectRow(i);
    }
}

// Function to add a new subject
function addSubject() {
    // Save the current state of all input fields
    const currentState = [];
    for (let i = 1; i <= subjectCount; i++) {
        const subjectName = document.getElementById(`subject${i}-name`).value;
        const credits = document.getElementById(`subject${i}-credits`).value;
        const grade = document.getElementById(`subject${i}-grade`).value;
        currentState.push({ subjectName, credits, grade });
    }

    // Increment subject count and add a new subject row
    subjectCount++;
    container.innerHTML += createSubjectRow(subjectCount);

    // Restore the saved state
    for (let i = 1; i < currentState.length + 1; i++) {
        document.getElementById(`subject${i}-name`).value = currentState[i - 1].subjectName;
        document.getElementById(`subject${i}-credits`).value = currentState[i - 1].credits;
        document.getElementById(`subject${i}-grade`).value = currentState[i - 1].grade;
    }
}

// Function to remove a subject
function removeSubject(index) {
    const row = document.getElementById(`subject-row-${index}`);
    if (row) {
        row.remove();
        subjectCount--; // Decrement subject count when a subject is removed
    }
}
// Function to calculate GPA and send data to the server
function calculateGPA() {
    let totalGradePoints = 0;
    let totalCredits = 0;
    let isValid = true;

    // Get student information
    const studentName = document.getElementById('student-name').value;
    const studentEmail = document.getElementById('student-email').value;
    const studentSemester = document.getElementById('student-semester').value;

    // Check if all student info fields are filled
    if (!studentName || !studentEmail || !studentSemester) {
        alert("Please fill out your name, email, and semester.");
        return;
    }

    // Get subject details
    const subjects = [];
    for (let i = 1; i <= subjectCount; i++) {
        const subjectName = document.getElementById(`subject${i}-name`).value;
        const credits = parseFloat(document.getElementById(`subject${i}-credits`).value);
        const grade = parseFloat(document.getElementById(`subject${i}-grade`).value);

        if (!subjectName || isNaN(credits) || isNaN(grade)) {
            alert(`Please fill in all fields for Subject ${i}`);
            isValid = false;
            break;
        }

        totalGradePoints += credits * grade;
        totalCredits += credits;

        subjects.push({
            name: subjectName,
            credits: credits,
            grade: grade,
        });
    }

    if (isValid) {
        const gpa = (totalGradePoints / totalCredits).toFixed(2);

        // Display GPA result
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `Your GPA is: <strong style="font-size: 24px; color: #1eab52;">${gpa}</strong>`;
        resultDiv.style.textAlign = 'center'; // Center the result
        resultDiv.style.fontWeight = 'bold'; // Make the result bold
        resultDiv.innerHTML += `<p style="font-size: 18px;">${getAppreciationMessage(gpa)}</p>`; // Add appreciation message

        // Prepare data to send to the server
        const data = {
            studentName,
            studentEmail,
            studentSemester,
            gpa,
            subjects,
        };

        // Send data to the server via an AJAX request
        sendDataToServer(data);
    }
}

// Function to send data to the server
function sendDataToServer(data) {
    fetch('save-data.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                alert('Data saved successfully!');
            } else {
                alert('Error saving data.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while saving data.');
        });
}


// Function to get an appreciation message based on GPA
function getAppreciationMessage(gpa) {
    if (gpa >= 3.5) {
        return "Excellent work! Keep it up!";
    } else if (gpa >= 3.0) {
        return "Good job! You're doing well!";
    } else if (gpa >= 2.0) {
        return "You're on the right track!";
    } else {
        return "Don't give up! Keep trying!";
    }
}

// Initialize the default subjects on page load
initializeSubjects();