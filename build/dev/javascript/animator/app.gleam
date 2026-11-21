//// Animator -- an application for program-generated drawings.

import builtins
import drawing
import editor
import errors
import gleam/list
import gleam/option.{type Option, None, Some}
import lustre
import lustre/attribute as attr
import lustre/effect.{type Effect}
import lustre/element.{type Element}
import lustre/element/html
import lustre/event
import parser
import render
import shape.{type Path}

/// Your app's public address, once you've deployed it in Problem 13, such as
/// "https://your-username.github.io/animator/".
pub const public_url = ""

/// Set to True if you would like your app's URL included in the course gallery.
pub const include_app_in_gallery = False

/// A link to your video from Problem 14, which anyone with the link can watch.
pub const video_url = ""

/// Set to True if you would like your video included in the course gallery.
pub const include_video_in_gallery = False

const default_code = "fn draw(shape_slider: Int) -> List(Path) {\n  [Path(Line(Point(0, 0), Point(100, 100)), 0, 10, 2)]\n}\n"

// ── Model ──────────────────────────────────────────────────────────────────────

pub type Model {
  Model(
    // The code in the editor.
    source: String,
    // Whether the code editor is shown.
    code_open: Bool,
    output: String,
  )
}

pub type Msg {
  SetCode(String)

  // Layout controls
  ToggleCode
}

// ── Init ───────────────────────────────────────────────────────────────────────

pub fn init(_flags: Nil) -> #(Model, Effect(Msg)) {
  #(
    Model(source: "", code_open: True, output: ""),
    // Effects that happen automatically at the start go here.
    effect.batch([
      editor.mount(default_code, SetCode),
      effect.from(fn(dispatch) { dispatch(SetCode(default_code)) }),
    ]),
  )
}

// Parse and evaluate a draw function at the given shape-slider value, returning
// the paths on success, or the error message and optional source line on failure.
fn run_source(
  shape_slider: Int,
  source: String,
) -> Result(List(Path), #(String, Option(Int))) {
  case parser.parse_program(source, builtins.global_frame()) {
    Error(msg) -> Error(#(msg, errors.line_from_message(msg)))
    Ok(program) ->
      case drawing.try_draw(shape_slider, program) {
        Ok(paths) -> Ok(paths)
        Error(err) ->
          Error(#(errors.error_message(err), errors.error_line(err)))
      }
  }
}

// ── Update ─────────────────────────────────────────────────────────────────────

pub fn update(model: Model, msg: Msg) -> #(Model, Effect(Msg)) {
  case msg {
    ToggleCode -> #(Model(..model, code_open: !model.code_open), effect.none())

    // After each keystroke in the editor, evaluate user code and animate it.
    SetCode(text) ->
      case run_source(10, text) {
        // Parsed and evaluated: draw the paths and clear any error underline.
        Ok(paths) -> #(
          Model(..model, output: "", source: text),
          effect.batch([animate_drawing(paths), editor.clear_error()]),
        )
        // Broken (parse or evaluation): show the message and underline the line.
        Error(#(msg, line)) -> #(
          Model(..model, output: msg, source: text),
          case line {
            Some(n) -> editor.set_error(n, msg)
            None -> editor.clear_error()
          },
        )
      }
  }
}

const path_color = "#d4c5a0"

/// Convert evaluated paths to RenderPaths, push them to the canvas, and restart
/// the animation from the beginning at normal speed.
fn animate_drawing(paths: List(Path)) -> Effect(Msg) {
  effect.from(fn(_dispatch) {
    let rendered =
      list.map(paths, fn(path) { render.render_path(path, path_color) })
    render.set_drawing(rendered)
    render.set_speed(1.0)
    render.reset_clock()
  })
}

// ── View ──────────────────────────────────────────────────────────────────
//
// Two side-by-side panes: the code editor on the left and its rendered output on
// the right. The code column can be hidden to expand the right pane.

pub fn view(model: Model) -> Element(Msg) {
  let app_class = case model.code_open {
    True -> "app"
    False -> "app code-hidden"
  }
  // The code column still exists even when hidden (CSS collapses it) so the
  // mounted CodeMirror editor keeps its state across show/hide.
  html.div([attr.class(app_class)], [
    html.div([attr.class("code-col")], [
      editor.view_panel(ToggleCode),
    ]),
    view_anim(model),
  ])
}

fn view_anim(model: Model) -> Element(Msg) {
  html.div([attr.class("canvas-area")], [
    view_reveal_code(model),
    html.canvas([attr.id("animation-canvas"), attr.class("canvas")]),
    case model.output {
      "" -> element.none()
      _ -> html.pre([attr.class("output")], [html.text(model.output)])
    },
  ])
}

// The button that brings the code column back, overlaid on the top-left of the
// right pane. Nothing is rendered while the column is already showing (its own
// header holds the button that hides it).
fn view_reveal_code(model: Model) -> Element(Msg) {
  case model.code_open {
    True -> element.none()
    False ->
      html.button(
        [
          attr.class("icon-btn reveal-code"),
          attr.attribute("title", "Show code"),
          event.on_click(ToggleCode),
        ],
        [html.text("⟩")],
      )
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────

pub fn main() -> Nil {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", Nil)
  Nil
}
