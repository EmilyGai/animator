//# sourceMappingURL=app.mjs.map
import * as $float from "../gleam_stdlib/gleam/float.mjs";
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $option from "../gleam_stdlib/gleam/option.mjs";
import { None, Some } from "../gleam_stdlib/gleam/option.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import * as $lustre from "../lustre/lustre.mjs";
import * as $attr from "../lustre/lustre/attribute.mjs";
import * as $effect from "../lustre/lustre/effect.mjs";
import * as $element from "../lustre/lustre/element.mjs";
import * as $html from "../lustre/lustre/element/html.mjs";
import * as $event from "../lustre/lustre/event.mjs";
import * as $builtins from "./builtins.mjs";
import * as $data from "./data.mjs";
import * as $drawing from "./drawing.mjs";
import * as $editor from "./editor.mjs";
import * as $errors from "./errors.mjs";
import {
  Ok,
  Error,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
  makeError,
} from "./gleam.mjs";
import * as $parser from "./parser.mjs";
import * as $render from "./render.mjs";
import * as $shape from "./shape.mjs";

const FILEPATH = "src/app.gleam";

export class Model extends $CustomType {
  constructor(source, code_open, output, shape_slider, speed, paused, drawings, selected) {
    super();
    this.source = source;
    this.code_open = code_open;
    this.output = output;
    this.shape_slider = shape_slider;
    this.speed = speed;
    this.paused = paused;
    this.drawings = drawings;
    this.selected = selected;
  }
}
export const Model$Model = (source, code_open, output, shape_slider, speed, paused, drawings, selected) =>
  new Model(source,
  code_open,
  output,
  shape_slider,
  speed,
  paused,
  drawings,
  selected);
export const Model$isModel = (value) => value instanceof Model;
export const Model$Model$source = (value) => value.source;
export const Model$Model$0 = (value) => value.source;
export const Model$Model$code_open = (value) => value.code_open;
export const Model$Model$1 = (value) => value.code_open;
export const Model$Model$output = (value) => value.output;
export const Model$Model$2 = (value) => value.output;
export const Model$Model$shape_slider = (value) => value.shape_slider;
export const Model$Model$3 = (value) => value.shape_slider;
export const Model$Model$speed = (value) => value.speed;
export const Model$Model$4 = (value) => value.speed;
export const Model$Model$paused = (value) => value.paused;
export const Model$Model$5 = (value) => value.paused;
export const Model$Model$drawings = (value) => value.drawings;
export const Model$Model$6 = (value) => value.drawings;
export const Model$Model$selected = (value) => value.selected;
export const Model$Model$7 = (value) => value.selected;

export class SetCode extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetCode = ($0) => new SetCode($0);
export const Msg$isSetCode = (value) => value instanceof SetCode;
export const Msg$SetCode$0 = (value) => value[0];

export class SetShapeSlider extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetShapeSlider = ($0) => new SetShapeSlider($0);
export const Msg$isSetShapeSlider = (value) => value instanceof SetShapeSlider;
export const Msg$SetShapeSlider$0 = (value) => value[0];

export class SetSpeed extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetSpeed = ($0) => new SetSpeed($0);
export const Msg$isSetSpeed = (value) => value instanceof SetSpeed;
export const Msg$SetSpeed$0 = (value) => value[0];

export class TogglePause extends $CustomType {}
export const Msg$TogglePause$const = new TogglePause();
export const Msg$TogglePause = () => Msg$TogglePause$const;
export const Msg$isTogglePause = (value) => value instanceof TogglePause;

export class ResetSliders extends $CustomType {}
export const Msg$ResetSliders$const = new ResetSliders();
export const Msg$ResetSliders = () => Msg$ResetSliders$const;
export const Msg$isResetSliders = (value) => value instanceof ResetSliders;

export class RestartAnimation extends $CustomType {}
export const Msg$RestartAnimation$const = new RestartAnimation();
export const Msg$RestartAnimation = () => Msg$RestartAnimation$const;
export const Msg$isRestartAnimation = (value) =>
  value instanceof RestartAnimation;

