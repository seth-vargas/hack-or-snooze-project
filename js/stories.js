"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

let favoritesList;
let ownStoriesList;

let isLoggedIn = false


/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  console.debug("generateStoryMarkup");

  const hostName = story.getHostName();

  if (isLoggedIn) {
    return $(`
        <li id="${story.storyId}">
          <span class="favorite-text">${
            story.checkForFavorite() ? "❤️" : "🖤"
          }</span>
          <span class="delete-emoji">${
            story.checkOwnStories() ? "🗑️" : ""
          }</span>
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a>
          <small class="story-hostname">(${hostName})</small>
          <small class="story-author">by ${story.author}</small>
          <small class="story-user">posted by ${story.username}</small>
        </li>
      `);
  } 
  return $(`
        <li id="${story.storyId}">
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a>
          <small class="story-hostname">(${hostName})</small>
          <small class="story-author">by ${story.author}</small>
          <small class="story-user">posted by ${story.username}</small>
        </li>
      `);
}

/** Gets list of stories from server, generates their HTML, and puts on page.
 * - loops through all of the stories of storyList and calls generateStoryMarkup, passing in the current story
 * - adds an event listener for each generated story and shows the final story list
 */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $(".favorite-text").on("click", handleFavoriteClick);
  $(".delete-emoji").text("");
  $allStoriesList.show();
}

/**
 * - Grabs the input values from the form using jQuery
 * - calls addStory method, passing in the currentUser and an object containing input data
 * - calls generateStoryMarkup using the story we got from calling addStory
 * - resets form for future use
 * - navigates user to their posted stories
 */

async function createNewStory(evt) {
  console.debug("createNewStory");
  evt.preventDefault();

  const title = $("#title").val();
  const author = $("#author").val();
  const url = $("#url").val();

  const story = await StoryList.addStory(currentUser, { title, author, url });

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $newStoryForm.hide();
  $newStoryForm.trigger("reset");

  storyList = await StoryList.getStories();
  navMyStories();
  $userStoriesList.show();
}
$newStoryForm.on("submit", createNewStory);

/**
 * - gets current storyId via jQuery
 * - checks if the story is an existing favorite
 * - updates the API and HTML text to reflect this
 */

function handleFavoriteClick() {
  console.debug("handleFavoriteClick");

  const currentStoryID = $(this).closest("li").attr("id");

  if (this.innerText === "🖤") {
    currentUser.addFavorite(currentStoryID);
    $(this).text("❤️");
  } else {
    currentUser.deleteFavorite(currentStoryID);
    $(this).text("🖤");
  }
}

/**
 * Handles user deleting their story
 * calls deleteStory method passing in the current story id
 */
function handleDeleteClick() {
  console.debug("handleDeleteClick");
  const currentStoryID = $(this).closest("li").attr("id");
  StoryList.deleteStory(currentStoryID);
}
