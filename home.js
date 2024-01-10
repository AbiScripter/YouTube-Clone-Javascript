// const API_KEY = "AIzaSyBxh6zllBNDvMzIh3m020wdCAMSw1WIEcA"; //1st mail
const API_KEY = "AIzaSyAl8P1Mv2kS8FhvE1gGiaySfiZa21UL6qc"; //2nd mail
const BASE_URL = "https://www.googleapis.com/youtube/v3";

let container = document.querySelector(".container");
let dummyItemsContainer = document.querySelector(".items-container");
let subscriptionsContainer = document.querySelector("#subscriptions");
let searchInput = document.querySelector("#search-input");
let searchIcon = document.querySelector("#search-icon");
let subscriptions = subscriptionsContainer.querySelectorAll("li");

//!rendering dummyItems part
for (let i = 0; i < 15; i++) {
  const element = document.createElement("p");
  element.innerText = "item";
  dummyItemsContainer.appendChild(element);
}

//!rendering videos part
console.log(localStorage.getItem("searchterm"));

//get searchTerm from localStorage if it already have one
if (localStorage.getItem("searchterm") !== null) {
  fetchVideos(localStorage.getItem("searchterm"), 20);
}

//search functionality
searchIcon.addEventListener("click", () => {
  let searchTerm = searchInput.value;
  if (searchTerm == "") {
    alert("please enter search term");
    return;
  }

  //if we search not for the first time....delete all the videos
  if (container.children.length > 0) {
    Array.from(container.children).forEach((el) => el.remove());
  }

  localStorage.setItem("searchterm", searchTerm);
  fetchVideos(searchTerm, 20);
});

//fetching videos from searchTerm
async function fetchVideos(searchQuery, maxResults) {
  const response = await fetch(
    `${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxResults}&part=snippet`
  );
  const data = await response.json();

  renderVideos(data.items);
}

//getting logo for channels [using in renderVideoFunction]
async function getChannelLogo(channelId) {
  //  https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=UC_x5XG1OV2P6uZZ5FSM9Ttw&key=[YOUR_API_KEY]
  const response = await fetch(
    `${BASE_URL}/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${API_KEY}`
  );
  const data = await response.json();
  let obj = {
    channelThumbnail: data.items[0].snippet.thumbnails.default.url,
  };
  return obj;
}

//fetchVideoStats [using in renderVideoFunction]
async function getVideoStats(videoId) {
  // https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=Ks-_Mh1QhMc&key=[YOUR_API_KEY]
  const response = await fetch(
    `${BASE_URL}/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`
  );
  const data = await response.json();
  let obj = {
    published: data.items[0].snippet.publishedAt,
    viewCount: data.items[0].statistics.viewCount,
  };
  return obj;
}

//rendering videos
async function renderVideos(details) {
  console.log(details);
  //if the video dont have a videoID
  for (const detail of details) {
    if (!detail.id.videoId) {
      console.log("dont render");
      continue;
    }

    //!create object for every video [implement after initial version]
    let channelDetails = await getChannelLogo(detail.snippet.channelId);
    let videoDetails = await getVideoStats(detail.id.videoId);

    container.insertAdjacentHTML(
      "beforeend",
      `<div class="video-box" id=${detail.id.videoId} data-channel-id=${
        detail.snippet.channelId
      }>
      <div>
          <img class="thumbnail" src=${
            detail.snippet.thumbnails.medium.url
          } id=${detail.id.videoId} data-channel-id=${
        detail.snippet.channelId
      } alt="">

          <div class="video-details">
            <img src=${
              channelDetails.channelThumbnail
            } class="channel-logo" alt="">
            <div class="video-details-right">
              <p id=${detail.id.videoId} class="video-title" data-channel-id=${
        detail.snippet.channelId
      }>${formatTitle(detail.snippet.title)}</p>
              <p id=${detail.id.videoId}>${detail.snippet.channelTitle}</p>
              <p><span>${formatViews(videoDetails.viewCount)} Views</span>
              <span>. ${formatTimeDifference(
                videoDetails.published
              )} ago</span></p>
            </div>
          </div>
        </div>
      </div>`
    );
  }
}

//!Seperate API for subscriptions images part
async function appendAvatars(parent) {
  const image = document.createElement("img");
  let imgUrl = await getImgUrl();
  image.src = imgUrl;
  parent.appendChild(image);
}

async function getImgUrl() {
  try {
    const response = await fetch("https://randomuser.me/api/?inc=picture");
    const result = await response.json();
    return result.results[0].picture.thumbnail;
  } catch (error) {
    console.error(error);
  }
}

subscriptions.forEach((li) => {
  appendAvatars(li.children[0]);
});

//!redirecting part
//!using Event Delegation in practice
container.addEventListener("click", (e) => {
  if (
    e.target.className === "thumbnail" ||
    e.target.className === "video-title"
  ) {
    localStorage.setItem("videoId", e.target.id);
    localStorage.setItem("channelId", e.target.getAttribute("data-channel-id"));
    redirectToDetails();
  }
});

//redirect to player page
function redirectToDetails() {
  window.location.href = "player.html";
}
