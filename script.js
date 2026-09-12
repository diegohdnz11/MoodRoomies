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
    title: "Night Hour",
    artist: "Soft Fabric",
    image: "assets/blue-hour.svg",
    imageDescription: "Blue moonlight reflected across calm ocean waves",
    rotation: "2deg",
  },
  {
    id: "afterglow",
    title: "Sunset Avenue",
    artist: "Velvet Glow",
    image: "assets/afterglow.svg",
    imageDescription: "Warm glowing circles floating above a dark landscape",
    rotation: "-1deg",
  },
];

const cardCollection = document.querySelector("#card-collection");
const addRoomButton = document.querySelector("#add-room-button");
const roomDialog = document.querySelector("#room-dialog");
const roomForm = document.querySelector("#room-form");
const roomTitleInput = document.querySelector("#room-title");
const roomCoverInput = document.querySelector("#room-cover");
const cancelRoomButton = document.querySelector("#cancel-room-button");

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


  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.innerHTML=`<img src ="assets/trash-svgrepo-com.svg" alt="Icon">`



  deleteButton.addEventListener("click", () => {
    const cardIndex = cards.indexOf(card);

    if (cardIndex !== -1) {
      cards.splice(cardIndex, 1);
    }

    if (card.uploadedCover) {
      URL.revokeObjectURL(card.image);
    }

    article.remove();
  });

  details.append(title, artist, deleteButton);
  article.append(artwork, details);

  return article;
}

cards.forEach((card) => {
  cardCollection.append(createCard(card));
});

addRoomButton.addEventListener("click", () => {
  roomDialog.showModal();
  roomTitleInput.focus();
});

cancelRoomButton.addEventListener("click", () => {
  roomDialog.close();
});

roomCoverInput.addEventListener("change", () => {
  roomCoverInput.setCustomValidity("");
});

roomForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const coverFile = roomCoverInput.files[0];

  if (coverFile.type !== "image/svg+xml" && !coverFile.name.toLowerCase().endsWith(".svg")) {
    roomCoverInput.setCustomValidity("Choose an SVG cover file.");
    roomCoverInput.reportValidity();
    return;
  }

  const formData = new FormData(roomForm);
  const title = formData.get("title").trim();
  const artist = formData.get("artist").trim();
  const newCard = {
    id: crypto.randomUUID(),
    title,
    artist,
    image: URL.createObjectURL(coverFile),
    imageDescription: `${title} cover`,
    rotation: "0deg",
    uploadedCover: true,
  };

  cards.push(newCard);
  cardCollection.append(createCard(newCard));
  roomDialog.close();
});

roomDialog.addEventListener("close", () => {
  roomForm.reset();
  roomCoverInput.setCustomValidity("");
});
