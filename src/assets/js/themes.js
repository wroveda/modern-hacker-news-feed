// Toggles between dark and light mode
function switchTheme() {
	document.querySelector("body").classList.toggle("dark-mode");
	
	// Switches icons
	document.querySelector("#sun").classList.toggle("hidden");
	document.querySelector("#moon").classList.toggle("hidden");
}

// --------------- BUTTONS ------------------
document.querySelector("#switch-theme").addEventListener("click", switchTheme);