export class SelectDrawing extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SelectDrawing = ($0) => new SelectDrawing($0);
export const Msg$isSelectDrawing = (value) => value instanceof SelectDrawing;
export const Msg$SelectDrawing$0 = (value) => value[0];

export class ConfirmNewDrawing extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$ConfirmNewDrawing = ($0) => new ConfirmNewDrawing($0);
export const Msg$isConfirmNewDrawing = (value) =>
  value instanceof ConfirmNewDrawing;
export const Msg$ConfirmNewDrawing$0 = (value) => value[0];

export class CancelNewDrawing extends $CustomType {}
export const Msg$CancelNewDrawing$const = new CancelNewDrawing();
export const Msg$CancelNewDrawing = () => Msg$CancelNewDrawing$const;
export const Msg$isCancelNewDrawing = (value) =>
  value instanceof CancelNewDrawing;

export class ToggleCode extends $CustomType {}
export const Msg$ToggleCode$const = new ToggleCode();
export const Msg$ToggleCode = () => Msg$ToggleCode$const;
export const Msg$isToggleCode = (value) => value instanceof ToggleCode;

const default_speed = 1.0;

const default_shape_slider = 10;

const default_code = "fn draw(shape_slider: Int) -> List(Path) {\n  [Path(Line(Point(0, 0), Point(100, 100)), 0, 10, 2)]\n}\n";

const path_color = "#d4c5a0";

/**
 * Gradescope treats every non-empty option value as a drawing, so "New drawing…"
 * must use the empty string.
 * 
 * @ignore
 */
const new_drawing_option = "";

/**
 * Your app's public address, once you've deployed it in Problem 13, such as
 * "https://your-username.github.io/animator/".
 */
export const public_url = "";

/**
 * Set to True if you would like your app's URL included in the course gallery.
 */
export const include_app_in_gallery = false;

/**
 * A link to your video from Problem 14, which anyone with the link can watch.
 */
export const video_url = "";

/**
 * Set to True if you would like your video included in the course gallery.
 */
export const include_video_in_gallery = false;

function find_source(drawings, name) {
  let $ = $list.find(drawings, (drawing) => { return drawing[0] === name; });
  if ($ instanceof Ok) {
    let source = $[0][1];
    return new Ok(source);
  } else {
    return new Error(undefined);
  }
}

export function init(_) {
  let library = $data.load_library();
  let _block;
  let $ = find_source(library.drawings, library.selected);
  if ($ instanceof Ok) {
    let src = $[0];
    _block = src;
  } else {
    _block = default_code;
  }
  let source = _block;
  return [
    new Model(
      source,
      true,
      "",
      default_shape_slider,
      default_speed,
      false,
      library.drawings,
      library.selected,
    ),
    $effect.batch(
      listPrepend(
        $editor.mount(source, (var0) => { return new SetCode(var0); }),
        listPrepend(
          $effect.from((dispatch) => { return dispatch(new SetCode(source)); }),
          $List$Empty$const,
        ),
      ),
    ),
  ];
}

function run_source(shape_slider, source) {
  let $ = $parser.parse_program(source, $builtins.global_frame());
  if ($ instanceof Ok) {
    let program = $[0];
    let $1 = $drawing.try_draw(shape_slider, program);
    if ($1 instanceof Ok) {
      return $1;
    } else {
      let err = $1[0];
      return new Error([$errors.error_message(err), $errors.error_line(err)]);
    }
  } else {
    let msg = $[0];
    return new Error([msg, $errors.line_from_message(msg)]);
  }
}

function clear_drawing() {
  return $effect.from(
    (_) => {
      $render.set_drawing($List$Empty$const);
      return $render.reset_clock();
    },
  );
}

