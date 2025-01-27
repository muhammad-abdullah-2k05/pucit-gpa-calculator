let subjectCount = 6;
    const container = document.getElementById('subjects-container');

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

    function initializeSubjects() {
        for (let i = 1; i <= subjectCount; i++) {
            container.innerHTML += createSubjectRow(i);
        }
    }

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

    function removeSubject(index) {
        const row = document.getElementById(`subject-row-${index}`);
        if (row) {
            row.remove();
            subjectCount--; // Decrement subject count when a subject is removed
        }
    }

    function calculateGPA() {
        let totalGradePoints = 0;
        let totalCredits = 0;
        let isValid = true;

        // Hide the grading table before calculating GPA
        document.getElementById('grade-table').style.display = 'none';

        for (let i = 1; i <= subjectCount; i++) {
            const credits = parseFloat(document.getElementById(`subject${i}-credits`).value);
            const grade = parseFloat(document.getElementById(`subject${i}-grade`).value);

            if (isNaN(credits) || isNaN(grade)) {
                alert(`Please fill in all fields for Subject ${i}`);
                isValid = false;
                break;
            }

            totalGradePoints += credits * grade;
            totalCredits += credits;
        }

        if (isValid) {
            const gpa = (totalGradePoints / totalCredits).toFixed(2);
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `Your GPA is: <strong style="font-size: 24px; color: #1eab52;">${gpa}</strong>`;
            resultDiv.style.textAlign = 'center'; // Center the result
            resultDiv.style.fontWeight = 'bold'; // Make the result bold
            resultDiv.innerHTML += `<p style="font-size: 18px;">${getAppreciationMessage(gpa)}</p>`; // Add appreciation message
            
        }
    }

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