//// Animator -- an application for program-generated drawings.

import builtins
import drawing
import editor
import errors
import gleam/float
import gleam/int
import gleam/list
import gleam/option.{type Option, None, Some}
import gleam/result
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

const path_color = "#d4c5a0"

const default_shape_slider = 10

const default_speed = 1.0

// ── Model ──────────────────────────────────────────────────────────────────────

pub type Model {
  Model(
    // The code in the editor.
    source: String,
    // Whether the code editor is shown.
    code_open: Bool,
    output: String,
    // Value passed to draw as shape_slider, in [0, 100].
    shape_slider: Int,
    // Animation speed multiplier; negative plays backward.
    speed: Float,
    // When True, the clock is held still via set_speed(0.0).
    paused: Bool,
  )
}

pub type Msg {
  SetCode(String)
  SetShapeSlider(String)
  SetSpeed(String)
  TogglePause
  // Restore shape/speed sliders to their initial defaults.
  ResetSliders
  // Replay the current drawing from the start without changing the code.
  RestartAnimation

  // Layout controls
  ToggleCode
}

// ── Init ───────────────────────────────────────────────────────────────────────

pub fn init(_flags: Nil) -> #(Model, Effect(Msg)) {
  #(
    Model(
      source: "",
      code_open: True,
      output: "",
      shape_slider: default_shape_slider,
      speed: default_speed,
      paused: False,
    ),
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

fn apply_drawing_result(
  model: Model,
  source: String,
  shape_slider: Int,
  on_ok: fn(List(Path)) -> Effect(Msg),
) -> #(Model, Effect(Msg)) {
  case run_source(shape_slider, source) {
    Ok(paths) -> #(
      Model(..model, output: "", source: source, shape_slider: shape_slider),
      effect.batch([on_ok(paths), editor.clear_error()]),
    )
    Error(#(msg, line)) -> #(
      Model(..model, output: msg, source: source, shape_slider: shape_slider),
      case line {
        Some(n) -> editor.set_error(n, msg)
        None -> editor.clear_error()
      },
    )
  }
}

// ── Update ─────────────────────────────────────────────────────────────────────

pub fn update(model: Model, msg: Msg) -> #(Model, Effect(Msg)) {
  case msg {
    ToggleCode -> #(Model(..model, code_open: !model.code_open), effect.none())

    // After each keystroke, re-evaluate and restart the animation from empty.
    SetCode(text) ->
      apply_drawing_result(model, text, model.shape_slider, fn(paths) {
        effect.batch([push_drawing(paths), reset_clock()])
      })

    // Shape slider: redraw at the same clock so a finished drawing stays complete.
    SetShapeSlider(raw) -> {
      let shape =
        int.parse(raw)
        |> result.unwrap(model.shape_slider)
      apply_drawing_result(model, model.source, shape, push_drawing)
    }

    SetSpeed(raw) -> {
      let speed = float.parse(raw) |> result.unwrap(model.speed)
      let model = Model(..model, speed: speed)
      case model.paused {
        // Keep the clock frozen while paused; the new rate applies on resume.
        True -> #(model, effect.none())
        False -> #(model, set_speed(speed))
      }
    }

    // Pause freezes the clock (speed 0); click again to resume at the slider rate.
    TogglePause ->
      case model.paused {
        False -> #(Model(..model, paused: True), set_speed(0.0))
        True -> #(Model(..model, paused: False), set_speed(model.speed))
      }

    ResetSliders -> {
      let model =
        Model(
          ..model,
          shape_slider: default_shape_slider,
          speed: default_speed,
          paused: False,
        )
      let #(model, draw_effect) =
        apply_drawing_result(
          model,
          model.source,
          default_shape_slider,
          push_drawing,
        )
      #(model, effect.batch([draw_effect, set_speed(default_speed)]))
    }

    RestartAnimation -> #(model, reset_clock())
  }
}

/// Push paths to the canvas without touching the clock or speed.
fn push_drawing(paths: List(Path)) -> Effect(Msg) {
  effect.from(fn(_dispatch) {
    let rendered =
      list.map(paths, fn(path) { render.render_path(path, path_color) })
    render.set_drawing(rendered)
  })
}

fn reset_clock() -> Effect(Msg) {
  effect.from(fn(_dispatch) { render.reset_clock() })
}

fn set_speed(rate: Float) -> Effect(Msg) {
  effect.from(fn(_dispatch) { render.set_speed(rate) })
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
    view_controls(model),
    html.canvas([attr.id("animation-canvas"), attr.class("canvas")]),
    case model.output {
      "" -> element.none()
      _ -> html.pre([attr.class("output")], [html.text(model.output)])
    },
  ])
}

fn view_controls(model: Model) -> Element(Msg) {
  let #(pause_label, pause_title) = case model.paused {
    True -> #("Play", "Resume animation")
    False -> #("Pause", "Pause animation")
  }
  html.div([attr.class("controls")], [
    html.div([attr.class("control-row")], [
      html.button(
        [
          attr.class("icon-btn"),
          attr.attribute("title", pause_title),
          event.on_click(TogglePause),
        ],
        [html.text(pause_label)],
      ),
      html.button(
        [
          attr.class("icon-btn"),
          attr.attribute("title", "Restart animation from the start"),
          event.on_click(RestartAnimation),
        ],
        [html.text("Restart")],
      ),
      html.button(
        [
          attr.class("icon-btn"),
          attr.attribute("title", "Reset shape and speed to defaults"),
          event.on_click(ResetSliders),
        ],
        [html.text("Reset")],
      ),
      html.label([attr.class("control")], [
        html.span([attr.class("control-label")], [html.text("speed")]),
        html.input([
          attr.type_("range"),
          attr.min("-2"),
          attr.max("2"),
          attr.step("0.1"),
          attr.value(float.to_string(model.speed)),
          attr.attribute("data-test-id", "speed-slider"),
          event.on_input(SetSpeed),
        ]),
      ]),
    ]),
    html.label([attr.class("control")], [
      html.span([attr.class("control-label")], [html.text("shape")]),
      html.input([
        attr.type_("range"),
        attr.min("0"),
        attr.max("100"),
        attr.step("1"),
        attr.value(int.to_string(model.shape_slider)),
        attr.attribute("data-test-id", "shape-slider"),
        event.on_input(SetShapeSlider),
      ]),
    ]),
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
