import wretch from "wretch";
import Handlebars from "handlebars";

const InfoType = Object.freeze({ 
	LIST: Symbol("list"), 
	STORY: Symbol("story"), 
});

// ----------------- STORIES ---------------
// Fetch the info of the type requested from the server
async function fetchStoriesInfo(newsType, newsUrl) {
	let baseUrl;
	switch (newsType) {
		case InfoType.LIST:
			baseUrl = "https://hacker-news.firebaseio.com/v0/";
			break;
		case InfoType.STORY:
			baseUrl = "https://hacker-news.firebaseio.com/v0/item/";
			break;
	}
	
	return wretch(baseUrl)
		.url(newsUrl + ".json")
		.get()
		.json(json => {return json});
}


// Template of a news story
let storyTemplate = Handlebars.compile(`\
<section class="story">
<a class="story__title" href="{{url}}">{{title}}</a>\
<div class="story__info-container">\
<a class="story__author" href="https://news.ycombinator.com/user?id={{by}}">By {{by}}</a>\
<div class="padder">|</div>\
<a href="https://news.ycombinator.com/item?id={{id}}">({{descendants}}) Comments</a>\
<div class="padder">|</div>\
<div>{{time}}</div>\
</div>
</section>`);

// Insert a story into the 'news-container' by its id
async function displayStory(storyID) {
	let container = document.querySelector("#story-container");
	let story = await fetchStoriesInfo(InfoType.STORY, storyID);
	
	story.time = (new Date(story.time * 1000)).toLocaleDateString();
	container.innerHTML += storyTemplate(story);
}


let curStoryIndex;

// Append stories in sequence.
async function loadStories(amount) {
	amount += curStoryIndex;
	for (curStoryIndex; curStoryIndex < amount; curStoryIndex++) {
		displayStory(stories[curStoryIndex]);
	}
}


// Array of loaded stories
let stories;

// Initialise 'stories-container' with 'amount' of stories
async function initStoriesFeed(amount) {
	stories = await fetchStoriesInfo(InfoType.LIST, "topstories");
	
	curStoryIndex = 0;
	loadStories(amount);
}
initStoriesFeed(10);

// ------------ SWITCH THEME ----------------
function switchTheme() {
	document.querySelector("body").classList.toggle("dark-mode");
	
	// Switches icons
	document.querySelector("#sun").classList.toggle("hidden");
	document.querySelector("#moon").classList.toggle("hidden");
}

// --------------- BUTTONS ------------------
for (let btn of document.querySelectorAll("button")) {
	btn.addEventListener("click", btn.blur);
}

document.querySelector("#story-load").addEventListener("click", () => loadStories(10));

document.querySelector("#switch-theme").addEventListener("click", switchTheme);
