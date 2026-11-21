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


sliders are in canvas part of animator.css  
shape_slider - reruns draw and calls set_drawing without reset_clock, dragging keeps clock time  
speed - calls render.set_speed  
->moving the speed slider while paused updates stored rate but only executes when press play  
