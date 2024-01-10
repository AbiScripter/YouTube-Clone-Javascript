// let date1 = new Date("2024-01-05T12:51:47Z");
// YYYY-MM-DD T HH:MM:SSZ => so the last Z indicates Zulu time, also known as Coordinated Universal Time (UTC).Zulu time (UTC) is not linked to a particular region; it's a universal time standard.
//so when converted to localTimeString[India,UTC+5:30] it will change
let currTime = new Date();

// function editDate(difference) {
//   if (difference >= 365) {
//     let edited = Math.floor(difference / 365);
//     return edited > 1 ? edited + " years" : edited + " year";
//   } else if (difference >= 30) {
//     let edited = Math.floor(difference / 30);
//     return edited > 1 ? edited + " months" : edited + " month";
//   } else if (difference >= 14) {
//     let edited = Math.floor(difference / 14);
//     return edited > 1 ? edited + " weeks" : edited + " week";
//   } else if (difference >= 1) {
//     let edited = Math.floor(difference);
//     return edited > 1 ? edited + " days" : edited + " day";
//   } else if (difference >= 1 / 24) {
//     let edited = Math.floor(difference * 24);
//     return edited > 1 ? edited + " hours" : edited + " hour";
//   } else {
//     let edited = Math.floor(difference * 24 * 60);
//     return edited > 1 ? edited + " minutes" : edited + " minute";
//   }
// }

function formatTimeDifference(difference) {
  let passedTime = new Date(difference);
  const differenceInMilliseconds = currTime - passedTime;

  // Convert milliseconds to days
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
  const timeUnits = [
    { unit: "year", divisor: 365 },
    { unit: "month", divisor: 30 },
    { unit: "week", divisor: 14 },
    { unit: "day", divisor: 1 },
    { unit: "hour", divisor: 1 / 24 },
    { unit: "minute", divisor: 1 / (24 * 60) },
  ];

  for (const { unit, divisor } of timeUnits) {
    if (differenceInDays >= divisor) {
      const formattedTime = Math.floor(differenceInDays / divisor);
      return formattedTime > 1
        ? `${formattedTime} ${unit}s`
        : `${formattedTime} ${unit}`;
    }
  }
}

function formatViews(views) {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M";
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + "K";
  } else {
    return views;
  }
}

function formatTitle(title) {
  return title.slice(0, 40).trim() + "...";
}
