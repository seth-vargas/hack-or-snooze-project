"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");

  $navMainLinks.show()

  $navLogin.hide();
  $navLogOut.show();

  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmit() {
  console.debug("navSubmit");
  hidePageComponents();
  $("#new-stories-form").show();
  // TODO: impliment the section of user-created stories
  // $userStoriesList.show();
}
$(".submit-nav").on("click", navSubmit);

// removed async on Jan 21 at 8:00 AM from the function below
async function navFavorite() {
  console.debug("navFavorite");
  hidePageComponents();
  $favoriteStoriesList.empty();

  // loop through currentUser.favorites and get them generated

  for (let story of favoritesList) {
    $favoriteStoriesList.append(generateStoryMarkup(story));
  }
  if ($favoriteStoriesList.children().length === 0) {
    $favoriteStoriesList.append("<h3>No favorites :( </h3>");
  }
  $(".favorite-text").on("click", handleFavoriteClick);

  $favoriteStoriesList.show();
}
$("#favorite-nav").on("click", navFavorite);

function navMyStories() {
  console.debug("navMyStories");

  hidePageComponents();
  $userStoriesList.empty();

  for (let story of ownStoriesList) {
    $userStoriesList.append(generateStoryMarkup(story));
  }
  if ($userStoriesList.children().length === 0) {
    $userStoriesList.append(
      "<h3>You have not created any stories. <a href='#' class='submit-nav'><i>click here to make one!</i></a> </h3>"
    );
  }
  $(".submit-nav").on("click", navSubmit);
  $(".favorite-text").on("click", handleFavoriteClick);
  $(".delete-emoji").on("click", handleDeleteClick);
  
  $userStoriesList.show();
}
$("#stories-nav").on("click", navMyStories);
