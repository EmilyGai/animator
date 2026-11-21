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



Q11


1. menu of starting examples:  
<select data-test-id="drawing-select"> options from examples.all (name + source)  
init: data.load_library(); if localStorage empty/invalid, use examples.all  
picking a name -> editor.mount(source, SetCode) + SetCode; broken code shows error and set_drawing([])  


2. saving and loading code changes:  
one key animator-library in data.gleam via storage_get/storage_set  
JSON stores selected + drawings; each source is plain typed text  
SetCode upserts current drawing source and save_library; reload keeps same drawing open  


3. adding new drawings:  
"New drawing…" option value must be "" (Gradescope treats any other value as a drawing)  
prompt_drawing_name(); "" means cancel -> CancelNewDrawing re-renders select  
ConfirmNewDrawing appends #(name, default_code), saves, mounts that source  
