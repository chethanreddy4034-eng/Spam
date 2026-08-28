function checkEmail() {
    const email = document.getElementById("emailText").value;
    const result = document.getElementById("result");

    if (email.trim() === "") {
        result.innerHTML = "⚠️ Please enter an email message.";
        return;
    }

    result.innerHTML = "⏳ Analyzing email...";
}