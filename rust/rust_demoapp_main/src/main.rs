use dotenv::dotenv;
use axum::{
    Router,
    routing::get,
    http::StatusCode,
    http::Response,
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
                .route("/", get("Hello World!"))
                // return http 500 for the path /bad 
                .route("/bad", get(|| async { axum::response::Reply::into_response(Response::new(axum::http::StatusCode::INTERNAL_SERVER_ERROR)).await }))
                .route("/good", get(Response::new(axum::http::StatusCode::OK)));

            axum::Server::bind(&addr)
                .serve(app.into_make_service())
                .await?;

            Ok::<(), anyhow::Error>(())
        })?;

    std::process::exit(0);
}

