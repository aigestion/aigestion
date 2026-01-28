use clap::Parser;
use ignore::WalkBuilder;
use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    #[arg(short, long)]
    root: PathBuf,

    #[arg(short, long)]
    query: String,

    #[arg(short, long, default_value_t = 10)]
    limit: usize,
}

#[derive(Serialize, Deserialize, Debug)]
struct FileResult {
    path: String,
    content: String,
    score: f32,
}

fn main() {
    let args = Args::parse();
    let root = args.root;
    let query = args.query.to_lowercase();
    let query_terms: Vec<&str> = query.split_whitespace().filter(|s| s.len() > 2).collect();

    // 1. Walk and find files
    let walker = WalkBuilder::new(&root)
        .hidden(false)
        .git_ignore(true)
        .build();

    let file_paths: Vec<PathBuf> = walker
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().map(|ft| ft.is_file()).unwrap_or(false))
        .map(|e| e.path().to_path_buf())
        .collect();

    // 2. Parallel processing and ranking
    let mut results: Vec<FileResult> = file_paths
        .par_iter()
        .filter_map(|path| {
            let rel_path = path.strip_prefix(&root).ok()?.to_string_lossy().to_string();

            // Ignore non-text files (simple check)
            let ext = path.extension()?.to_str()?;
            let ignored_exts = vec!["png", "jpg", "jpeg", "gif", "ico", "pdf", "zip", "exe", "dll", "lock"];
            if ignored_exts.contains(&ext) {
                return None;
            }

            let content = fs::read_to_string(path).ok()?;
            let content_lower = content.to_lowercase();
            let mut score = 0.0;

            for term in &query_terms {
                if rel_path.to_lowercase().contains(term) {
                    score += 10.0;
                }
                let count = content_lower.matches(term).count();
                if count > 0 {
                    score += (count as f32).ln_1p();
                }
            }

            if score > 0.0 {
                Some(FileResult {
                    path: rel_path,
                    content,
                    score,
                })
            } else {
                None
            }
        })
        .collect();

    // 3. Sort and Limit
    results.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap());
    results.truncate(args.limit);

    // 4. Output JSON
    println!("{}", serde_json::to_string(&results).unwrap());
}
