use std::process::Command;
fn main() {
    // Adds a git commit hash to the program
    let output = Command::new("git").args(["rev-parse", "HEAD"]).output().unwrap();
    let git_hash = String::from_utf8(output.stdout).unwrap();
    println!("cargo:rustc-env=GIT_HASH={}", git_hash);

    // Builds the gRPC layer
    tonic_build::compile_protos("protobuf/lts2_server.proto").unwrap();
}