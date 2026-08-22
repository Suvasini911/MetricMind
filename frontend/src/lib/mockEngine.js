const responses = {
  "Why did European margins drop in Q3?": {
    title: "European margin analysis",
    summary:
      "European margin declined primarily because total operating costs increased faster than revenue.",
    metrics: [
      { label: "Revenue", value: "$4.18M" },
      { label: "Profit", value: "$0.91M" },
      { label: "Margin", value: "21.8%" },
    ],
    drivers: [
      "Material cost increased the most",
      "Shipping cost was the second-largest contributor",
      "Marketing cost remained relatively stable",
    ],
  },

  "What was Q3 revenue?": {
    title: "Q3 revenue",
    summary:
      "Q3 revenue is available through the governed Revenue metric and Quarter dimension.",
    metrics: [
      { label: "Metric", value: "Revenue" },
      { label: "Period", value: "Q3" },
      { label: "Aggregation", value: "SUM" },
    ],
    drivers: [
      "Metric: Revenue",
      "Dimension: Quarter",
      "Aggregation: SUM(revenue)",
    ],
  },

  "Show European sales": {
    title: "European sales",
    summary:
      "The query is interpreted as Revenue filtered by the Europe region.",
    metrics: [
      { label: "Metric", value: "Revenue" },
      { label: "Region", value: "Europe" },
      { label: "Status", value: "Governed" },
    ],
    drivers: [
      "Metric: Revenue",
      "Dimension: Region",
      "Filter: Europe",
    ],
  },

  "Which region has the highest margin?": {
    title: "Regional margin comparison",
    summary:
      "MetricMind compares the governed Margin metric across geographic regions.",
    metrics: [
      { label: "Metric", value: "Margin" },
      { label: "Dimension", value: "Region" },
      { label: "Mode", value: "Comparison" },
    ],
    drivers: [
      "Metric: Margin",
      "Dimension: Region",
      "Aggregation: Profit / Revenue",
    ],
  },
};


export async function analyzeQuestion(question) {

  await new Promise((resolve) =>
    setTimeout(resolve, 900)
  );

  const response = responses[question];

  if (response) {
    return response;
  }

  return {
    title: "Governed analysis",
    summary:
      "MetricMind recognized the question but the current demo engine does not yet have a response for this query.",
    metrics: [
      { label: "Status", value: "Recognized" },
      { label: "Governance", value: "Passed" },
      { label: "Mode", value: "Demo" },
    ],
    drivers: [
      "The question would be mapped to the semantic layer.",
      "A governed metric would be selected.",
      "The production agent will query the warehouse.",
    ],
  };
}