import wretch from "wretch";
import Handlebars from "handlebars";

// Type of info to request from hacker-news
const InfoType = Object.freeze({
	LIST: Symbol("list"),
	STORY: Symbol("story"),
});


// ------------ STORIES ------------
// Fetch the info of the type requested from the server
async function fetchInfo(storyType, storyUrl) {
	let baseUrl;
	switch (storyType) {
		case InfoType.LIST:
			baseUrl = "https://hacker-news.firebaseio.com/v0/";
			break;
		case InfoType.STORY:
			baseUrl = "https://hacker-news.firebaseio.com/v0/item/";
			break;
	}
	
	return wretch()
		.url(baseUrl + storyUrl + ".json")
		.get()
		.json(json => {return json});
}


// Insert a story into the 'story-container' by its id
async function displayStory(storyID) {
	let container = document.querySelector("#story-container");
	let story = await fetchInfo(InfoType.STORY, storyID);
	
	story.time = (new Date(story.time * 1000)).toLocaleDateString();
	
	// If the story doesn't have any comments
	if (story.descendants === undefined) {
		story.descendants = 0;
	}
	
	// If the story doesn't have an outgoing link, default to comment page
	if (story.url === undefined) {
		story.url = "https://news.ycombinator.com/item?id=" + story.id;
	}
	
	// Template of a news story
	let template = Handlebars.compile(`\
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
	
	container.innerHTML += template(story);
}


let list; // Array of loaded stories
let curIndex; // Index of the current story

// Append stories in sequence
async function loadStories(amount) {
	amount += curIndex;
	for (curIndex; curIndex < amount; curIndex++) {
		// stops if all of the stories have been shown
		if (curIndex >= list.length) { return; }
		
		displayStory(list[curIndex]);
	}
}


// Initialise 'stories-container' with 'amount' of stories
async function initFeed(amount) {
	list = await fetchInfo(InfoType.LIST, "topstories");
	
	curIndex = 0;
	loadStories(amount);
}
initFeed(10);

// ------------ BUTTONS ------------
document.querySelector("#story-load").addEventListener("click", () => loadStories(10));
