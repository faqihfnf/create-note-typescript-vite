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

  const container = document.querySelector(".container");
  if (!container) {
    console.error("Container element not found");
    return;
  }
  notes.data.map((note) => {
    const newNote = document.createElement("div");
    newNote.classList.add("note");
    const noteTitle = document.createElement("h3");
    const noteContent = document.createElement("textarea");
    noteContent.classList.add("note-content");
    noteContent.setAttribute("rows", "5");
    const boxBtn = document.createElement("div");
    boxBtn.classList.add("box-btn");
    const updateBtn = document.createElement("button");
    updateBtn.classList.add("update-btn");
    updateBtn.textContent = "Update";
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
    updateBtn.addEventListener("click", async () => {
      const id = note._id;
      const title = noteTitle.textContent;
      const content = noteContent.value;

      try {
        const response = await fetch(API_URL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: id, title, content }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Update failed: ${errorText}`);
        }

        const result = await response.json();
        console.log("Update result:", result);
      } catch (error) {
        console.error(error);
      } finally {
        window.location.reload();
      }
    });

    noteTitle.textContent = note.title;
    noteContent.textContent = note.content;
    newNote.append(noteTitle, noteContent);
    newNote.append(boxBtn);
    boxBtn.append(updateBtn);
    boxBtn.append(deleteBtn);
    // newNote.append(updateBtn);
    // newNote.append(deleteBtn);
    container.append(newNote);
  });
}

app();

// create note

const titleInput = document.getElementById("input") as HTMLInputElement;
const contentInput = document.getElementById("content") as HTMLInputElement;
const addNoteBtn = document.getElementById("addBtn");
