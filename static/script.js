// ==========================================
// EMAIL SPAM FILTER - SCRIPT
// ==========================================

// Get HTML elements
const emailFileInput = document.getElementById("emailFile");
const emailBodyInput = document.getElementById("emailBody");
const emailSubjectInput = document.getElementById("emailSubject");


// ==========================================
// UPLOAD .TXT OR .EML FILE
// ==========================================

if (emailFileInput) {

    emailFileInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        // Check file type
        const fileName = file.name.toLowerCase();

        if (!fileName.endsWith(".txt") && !fileName.endsWith(".eml")) {

            alert("Please upload only a .TXT or .EML email file.");

            // Clear selected file
            emailFileInput.value = "";

            return;
        }

        // Read file
        const reader = new FileReader();

        reader.onload = function (event) {

            const content = event.target.result;

            // Put uploaded content into Email Body
            if (emailBodyInput) {
                emailBodyInput.value = content;
            }

            // Add file name as subject if subject is empty
            if (emailSubjectInput && emailSubjectInput.value.trim() === "") {

                // Remove extension from file name
                const subjectName = file.name.replace(/\.[^/.]+$/, "");

                emailSubjectInput.value = subjectName;
            }

            alert("✅ Email file uploaded successfully!");
        };

        reader.onerror = function () {
            alert("❌ Error reading the file.");
        };

        reader.readAsText(file);
    });
}


// ==========================================
// CHECK EMAIL FUNCTION
// ==========================================

function checkEmail() {

    const emailBody = document.getElementById("emailBody");

    if (!emailBody) {
        alert("Email body input not found.");
        return;
    }

    const email = emailBody.value;

    if (email.trim() === "") {
        alert("⚠️ Please enter an email message or upload a file.");
        return;
    }

    console.log("Analyzing email:", email);

}