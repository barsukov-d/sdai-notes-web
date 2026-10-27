import { test } from "node:test"
import assert from "node:assert/strict"
import { counterText, plural, summaryText, validateText } from "./src/notes.js"

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
  const oct22 = new Date(2026, 9, 22, 12, 0, 0).toISOString()
  assert.equal(summaryText({ done: 1, total: 3, lastCreatedAt: oct22 }), "Сделано 1 из 3 · последняя заметка 22 окт.")
  assert.ok(summaryText({ done: 0, total: 5, lastCreatedAt: oct22 }).startsWith("Сделано 0 из 5 · последняя заметка "))
})

test("сводка без заметок", () => {
  assert.equal(summaryText({ done: 0, total: 0, lastCreatedAt: null }), "Заметок пока нет")
})
