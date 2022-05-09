// --------------- BUTTONS ------------------
// Removes focus after clicking
for (let btn of document.querySelectorAll("button")) {
	btn.addEventListener("click", btn.blur);
}