function apply_drawing_result(model, source, shape_slider, on_ok) {
  let $ = run_source(shape_slider, source);
  if ($ instanceof Ok) {
    let paths = $[0];
    return [
      new Model(
        source,
        model.code_open,
        "",
        shape_slider,
        model.speed,
        model.paused,
        model.drawings,
        model.selected,
      ),
      $effect.batch(
        listPrepend(
          on_ok(paths),
          listPrepend($editor.clear_error(), $List$Empty$const),
        ),
      ),
    ];
  } else {
    let msg = $[0][0];
    let line = $[0][1];
    return [
      new Model(
        source,
        model.code_open,
        msg,
        shape_slider,
        model.speed,
        model.paused,
        model.drawings,
        model.selected,
      ),
      $effect.batch(
        listPrepend(
          clear_drawing(),
          listPrepend(
            (() => {
              if (line instanceof Some) {
                let n = line[0];
                return $editor.set_error(n, msg);
              } else {
                return $editor.clear_error();
              }
            })(),
            $List$Empty$const,
          ),
        ),
      ),
    ];
  }
}

function save_model_library(model) {
  return $data.save_library(new $data.Library(model.selected, model.drawings));
}

function upsert_source(drawings, name, source) {
  return $list.map(
    drawings,
    (drawing) => {
      let $ = drawing[0] === name;
      if ($) {
        return [name, source];
      } else {
        return drawing;
      }
    },
  );
}

function open_drawing(model, drawings, name, source) {
  let model$1 = new Model(
    source,
    model.code_open,
    model.output,
    model.shape_slider,
    model.speed,
    model.paused,
    drawings,
    name,
  );
  save_model_library(model$1);
  return [
    model$1,
    $effect.batch(
      listPrepend(
        $editor.mount(source, (var0) => { return new SetCode(var0); }),
        listPrepend(
          $effect.from((dispatch) => { return dispatch(new SetCode(source)); }),
          $List$Empty$const,
        ),
      ),
    ),
  ];
}

function reset_clock() {
  return $effect.from((_) => { return $render.reset_clock(); });
}

function set_speed(rate) {
  return $effect.from((_) => { return $render.set_speed(rate); });
}

/**
 * Push paths to the canvas without touching the clock or speed.
 * 
 * @ignore
 */
function push_drawing(paths) {
  return $effect.from(
    (_) => {
      let rendered = $list.map(
        paths,
        (path) => { return $render.render_path(path, path_color); },
      );
      return $render.set_drawing(rendered);
    },
  );
}

/**
 * Parse a range-input value as a Float. HTML often yields integers like "2"
 * or "-2" at the ends; Gleam's float.parse only accepts a decimal point, so
 * fall back to int.parse for those.
 * 
 * @ignore
 */
function parse_speed(raw) {
  let $ = $float.parse(raw);
  if ($ instanceof Ok) {
    return $;
  } else {
    let $1 = $int.parse(raw);
    if ($1 instanceof Ok) {
      let n = $1[0];
      return new Ok($int.to_float(n));
    } else {
      return new Error(undefined);
    }
  }
}

