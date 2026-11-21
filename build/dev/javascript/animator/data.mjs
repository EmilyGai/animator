//# sourceMappingURL=data.mjs.map
import * as $json from "../gleam_json/gleam/json.mjs";
import * as $decode from "../gleam_stdlib/gleam/dynamic/decode.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import {
  storageGet as storage_get,
  storageSet as storage_set,
  promptDrawingName as prompt_drawing_name,
} from "./data_ffi.mjs";
import * as $examples from "./examples.mjs";
import {
  Ok,
  Empty as $Empty,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
} from "./gleam.mjs";

export { prompt_drawing_name, storage_get, storage_set };

export class Library extends $CustomType {
  constructor(selected, drawings) {
    super();
    this.selected = selected;
    this.drawings = drawings;
  }
}
export const Library$Library = (selected, drawings) =>
  new Library(selected, drawings);
export const Library$isLibrary = (value) => value instanceof Library;
export const Library$Library$selected = (value) => value.selected;
export const Library$Library$0 = (value) => value.selected;
export const Library$Library$drawings = (value) => value.drawings;
export const Library$Library$1 = (value) => value.drawings;

/**
 * Single localStorage key for the whole library (drawings + which one is open).
 */
export const library_key = "animator-library";

/**
 * Ensure there is at least one drawing and that `selected` names one of them.
 * 
 * @ignore
 */
function normalize(library) {
  let _block;
  let $ = library.drawings;
  if ($ instanceof $Empty) {
    _block = $examples.all;
  } else {
    _block = $;
  }
  let drawings = _block;
  let _block$1;
  let $1 = $list.find(
    drawings,
    (drawing) => { return drawing[0] === library.selected; },
  );
  if ($1 instanceof Ok) {
    let name = $1[0][0];
    _block$1 = name;
  } else {
    if (drawings instanceof $Empty) {
      _block$1 = "untitled";
    } else {
      let name = drawings.head[0];
      _block$1 = name;
    }
  }
  let selected = _block$1;
  return new Library(selected, drawings);
}

function default_library() {
  return normalize(new Library("", $examples.all));
}

function decode_library(raw) {
  let drawing_decoder = $decode.field(
    "name",
    $decode.string,
    (name) => {
      return $decode.field(
        "source",
        $decode.string,
        (source) => { return $decode.success([name, source]); },
      );
    },
  );
  let library_decoder = $decode.field(
    "selected",
    $decode.string,
    (selected) => {
      return $decode.field(
        "drawings",
        $decode.list(drawing_decoder),
        (drawings) => {
          return $decode.success(new Library(selected, drawings));
        },
      );
    },
  );
  return $json.parse(raw, library_decoder);
}

/**
 * Load the library from localStorage. If nothing is stored or the data is
 * invalid, start from `examples.all` with the first example selected.
 */
export function load_library() {
  let $ = storage_get(library_key);
  if ($ instanceof Ok) {
    let raw = $[0];
    let $1 = decode_library(raw);
    if ($1 instanceof Ok) {
      let library = $1[0];
      return normalize(library);
    } else {
      return default_library();
    }
  } else {
    return default_library();
  }
}

function encode_library(library) {
  let _pipe = $json.object(
    listPrepend(
      ["selected", $json.string(library.selected)],
      listPrepend(
        [
          "drawings",
          $json.array(
            library.drawings,
            (drawing) => {
              return $json.object(
                listPrepend(
                  ["name", $json.string(drawing[0])],
                  listPrepend(
                    ["source", $json.string(drawing[1])],
                    $List$Empty$const,
                  ),
                ),
              );
            },
          ),
        ],
        $List$Empty$const,
      ),
    ),
  );
  return $json.to_string(_pipe);
}

/**
 * Persist the library. Each drawing's `source` is stored as the user's code
 * text, so typed content appears verbatim under this key in localStorage.
 */
export function save_library(library) {
  return storage_set(library_key, encode_library(library));
}
