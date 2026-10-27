import { counterText, shortDate, statsText, validateText } from "./notes.js"

const list = document.querySelector("[data-testid=notes]")
const counter = document.querySelector("[data-testid=counter]")
const errorBox = document.querySelector("[data-testid=error]")
const form = document.querySelector("[data-testid=add-form]")
const footer = document.querySelector("[data-testid=footer]")
let filter = "all"

async function api(path, init) {
  const res = await fetch(`/api${path}`, {
    headers: { "content-type": "application/json" },
    ...init,
  })
  if (!res.ok && res.status !== 204) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Сервер ответил ${res.status}`)
  }
  return res.status === 204 ? null : res.json()
}

function showError(message) {
  errorBox.textContent = message
  errorBox.hidden = !message
}

async function load() {
  try {
    const { notes, total, active } = await api(`/notes?filter=${filter}`)
    counter.textContent = counterText(active, total)
    list.replaceChildren(...notes.map(renderNote))
    showError("")
  } catch (e) {
    showError(`Не удалось загрузить заметки: ${e.message}`)
  }
}

/** Сводка по всем заметкам; при ошибке подвал остаётся как был, без сообщения. */
async function loadStats() {
  try {
    footer.textContent = statsText(await api("/stats"))
  } catch {
    // сводка необязательна — список и блок ошибок не трогаем
  }
}

/** После изменения заметок обновляем и список, и сводку. */
async function refresh() {
  await Promise.all([load(), loadStats()])
}

function renderNote(note) {
  const li = document.createElement("li")
  li.className = note.done ? "done" : ""
  li.dataset.testid = "note"

  const box = document.createElement("input")
  box.type = "checkbox"
  box.checked = note.done
  box.setAttribute("aria-label", "Сделано")
  box.addEventListener("change", async () => {
    await api(`/notes/${note.id}`, { method: "PATCH", body: JSON.stringify({ done: box.checked }) })
    await refresh()
  })

  const text = document.createElement("span")
  text.className = "text"
  text.textContent = note.text

  const date = document.createElement("time")
  date.textContent = shortDate(note.createdAt)

  const remove = document.createElement("button")
  remove.type = "button"
  remove.className = "remove"
  remove.textContent = "×"
  remove.setAttribute("aria-label", "Удалить")
  remove.addEventListener("click", async () => {
    await api(`/notes/${note.id}`, { method: "DELETE" })
    await refresh()
  })

  li.append(box, text, date, remove)
  return li
}

form.addEventListener("submit", async (event) => {
  event.preventDefault()
  const checked = validateText(form.elements.text.value)
  if (!checked.ok) return showError(checked.error)
  try {
    await api("/notes", { method: "POST", body: JSON.stringify({ text: checked.text }) })
    form.reset()
    await refresh()
  } catch (e) {
    showError(e.message)
  }
})

for (const button of document.querySelectorAll("[data-filter]")) {
  button.addEventListener("click", () => {
    filter = button.dataset.filter
    document.querySelectorAll("[data-filter]").forEach((b) => b.classList.toggle("active", b === button))
    load()
  })
}

refresh()
