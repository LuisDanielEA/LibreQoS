import {ThroughputBpsDash} from "./throughput_bps_dash";
import {ThroughputPpsDash} from "./throughput_pps_dash";
import {ShapedUnshapedDash} from "./shaped_unshaped_dash";
import {TrackedFlowsCount} from "./tracked_flow_count_dash";
import {ThroughputRingDash} from "./throughput_ring_dash";
import {RttHistoDash} from "./rtt_histo_dash";

export const DashletMenu = [
    { name: "Throughput Bits/Second", tag: "throughputBps", size: 3 },
    { name: "Throughput Packets/Second", tag: "throughputPps", size: 3 },
    { name: "Shaped/Unshaped Pie", tag: "shapedUnshaped", size: 3 },
    { name: "Tracked Flows Counter", tag: "trackedFlowsCount", size: 3 },
    { name: "Last 5 Minutes Throughput", tag: "throughputRing", size: 6 },
    { name: "Round-Trip Time Histogram", tag: "rttHistogram", size: 6 },
];

export function widgetFactory(widgetName, count) {
    let widget = null;
    switch (widgetName) {
        case "throughputBps":   widget = new ThroughputBpsDash(count); break;
        case "throughputPps":   widget = new ThroughputPpsDash(count); break;
        case "shapedUnshaped":  widget = new ShapedUnshapedDash(count); break;
        case "trackedFlowsCount": widget = new TrackedFlowsCount(count); break;
        case "throughputRing":  widget = new ThroughputRingDash(count); break;
        case "rttHistogram":    widget = new RttHistoDash(count); break;
        default: {
            console.log("I don't know how to construct a widget of type [" + widgetName + "]");
            return null;
        }
    }
    return widget;
}