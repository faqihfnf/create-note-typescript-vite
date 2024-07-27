import { fetchData } from "./libs/fetch";
import { INote } from "./types/entity";

interface INoteResult {
  data: INote[];
}

const API_URL = "https://v1.appbackend.io/v1/rows/03YhU6qbmTCP";

async function app() {
  const notes = await fetchData<INoteResult>(API_URL);
  if (!notes) {
    console.log("error");
    return;
  }

  const container = document.querySelector(".container");
  if (!container) {
    console.error("Container element not found");
    return;
  }
  notes.data.map((note) => {
    const newNote = document.createElement("div");
    newNote.classList.add("note");
    const noteTitle = document.createElement("h3");
    const noteContent = document.createElement("p");
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", async () => {
      const id = note._id;
      try {
        await fetch(API_URL, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([id]),
        });
      } catch (error) {
        console.error(error);
      } finally {
        window.location.reload();
      }
    });

    noteTitle.textContent = note.title;
    noteContent.textContent = note.content;
    newNote.append(noteTitle, noteContent);
    newNote.append(deleteBtn);
    // document.body.appendChild(newNote);
    container.append(newNote);
  });
}

app();

// create note

const titleInput = document.getElementById("input") as HTMLInputElement;
const contentInput = document.getElementById("content") as HTMLInputElement;
const addNoteBtn = document.getElementById("addBtn");

addNoteBtn?.addEventListener("click", async () => {
  const title = titleInput?.value;
  const content = contentInput?.value;
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ title, content }]),
    });
  } catch (error) {
    console.error(error);
  } finally {
    //* digunakan untuk menjalankan code ketika try & catch selesai dijalankan
    window.location.reload();
  }
});
