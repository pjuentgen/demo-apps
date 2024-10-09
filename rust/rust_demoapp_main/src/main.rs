use dotenv::dotenv;
use axum::{
    Router,
    routing::get,
};
use std::net::{IpAddr, Ipv4Addr, SocketAddr};

pub fn main() -> anyhow::Result<()> {
    dotenv().ok();
    let _ = start_tokio(8080);
    Ok(())
}


fn start_tokio(port: u16) -> anyhow::Result<()> {
    tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .unwrap()
        .block_on(async move {
            let addr = SocketAddr::new(IpAddr::V4(Ipv4Addr::new(0, 0, 0, 0)), port);            

            let app = Router::new()
                .route("/", get(|| async { axum::response::IntoResponse::into_response((axum::http::StatusCode::OK, format!("Hello World!"))) }))
                .route("/bad", get(|| async { axum::response::IntoResponse::into_response((axum::http::StatusCode::INTERNAL_SERVER_ERROR, format!("Error occured"))) }))
                .route("/readiness", get(|| async { axum::response::IntoResponse::into_response((axum::http::StatusCode::OK, format!("Ready"))) }))
                .route("/live", get(|| async { axum::response::IntoResponse::into_response((axum::http::StatusCode::OK, format!("Live"))) }))
                .route("/healthy", get(|| async { axum::response::IntoResponse::into_response((axum::http::StatusCode::OK, format!("Hello World!"))) }));

            axum::Server::bind(&addr)
                .serve(app.into_make_service())
                .await?;

            Ok::<(), anyhow::Error>(())
        })?;

    std::process::exit(0);
}