export function update(model, msg) {
  if (msg instanceof SetCode) {
    let text = msg[0];
    let drawings = upsert_source(model.drawings, model.selected, text);
    let model$1 = new Model(
      model.source,
      model.code_open,
      model.output,
      model.shape_slider,
      model.speed,
      model.paused,
      drawings,
      model.selected,
    );
    save_model_library(model$1);
    return apply_drawing_result(
      model$1,
      text,
      model$1.shape_slider,
      (paths) => {
        return $effect.batch(
          listPrepend(
            push_drawing(paths),
            listPrepend(reset_clock(), $List$Empty$const),
          ),
        );
      },
    );
  } else if (msg instanceof SetShapeSlider) {
    let raw = msg[0];
    let _block;
    let _pipe = $int.parse(raw);
    _block = $result.unwrap(_pipe, model.shape_slider);
    let shape = _block;
    return apply_drawing_result(model, model.source, shape, push_drawing);
  } else if (msg instanceof SetSpeed) {
    let raw = msg[0];
    let _block;
    let _pipe = parse_speed(raw);
    _block = $result.unwrap(_pipe, model.speed);
    let speed = _block;
    let model$1 = new Model(
      model.source,
      model.code_open,
      model.output,
      model.shape_slider,
      speed,
      model.paused,
      model.drawings,
      model.selected,
    );
    let $ = model$1.paused;
    if ($) {
      return [model$1, $effect.none()];
    } else {
      return [model$1, set_speed(speed)];
    }
  } else if (msg instanceof TogglePause) {
    let $ = model.paused;
    if ($) {
      return [
        new Model(
          model.source,
          model.code_open,
          model.output,
          model.shape_slider,
          model.speed,
          false,
          model.drawings,
          model.selected,
        ),
        set_speed(model.speed),
      ];
    } else {
      return [
        new Model(
          model.source,
          model.code_open,
          model.output,
          model.shape_slider,
          model.speed,
          true,
          model.drawings,
          model.selected,
        ),
        set_speed(0.0),
      ];
    }
  } else if (msg instanceof ResetSliders) {
    let model$1 = new Model(
      model.source,
      model.code_open,
      model.output,
      default_shape_slider,
      default_speed,
      false,
      model.drawings,
      model.selected,
    );
    let $ = apply_drawing_result(
      model$1,
      model$1.source,
      default_shape_slider,
      push_drawing,
    );
    let model$2 = $[0];
    let draw_effect = $[1];
    return [
      model$2,
      $effect.batch(
        listPrepend(
          draw_effect,
          listPrepend(set_speed(default_speed), $List$Empty$const),
        ),
      ),
    ];
  } else if (msg instanceof RestartAnimation) {
    return [model, reset_clock()];
  } else if (msg instanceof SelectDrawing) {
    let name = msg[0];
    if (name === "") {
      return [
        model,
        $effect.from(
          (dispatch) => {
            let $ = $data.prompt_drawing_name();
            if ($ === "") {
              return dispatch(Msg$CancelNewDrawing$const);
            } else {
              let new_name = $;
              return dispatch(new ConfirmNewDrawing(new_name));
            }
          },
        ),
      ];
    } else {
      let n = name;
      if (n === model.selected) {
        return [model, $effect.none()];
      } else {
        let n$1 = name;
        let drawings = upsert_source(
          model.drawings,
          model.selected,
          model.source,
        );
        let $ = find_source(drawings, n$1);
        if ($ instanceof Ok) {
          let source = $[0];
          return open_drawing(model, drawings, n$1, source);
        } else {
          let model$1 = new Model(
            model.source,
            model.code_open,
            model.output,
            model.shape_slider,
            model.speed,
            model.paused,
            drawings,
            model.selected,
          );
          save_model_library(model$1);
          return [model$1, $effect.none()];
        }
      }
    }
  } else if (msg instanceof ConfirmNewDrawing) {
    let name = msg[0];
    if (name === "") {
      return [model, $effect.none()];
    } else {
      let n = name;
      let $ = find_source(model.drawings, n);
      if ($ instanceof Ok) {
        let source = $[0];
        let drawings = upsert_source(
          model.drawings,
          model.selected,
          model.source,
        );
        return open_drawing(model, drawings, n, source);
      } else {
        let _block;
        let _pipe = upsert_source(model.drawings, model.selected, model.source);
        _block = $list.append(
          _pipe,
          listPrepend([n, default_code], $List$Empty$const),
        );
        let drawings = _block;
        return open_drawing(model, drawings, n, default_code);
      }
    }
  } else if (msg instanceof CancelNewDrawing) {
    return [model, $effect.none()];
  } else {
    return [
      new Model(
        model.source,
        !model.code_open,
        model.output,
        model.shape_slider,
        model.speed,
        model.paused,
        model.drawings,
        model.selected,
      ),
      $effect.none(),
    ];
  }
}

