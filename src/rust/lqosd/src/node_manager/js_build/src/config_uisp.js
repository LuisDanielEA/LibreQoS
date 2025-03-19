import {saveConfig, loadConfig} from "./config/config_helper";

function validateConfig() {
    // Validate required fields when enabled
    if (document.getElementById("enableUisp").checked) {
        const token = document.getElementById("uispToken").value.trim();
        if (!token) {
            alert("API Token is required when UISP integration is enabled");
            return false;
        }

        const url = document.getElementById("uispUrl").value.trim();
        if (!url) {
            alert("UISP URL is required when UISP integration is enabled");
            return false;
        }
        try {
            new URL(url);
        } catch {
            alert("UISP URL must be a valid URL");
            return false;
        }

        const site = document.getElementById("uispSite").value.trim();
        if (!site) {
            alert("UISP Site is required when UISP integration is enabled");
            return false;
        }

        const strategy = document.getElementById("uispStrategy").value.trim();
        if (!strategy) {
            alert("Strategy is required when UISP integration is enabled");
            return false;
        }

        const suspendedStrategy = document.getElementById("uispSuspendedStrategy").value.trim();
        if (!suspendedStrategy) {
            alert("Suspended Strategy is required when UISP integration is enabled");
            return false;
        }

        // Validate numeric fields
        const airmaxCapacity = parseFloat(document.getElementById("uispAirmaxCapacity").value);
        if (isNaN(airmaxCapacity) || airmaxCapacity < 0) {
            alert("Airmax Capacity must be a number greater than or equal to 0");
            return false;
        }

        const ltuCapacity = parseFloat(document.getElementById("uispLtuCapacity").value);
        if (isNaN(ltuCapacity) || ltuCapacity < 0) {
            alert("LTU Capacity must be a number greater than or equal to 0");
            return false;
        }

        const bandwidthOverhead = parseFloat(document.getElementById("uispBandwidthOverhead").value);
        if (isNaN(bandwidthOverhead) || bandwidthOverhead <= 0) {
            alert("Bandwidth Overhead Factor must be a number greater than 0");
            return false;
        }

        const commitMultiplier = parseFloat(document.getElementById("uispCommitMultiplier").value);
        if (isNaN(commitMultiplier) || commitMultiplier <= 0) {
            alert("Commit Bandwidth Multiplier must be a number greater than 0");
            return false;
        }
    }
    return true;
}

function updateConfig() {
    // Update only the uisp_integration section
    window.config.uisp_integration = {
        enable_uisp: document.getElementById("enableUisp").checked,
        token: document.getElementById("uispToken").value.trim(),
        url: document.getElementById("uispUrl").value.trim(),
        site: document.getElementById("uispSite").value.trim(),
        strategy: document.getElementById("uispStrategy").value.trim(),
        suspended_strategy: document.getElementById("uispSuspendedStrategy").value.trim(),
        airmax_capacity: parseFloat(document.getElementById("uispAirmaxCapacity").value),
        ltu_capacity: parseFloat(document.getElementById("uispLtuCapacity").value),
        ipv6_with_mikrotik: document.getElementById("uispIpv6WithMikrotik").checked,
        bandwidth_overhead_factor: parseFloat(document.getElementById("uispBandwidthOverhead").value),
        commit_bandwidth_multiplier: parseFloat(document.getElementById("uispCommitMultiplier").value),
        use_ptmp_as_parent: document.getElementById("uispUsePtmpAsParent").checked,
        ignore_calculated_capacity: document.getElementById("uispIgnoreCalculatedCapacity").checked,
        // Default values for fields not in the form
        exclude_sites: [],
        squash_sites: null,
        exception_cpes: []
    };
}

loadConfig(() => {
    // window.config now contains the configuration.
    // Populate form fields with config values
    if (window.config && window.config.uisp_integration) {
        const uisp = window.config.uisp_integration;
        
        // Boolean fields
        document.getElementById("enableUisp").checked = uisp.enable_uisp ?? false;
        document.getElementById("uispIpv6WithMikrotik").checked = uisp.ipv6_with_mikrotik ?? false;
        document.getElementById("uispUsePtmpAsParent").checked = uisp.use_ptmp_as_parent ?? false;
        document.getElementById("uispIgnoreCalculatedCapacity").checked = uisp.ignore_calculated_capacity ?? false;

        // String fields
        document.getElementById("uispToken").value = uisp.token ?? "";
        document.getElementById("uispUrl").value = uisp.url ?? "";
        document.getElementById("uispSite").value = uisp.site ?? "";
        document.getElementById("uispStrategy").value = uisp.strategy ?? "";
        document.getElementById("uispSuspendedStrategy").value = uisp.suspended_strategy ?? "";

        // Numeric fields
        document.getElementById("uispAirmaxCapacity").value = uisp.airmax_capacity ?? 0.0;
        document.getElementById("uispLtuCapacity").value = uisp.ltu_capacity ?? 0.0;
        document.getElementById("uispBandwidthOverhead").value = uisp.bandwidth_overhead_factor ?? 1.0;
        document.getElementById("uispCommitMultiplier").value = uisp.commit_bandwidth_multiplier ?? 1.0;

        // Add save button click handler
        document.getElementById('saveButton').addEventListener('click', () => {
            if (validateConfig()) {
                updateConfig();
                saveConfig(() => {
                    alert("Configuration saved successfully!");
                });
            }
        });
    } else {
        console.error("UISP integration configuration not found in window.config");
    }
});
