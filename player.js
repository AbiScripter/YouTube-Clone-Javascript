// const API_KEY = "AIzaSyBxh6zllBNDvMzIh3m020wdCAMSw1WIEcA";
const API_KEY = "AIzaSyAl8P1Mv2kS8FhvE1gGiaySfiZa21UL6qc"; //2nd mail
const BASE_URL = "https://www.googleapis.com/youtube/v3";

let detailsContainer = document.querySelector("#details-container");
let commentsContainer = document.querySelector("#comments-container");

let videoId = localStorage.getItem("videoId");
let channelId = localStorage.getItem("channelId");

console.log(videoId, channelId);

//YT inbuilt class from Youtube API
window.addEventListener("load", () => {
  // we need to write logic for rendering video player
  // iframe
  if (YT) {
    new YT.Player("video-container", {
      height: "500",
      width: "1000",
      videoId,
    });
  }
});

getVideoStats(videoId);
getComments(videoId);

//fetching video details
async function getVideoStats(videoId) {
  const response = await fetch(
    `${BASE_URL}/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`
  );
  const data = await response.json();

  renderVideoDetails(data.items[0]);
}

//fetching comments
async function getComments(videoId) {
  const response = await fetch(
    `${BASE_URL}/commentThreads?key=${API_KEY}&videoId=${videoId}&maxResults=25&part=snippet`
  );
  const data = await response.json();
  console.log(data);
  renderComments(data.items);
}

//getChannelDetails used in renderVideoDetails function
async function getChannelDetails(channelId) {
  const response = await fetch(
    `${BASE_URL}/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${API_KEY}`
  );
  const data = await response.json();
  console.log(data);
  let obj = {
    channelSubsCount: data.items[0].statistics.subscriberCount,
    channelThumbnail: data.items[0].snippet.thumbnails.default.url,
    channelDescription: data.items[0].snippet.description,
    channelTitle: data.items[0].snippet.title,
  };

  return obj;
}

//rendering video details
async function renderVideoDetails(videoDetails) {
  let channelDetails = await getChannelDetails(channelId);

  detailsContainer.insertAdjacentHTML(
    "beforeend",
    `
      <div class="video-stats-section">
          <p>${videoDetails.snippet.title}</p>

        <div id="video-stats">
          <div>
            <span>${videoDetails.statistics.viewCount} views .</span>
            <span>${new Date(videoDetails.snippet.publishedAt)
              .toDateString()
              .slice(4)}</span>
          </div>
          <div>
            <p><span class="material-symbols-outlined">thumb_up</span>${
              videoDetails.statistics.likeCount
            }</p>
            <p><span class="material-symbols-outlined">thumb_down</span>0</p>
            <p><span class="material-symbols-outlined">share</span>SHARE</p>
            <p><span class="material-symbols-outlined">docs_add_on</span>SAVE</p>
          </div>
          </div>  
      </div>
      <div class="channel-stats-section">
        <img src=${channelDetails.channelThumbnail} class="channel-logo" alt="">
        <div>
         <div id="channel-stats-top">
            <div>
              <p>${channelDetails.channelTitle}</p>
              <p>${formatViews(channelDetails.channelSubsCount)} subscribers</p>
            </div>
            <button id="subscribe-btn">SUBSCRIBE</button>
          </div>
          <p>${channelDetails.channelDescription}</p>
        </div>
      </div>`
  );

  commentsContainer.insertAdjacentHTML(
    "beforeend",
    `<div id="comments-header">
      <span>${videoDetails.statistics.commentCount} Comments</span>
      <span><span class="material-symbols-outlined">sort</span> SORT BY</span>
    </div>`
  );
}

//rendering comments
function renderComments(commentsData) {
  commentsData.forEach((data) => {
    commentsContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="comment-box">
          <img src=${
            data.snippet.topLevelComment.snippet.authorProfileImageUrl
          } alt=""/>

          <div id="comment-details-section">
            <p>
              <span>${
                data.snippet.topLevelComment.snippet.authorDisplayName
              }</span>
              <span>${formatTimeDifference(
                data.snippet.topLevelComment.snippet.updatedAt
              )} ago</span>
            </p>
            <p>${data.snippet.topLevelComment.snippet.textDisplay}</p>  
          <div id="comment-likes-section">
            <p><span class="material-symbols-outlined">thumb_up</span>${
              data.snippet.topLevelComment.snippet.likeCount
            }</p>
            <p><span class="material-symbols-outlined">thumb_down</span>0</p>  
            <p>REPLY</p>  
          </div>
        </div>
    </div>
      `
    );
  });
}
