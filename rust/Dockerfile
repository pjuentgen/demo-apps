FROM rust:1.78 as build


RUN USER=root cargo

WORKDIR /app


COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml
COPY ./rust_demoapp_main/src ./rust_demoapp_main/src
COPY ./rust_demoapp_main/Cargo.toml ./rust_demoapp_main/Cargo.toml

RUN cargo build --release


FROM rust:1.78


COPY --from=build /app/target/release/rust-demoapp .

EXPOSE 8080
CMD ["./rust-demoapp"]