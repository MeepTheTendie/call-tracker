#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    image::Image,
    Manager,
};

#[tauri::command]
fn close_window(window: tauri::Window) {
    window.hide().ok();
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();
            tauri::global_shortcut::Manager::new(handle)
                .register("Cmd+Shift+C", move || {
                    if let Some(window) = app.get_webview_window("main") {
                        window.show().ok();
                        window.set_focus().ok();
                        window.emit("log-call", ()).ok();
                    }
                })
                .map_err(|e| println!("Failed to register shortcut: {:?}", e))?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![close_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