function view_controls(model) {
  let _block;
  let $1 = model.paused;
  if ($1) {
    _block = ["Play", "Resume animation"];
  } else {
    _block = ["Pause", "Pause animation"];
  }
  let $ = _block;
  let pause_label = $[0];
  let pause_title = $[1];
  return $html.div(
    listPrepend($attr.class$("controls"), $List$Empty$const),
    listPrepend(
      $html.div(
        listPrepend($attr.class$("control-row"), $List$Empty$const),
        listPrepend(
          $html.button(
            listPrepend(
              $attr.class$("icon-btn"),
              listPrepend(
                $attr.attribute("title", pause_title),
                listPrepend(
                  $event.on_click(Msg$TogglePause$const),
                  $List$Empty$const,
                ),
              ),
            ),
            listPrepend($html.text(pause_label), $List$Empty$const),
          ),
          listPrepend(
            $html.button(
              listPrepend(
                $attr.class$("icon-btn"),
                listPrepend(
                  $attr.attribute("title", "Restart animation from the start"),
                  listPrepend(
                    $event.on_click(Msg$RestartAnimation$const),
                    $List$Empty$const,
                  ),
                ),
              ),
              listPrepend($html.text("Restart"), $List$Empty$const),
            ),
            listPrepend(
              $html.button(
                listPrepend(
                  $attr.class$("icon-btn"),
                  listPrepend(
                    $attr.attribute(
                      "title",
                      "Reset shape and speed to defaults",
                    ),
                    listPrepend(
                      $event.on_click(Msg$ResetSliders$const),
                      $List$Empty$const,
                    ),
                  ),
                ),
                listPrepend($html.text("Reset"), $List$Empty$const),
              ),
              listPrepend(
                $html.label(
                  listPrepend($attr.class$("control"), $List$Empty$const),
                  listPrepend(
                    $html.span(
                      listPrepend(
                        $attr.class$("control-label"),
                        $List$Empty$const,
                      ),
                      listPrepend($html.text("speed"), $List$Empty$const),
                    ),
                    listPrepend(
                      $html.input(
                        listPrepend(
                          $attr.type_("range"),
                          listPrepend(
                            $attr.min("-2"),
                            listPrepend(
                              $attr.max("2"),
                              listPrepend(
                                $attr.step("0.1"),
                                listPrepend(
                                  $attr.value($float.to_string(model.speed)),
                                  listPrepend(
                                    $attr.attribute(
                                      "data-test-id",
                                      "speed-slider",
                                    ),
                                    listPrepend(
                                      $event.on_input(
                                        (var0) => { return new SetSpeed(var0); },
                                      ),
                                      $List$Empty$const,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                      listPrepend(
                        $html.span(
                          listPrepend(
                            $attr.class$("control-value"),
                            $List$Empty$const,
                          ),
                          listPrepend(
                            $html.text(
                              $float.to_string(
                                $float.to_precision(model.speed, 1),
                              ),
                            ),
                            $List$Empty$const,
                          ),
                        ),
                        $List$Empty$const,
                      ),
                    ),
                  ),
                ),
                $List$Empty$const,
              ),
            ),
          ),
        ),
      ),
      listPrepend(
        $html.label(
          listPrepend($attr.class$("control"), $List$Empty$const),
          listPrepend(
            $html.span(
              listPrepend($attr.class$("control-label"), $List$Empty$const),
              listPrepend($html.text("shape"), $List$Empty$const),
            ),
            listPrepend(
              $html.input(
                listPrepend(
                  $attr.type_("range"),
                  listPrepend(
                    $attr.min("0"),
                    listPrepend(
                      $attr.max("100"),
                      listPrepend(
                        $attr.step("1"),
                        listPrepend(
                          $attr.value($int.to_string(model.shape_slider)),
                          listPrepend(
                            $attr.attribute("data-test-id", "shape-slider"),
                            listPrepend(
                              $event.on_input(
                                (var0) => { return new SetShapeSlider(var0); },
                              ),
                              $List$Empty$const,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              listPrepend(
                $html.span(
                  listPrepend($attr.class$("control-value"), $List$Empty$const),
                  listPrepend(
                    $html.text($int.to_string(model.shape_slider)),
                    $List$Empty$const,
                  ),
                ),
                $List$Empty$const,
              ),
            ),
          ),
        ),
        $List$Empty$const,
      ),
    ),
  );
}

function view_reveal_code(model) {
  let $ = model.code_open;
  if ($) {
    return $element.none();
  } else {
    return $html.button(
      listPrepend(
        $attr.class$("icon-btn reveal-code"),
        listPrepend(
          $attr.attribute("title", "Show code"),
          listPrepend($event.on_click(Msg$ToggleCode$const), $List$Empty$const),
        ),
      ),
      listPrepend($html.text("⟩"), $List$Empty$const),
    );
  }
}

function view_anim(model) {
  return $html.div(
    listPrepend($attr.class$("canvas-area"), $List$Empty$const),
    listPrepend(
      view_reveal_code(model),
      listPrepend(
        view_controls(model),
        listPrepend(
          $html.canvas(
            listPrepend(
              $attr.id("animation-canvas"),
              listPrepend($attr.class$("canvas"), $List$Empty$const),
            ),
          ),
          listPrepend(
            (() => {
              let $ = model.output;
              if ($ === "") {
                return $element.none();
              } else {
                return $html.pre(
                  listPrepend($attr.class$("output"), $List$Empty$const),
                  listPrepend($html.text(model.output), $List$Empty$const),
                );
              }
            })(),
            $List$Empty$const,
          ),
        ),
      ),
    ),
  );
}

/**
 * Drawing library menu for the code-panel header (next to "draw code").
 * Mark the open drawing with option `selected`. Setting `value` on <select>
 * alone is applied before the options exist, so the browser keeps the first
 * option (usually "fan") after a reload even when localStorage is correct.
 * 
 * @ignore
 */
function view_drawing_select(model) {
  let _block;
  let _pipe = $list.map(
    model.drawings,
    (drawing) => {
      return $html.option(
        listPrepend(
          $attr.value(drawing[0]),
          listPrepend(
            $attr.selected(drawing[0] === model.selected),
            $List$Empty$const,
          ),
        ),
        drawing[0],
      );
    },
  );
  _block = $list.append(
    _pipe,
    listPrepend(
      $html.option(
        listPrepend(
          $attr.value(new_drawing_option),
          listPrepend($attr.selected(false), $List$Empty$const),
        ),
        "New drawing…",
      ),
      $List$Empty$const,
    ),
  );
  let drawing_options = _block;
  return $html.select(
    listPrepend(
      $attr.attribute("data-test-id", "drawing-select"),
      listPrepend(
        $attr.class$("drawing-select"),
        listPrepend(
          $attr.value(model.selected),
          listPrepend(
            $attr.attribute("title", "Choose a drawing"),
            listPrepend(
              $event.on_change((var0) => { return new SelectDrawing(var0); }),
              $List$Empty$const,
            ),
          ),
        ),
      ),
    ),
    drawing_options,
  );
}

export function view(model) {
  let _block;
  let $ = model.code_open;
  if ($) {
    _block = "app";
  } else {
    _block = "app code-hidden";
  }
  let app_class = _block;
  return $html.div(
    listPrepend($attr.class$(app_class), $List$Empty$const),
    listPrepend(
      $html.div(
        listPrepend($attr.class$("code-col"), $List$Empty$const),
        listPrepend(
          $editor.view_panel(Msg$ToggleCode$const, view_drawing_select(model)),
          $List$Empty$const,
        ),
      ),
      listPrepend(view_anim(model), $List$Empty$const),
    ),
  );
}

export function main() {
  let app = $lustre.application(init, update, view);
  let $ = $lustre.start(app, "#app", undefined);
  if (!($ instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "app",
      510,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 15910,
        end: 15959,
        pattern_start: 15921,
        pattern_end: 15926
      }
    )
  }
  return undefined;
}
