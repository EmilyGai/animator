//// The library of saved drawings. A drawing is a name and the source of its draw
//// function.

import examples
import gleam/dynamic/decode
import gleam/json
import gleam/list

// ── localStorage (data_ffi.mjs) ───────────────────────────────────────────────

/// The string stored in localStorage under key, or an Error if there isn't one.
@external(javascript, "./data_ffi.mjs", "storageGet")
pub fn storage_get(key: String) -> Result(String, Nil)

/// Store value in localStorage under key, replacing anything already there. If that
/// isn't possible, this logs the reason to the browser console.
@external(javascript, "./data_ffi.mjs", "storageSet")
pub fn storage_set(key: String, value: String) -> Nil

// ── The new-drawing prompt (data_ffi.mjs) ─────────────────────────────────────

/// Prompt the user to name a new drawing; "" (empty string) means they
/// cancelled or left it blank.
@external(javascript, "./data_ffi.mjs", "promptDrawingName")
pub fn prompt_drawing_name() -> String

/// Single localStorage key for the whole library (drawings + which one is open).
pub const library_key = "animator-library"

/// Saved library: which drawing is open, and every named source as plain text.
pub type Library {
  Library(selected: String, drawings: List(#(String, String)))
}

/// Load the library from localStorage. If nothing is stored or the data is
/// invalid, start from `examples.all` with the first example selected.
pub fn load_library() -> Library {
  case storage_get(library_key) {
    Ok(raw) ->
      case decode_library(raw) {
        Ok(library) -> normalize(library)
        Error(_) -> default_library()
      }
    Error(_) -> default_library()
  }
}

/// Persist the library. Each drawing's `source` is stored as the user's code
/// text, so typed content appears verbatim under this key in localStorage.
pub fn save_library(library: Library) -> Nil {
  storage_set(library_key, encode_library(library))
}

fn default_library() -> Library {
  normalize(Library(selected: "", drawings: examples.all))
}

/// Ensure there is at least one drawing and that `selected` names one of them.
fn normalize(library: Library) -> Library {
  let drawings = case library.drawings {
    [] -> examples.all
    drawings -> drawings
  }
  let selected = case
    list.find(drawings, fn(drawing) { drawing.0 == library.selected })
  {
    Ok(#(name, _)) -> name
    Error(_) ->
      case drawings {
        [#(name, _), ..] -> name
        [] -> "untitled"
      }
  }
  Library(selected: selected, drawings: drawings)
}

fn encode_library(library: Library) -> String {
  json.object([
    #("selected", json.string(library.selected)),
    #(
      "drawings",
      json.array(library.drawings, of: fn(drawing) {
        json.object([
          #("name", json.string(drawing.0)),
          #("source", json.string(drawing.1)),
        ])
      }),
    ),
  ])
  |> json.to_string
}

fn decode_library(raw: String) -> Result(Library, json.DecodeError) {
  let drawing_decoder = {
    use name <- decode.field("name", decode.string)
    use source <- decode.field("source", decode.string)
    decode.success(#(name, source))
  }
  let library_decoder = {
    use selected <- decode.field("selected", decode.string)
    use drawings <- decode.field("drawings", decode.list(drawing_decoder))
    decode.success(Library(selected: selected, drawings: drawings))
  }
  json.parse(raw, using: library_decoder)
}
