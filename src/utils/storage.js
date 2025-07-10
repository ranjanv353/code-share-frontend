import { RECENT_EDITORS_KEY } from "../constants.js";

export function getAllEditors() {
  const data = localStorage.getItem(RECENT_EDITORS_KEY);
  return data ? JSON.parse(data) : [];
}

// Save all editors
export function saveAllEditors(editors) {
  localStorage.setItem(RECENT_EDITORS_KEY, JSON.stringify(editors));
}

export function getEditorById(id) {
  return getAllEditors().find(editor => editor.id === id) || null;
}


export function upsertEditor(editor) {
  let editors = getAllEditors();
  const idx = editors.findIndex(e => e.id === editor.id);
  if (idx !== -1) {
    editors[idx] = { ...editors[idx], ...editor, lastEdited: new Date().toISOString() };
  } else {
    editors.unshift({ ...editor, lastEdited: new Date().toISOString() });
  }
  saveAllEditors(editors);
}

export function deleteEditor(id) {
  let editors = getAllEditors().filter(e => e.id !== id);
  saveAllEditors(editors);
}
