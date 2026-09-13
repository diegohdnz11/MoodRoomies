type Card = {
  id: string;
  title: string;
  artist: string;
  image: string;
  imageDescription: string;
  rotation: string;
  uploadedCover?: boolean;
};

const cards: Card[] = [
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

function getRequiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Required element not found: ${selector}`);
  }

  return element;
}

const cardCollection = getRequiredElement<HTMLDivElement>("#card-collection");
const addRoomButton = getRequiredElement<HTMLButtonElement>("#add-room-button");
const roomDialog = getRequiredElement<HTMLDialogElement>("#room-dialog");
const roomForm = getRequiredElement<HTMLFormElement>("#room-form");
const roomTitleInput = getRequiredElement<HTMLInputElement>("#room-title");
const roomCoverInput = getRequiredElement<HTMLInputElement>("#room-cover");
const cancelRoomButton = getRequiredElement<HTMLButtonElement>("#cancel-room-button");
const roomListView = getRequiredElement<HTMLElement>("#room-list-view");
const roomDetailView = getRequiredElement<HTMLElement>("#room-detail-view");
const selectedCardArt = getRequiredElement<HTMLImageElement>("#selected-card-art");
const selectedCardTitle = getRequiredElement<HTMLHeadingElement>("#selected-card-title");
const selectedCardArtist = getRequiredElement<HTMLParagraphElement>("#selected-card-artist");
const backButton = getRequiredElement<HTMLButtonElement>("#back-button");

let cardButtonToRestoreFocus: HTMLButtonElement | null = null;

function openCard(card: Card, cardButton: HTMLButtonElement): void {
  selectedCardArt.src = card.image;
  selectedCardArt.alt = card.imageDescription;
  selectedCardTitle.textContent = card.title;
  selectedCardArtist.textContent = card.artist;
  cardButtonToRestoreFocus = cardButton;

  roomListView.hidden = true;
  roomDetailView.hidden = false;
  document.body.classList.add("detail-open");
  backButton.focus();
}

function closeCard(): void {
  roomDetailView.hidden = true;
  roomListView.hidden = false;
  document.body.classList.remove("detail-open");
  cardButtonToRestoreFocus?.focus();
}

function createCard(card: Card): HTMLElement {
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

  const openButton = document.createElement("button");
  openButton.className = "open-card-button";
  openButton.type = "button";
  openButton.setAttribute("aria-label", `Open ${card.title}`);
  openButton.addEventListener("click", () => openCard(card, openButton));

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.setAttribute("aria-label", `Delete ${card.title}`);
  deleteButton.innerHTML = '<img src="assets/trash-svgrepo-com.svg" alt="Delete Card Icon">';

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

  details.append(title, artist);
  openButton.append(artwork, details);
  article.append(openButton, deleteButton);

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

  const coverFile = roomCoverInput.files?.[0];

  if (!coverFile) {
    roomCoverInput.setCustomValidity("Choose an SVG, PNG, or JPEG cover file.");
    roomCoverInput.reportValidity();
    return;
  }

  const allowedTypes = new Set(["image/svg+xml", "image/png", "image/jpeg"]);
  const allowedExtensions = [".svg", ".png", ".jpg", ".jpeg"];
  const lowercaseFileName = coverFile.name.toLowerCase();
  const hasAllowedExtension = allowedExtensions.some((extension) =>
    lowercaseFileName.endsWith(extension),
  );

  if (!allowedTypes.has(coverFile.type) && !hasAllowedExtension) {
    roomCoverInput.setCustomValidity("Choose an SVG, PNG, or JPEG cover file.");
    roomCoverInput.reportValidity();
    return;
  }

  const formData = new FormData(roomForm);
  const titleValue = formData.get("title");
  const artistValue = formData.get("artist");

  if (typeof titleValue !== "string" || typeof artistValue !== "string") {
    throw new Error("The room form is missing its title or artist field.");
  }

  const title = titleValue.trim();
  const artist = artistValue.trim();
  const newCard: Card = {
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

backButton.addEventListener("click", closeCard);
