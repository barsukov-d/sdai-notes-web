import { test } from "node:test"
import assert from "node:assert/strict"
import { counterText, plural, shortDate, statsText, validateText } from "./src/notes.js"

test("счётчик с правильным окончанием", () => {
  assert.equal(counterText(1, 3), "1 активная из 3")
  assert.equal(counterText(2, 3), "2 активные из 3")
  assert.equal(counterText(5, 7), "5 активных из 7")
  assert.equal(counterText(0, 0), "Заметок пока нет")
})

test("окончания для 11–14", () => {
  assert.equal(plural(11, ["a", "b", "c"]), "c")
  assert.equal(plural(21, ["a", "b", "c"]), "a")
  assert.equal(plural(12, ["a", "b", "c"]), "c")
})

test("проверка текста заметки", () => {
  assert.deepEqual(validateText("  купить хлеб "), { ok: true, text: "купить хлеб" })
  assert.equal(validateText("   ").ok, false)
  assert.equal(validateText("x".repeat(201)).ok, false)
})

test("сводка для подвала", () => {
  const lastNoteAt = "2026-10-22T12:00:00.000Z"
  assert.equal(statsText({ done: 1, total: 3, lastNoteAt }), "Сделано 1 из 3 · последняя заметка 22 окт.")
  assert.equal(statsText({ done: 0, total: 2, lastNoteAt }), `Сделано 0 из 2 · последняя заметка ${shortDate(lastNoteAt)}`)
  assert.equal(statsText({ done: 2, total: 2, lastNoteAt }), `Сделано 2 из 2 · последняя заметка ${shortDate(lastNoteAt)}`)
  assert.equal(statsText({ done: 0, total: 0, lastNoteAt: null }), "Заметок пока нет")
})
