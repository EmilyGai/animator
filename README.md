# animator

Q9


path animation:  
files - app.gleam + render.gleam. view_anim-adds an animation canvas. canvas_id checks that the canvas is the animation canvas before the app starts  
!! When run_source evaluates draw() and gets Ok(paths), run animate drawing(paths) which resets the clock.  
-> turns path into RenderPath and ges AnimationFrames  
-> canvas.mjs has global clock, set_drawings replaces the path list/what is drawn but doesn't change clock  
->(useful bc shape slider sees new shape immediately and not restart - for later parts)  
->Frames are drawn w/canvas.mjs not Gleam code (render() finds animation canvas) - gleam only gives path lists


error:  
SetCode runs run_source that has error string calling editor.set_error to underline line if known. model.output shows red banner. Underline is from CodeMirror decorations in editor_ffi.mjs  
If success, then animate_drawing & editor.clear_error()


Q10


sliders:  
shape slider (data-test-id="shape-slider"): 0-100, passed to draw as shape_slider; set_drawing without reset_clock so finished drawings stay complete  
speed slider (data-test-id="speed-slider"): -2 to 2, calls render.set_speed; negative plays backward  
controls:  
Pause: set_speed(0.0) freezes the clock; click again (Play) resumes at the slider rate  
Restart: render.reset_clock() replays the current drawing without changing code  
Reset: shape back to 10, speed back to 1.0, unpause, re-run draw and apply default speed  
