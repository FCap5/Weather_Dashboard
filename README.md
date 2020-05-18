# 06_HW

## Should have followed Dave's advice

It would have been a good idea to have gotten this homework out of the way early. With the project consuming much of time, I figured I'd be able to just knock this homework out after the presnentations. It turnos out that this homework was a lot more than I had bargained for.

## Smooth sailing at the start

At the beginning, it seemed pretty straight forward. Build out the HTML, no problem. Make the basic framework, assign ids to reference from javascript so the framework can be fleshed out dynamically. Style things with CSS? Not a problem! It took me about 30 minutes to get the basics of the page up and running.

## A storm cloud in the distance

I was rolling through the Ajax call when I noticed that the winds might not be in my favor. I was searching through the APIs trying to find all the information when I realized that there wasn't a single URL that had all the information. So, I had to do a deep dive on open weather map and peice together all the differet data points I needed through a series of AJAX calls. While the searching took a little while, it wasn't too difficult.

## Keeping it Dynamic

Most of the early going was spent working on creating dynamic elements. First I addressed populating the current weather information, which was almost entirely from one API. Easy peasy. Then I had to find the UV index, which was annoying. I finally found a different URL with that information, made my ajax call and dynamically filled the paragraph.

Next I had to fill in the five day forecasts, which meant tracking down a third URL for yet another Ajax call. From there, I looped through the weather for the next five days, created cards, set the css so they were the right color and were responsive. The one thing I struggled with here as figuring out how to get the little weather logo in place. I ended up moving on from this to focus on something else. I figured that it was too small a thing to get hung up on when there were still other important things to focus on.

## Then it hit the fan

I had been cruising and had the search funcionality fully operaional. I decided to work on that part of it first since I thought I had just conquered local and session storage in my project. I figured this would be nice and easy. Hubris is not a good look.

I think a major factor in my struggles was that by this point, it was 1 AM. But, for the dumbest reason, I could not get my local storage to work. I had created a variable called city name, which captured the city name from the input field after the search button was clicked. The value of the input field was then entered into the URL in the Ajax call. This all worked out fine. The issue was that when I then set cityName to local storage. However, since it was set as a string, I needed to split the string, which is a function I hadn't used before. I couldn't figure out how to loop through the local storage and split it without adding additional charactrs on each split. The result was that the first search would work and it would succesfully add to local storage. But each additoanl search would fail.

I realized that I needed to enter an arguement into the split function so that it would split the string at the right moment. Then I needed to push the cityName into an array to then commit to local storage. After much tinkering, I was finally able to get it to work.

## Finally working

Once I figured out the local storage all I had to do was loop through it to dynamically create buttons for each entry. I then set a function to pull the value of each button, set it to cityName, and then reload the page, which would complete a search.

## Working, but needs some tweeks

There are still a few bugs I need to address. First, I need to set some if statements to ensure that a city name doesn't appear in the history twice. Next I need to create an error message so that if a city name is entered incorrectly, or otherwise not searchable through the API the message will appear and the search will stop and the city entry won't be added to local storage.

This last one is something that I think could be tricky with the way I organized my script doc. Because the functioanlity for committing to local storage is linked to the the click event for the submit button outisde of the Ajax call, I need to figure out a way to compare the entry against the API database. However, I couldnt think of a way to do that with the clickevent outside of the API. Conversely, I could put the click event listener inside of the ajax call. The issue with that is that when I did that, I ended up running some function an additional 5 times, creating 6 total history button returns, which is not the desired effect.

I'm going to have to take another crack at this one and see if I can work out the bugs. But, other than those two bugs, the app works as designed.

## update

I ended up moving the setting to local storage inside of the first ajax call. This made streamlined things and enabled me to use the following code to find any potential repeat entries and splice them out.

```
if (cityLSSplit.length <= 10) {
 for (i = 0; i < cityLSSplit.length; i++) {
if (newCityName == cityLSSplit[i]) {
cityLSSplit.splice(i, 1);
}
}
} else {
for (i = cityLSSplit.length - 10; i < cityLSSplit.length; i++) {
cityLSSplit.splice(i, 1);
}
}
cityArrayLS.push(cityLSSplit);
}
```
