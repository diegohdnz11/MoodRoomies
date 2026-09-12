const cards = [
  {
    id: "midnight-sun",
    title: "Midnight Sun",
    artist: "Free Coast",
    image: "assets/sample-cover.svg",
    imageDescription: "Abstract purple and orange sunset over a dark horizon",
    rotation: "-3deg",
  },
  {
    id: "blue-hour",
    title: "Blue Hour",
    artist: "Soft Static",
    image: "assets/blue-hour.svg",
    imageDescription: "Blue moonlight reflected across calm ocean waves",
    rotation: "2deg",
  },
  {
    id: "afterglow",
    title: "Afterglow",
    artist: "Velvet Avenue",
    image: "assets/afterglow.svg",
    imageDescription: "Warm glowing circles floating above a dark landscape",
    rotation: "-1deg",
  },
];

const cardCollection = document.querySelector("#card-collection");

function createCard(card) {
  const article = document.createElement("article");
  article.className = "cover-card";
  article.dataset.cardId = card.id;
  article.style.setProperty("--card-rotation", card.rotation);

  const artwork = document.createElement("img");
  artwork.className = "cover-art";
  artwork.src = card.image;
  artwork.alt = card.imageDescription;

  const details = document.createElement("div");
  details.className = "cover-details";

  const title = document.createElement("h3");
  title.textContent = card.title;

  const artist = document.createElement("p");
  artist.textContent = card.artist;

  details.append(title, artist);
  article.append(artwork, details);

  return article;
}

cards.forEach((card) => {
  cardCollection.append(createCard(card));
});
