use std::collections::HashMap;
use std::sync::Mutex;
use once_cell::sync::Lazy;
use lqos_utils::units::DownUpOrder;
use crate::tracking::TrackedQueue;

pub static ALL_QUEUE_SUMMARY: Lazy<AllQueueData> = Lazy::new(|| AllQueueData::new());

#[derive(Debug)]

pub struct QueueData {
    pub drops: DownUpOrder<u32>,
    pub marks: DownUpOrder<u32>,
    pub prev_drops: DownUpOrder<u32>,
    pub prev_marks: DownUpOrder<u32>,
}

#[derive(Debug)]
pub struct AllQueueData {
    data: Mutex<HashMap<String, QueueData>>
}

impl AllQueueData {
    pub fn new() -> Self {
        Self { data: Mutex::new(HashMap::new()) }
    }

    pub fn clear(&self) {
        let mut lock = self.data.lock().unwrap();
        lock.clear();
    }

    pub fn ingest_batch(&self, download: Vec<TrackedQueue>, upload: Vec<TrackedQueue>) {
        let mut lock = self.data.lock().unwrap();

        // Roll through moving current to previous
        for (_,q) in lock.iter_mut() {
            q.prev_drops = q.drops;
            q.prev_marks = q.marks;
            q.drops = DownUpOrder::zeroed();
            q.marks = DownUpOrder::zeroed();
        }

        // Make download markings
        for dl in download.into_iter() {
            if let Some(q) = lock.get_mut(&dl.circuit_id) {
                // We need to update it
                q.drops.down = dl.drops;
                q.marks.down = dl.marks;
            } else {
                // We need to add it
                let mut new_record = QueueData {
                    drops: Default::default(),
                    marks: Default::default(),
                    prev_drops: Default::default(),
                    prev_marks: Default::default(),
                };
                new_record.drops.down = dl.drops;
                new_record.marks.down = dl.marks;
                lock.insert(dl.circuit_id.clone(), new_record);
            }
        }

        // Make upload markings
        for ul in upload.into_iter() {
            if let Some(q) = lock.get_mut(&ul.circuit_id) {
                // We need to update it
                q.drops.up = ul.drops;
                q.marks.up = ul.marks;
            } else {
                // We need to add it
                let mut new_record = QueueData {
                    drops: Default::default(),
                    marks: Default::default(),
                    prev_drops: Default::default(),
                    prev_marks: Default::default(),
                };
                new_record.drops.up = ul.drops;
                new_record.marks.up = ul.marks;
                lock.insert(ul.circuit_id.clone(), new_record);
            }
        }

        println!("{:?}", lock);
    }
}