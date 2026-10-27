/** Чистая логика показа заметок — без DOM и сети, её проверяют автотесты. */

/** «2 активных из 3» с правильным окончанием. */
export function counterText(active, total) {
  if (total === 0) return "Заметок пока нет"
  return `${active} ${plural(active, ["активная", "активные", "активных"])} из ${total}`
}

export function plural(n, [one, few, many]) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

/** Дата создания коротко: «22 окт.». */
export function shortDate(iso) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
}

/** Сводка в подвале: «Сделано 1 из 3 · последняя заметка 22 окт.». */
export function statsText(done, total, lastNoteAt) {
  if (total === 0 || !lastNoteAt) return "Заметок пока нет"
  return `Сделано ${done} из ${total} · последняя заметка ${shortDate(lastNoteAt)}`
}

/** Текст заметки перед отправкой: без пробелов по краям, не длиннее 200. */
export function validateText(raw) {
  const text = String(raw ?? "").trim()
  if (text === "") return { ok: false, error: "Введите текст заметки" }
  if (text.length > 200) return { ok: false, error: "Не длиннее 200 символов" }
  return { ok: true, text }
}
