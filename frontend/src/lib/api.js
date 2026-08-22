export async function analyzeQuestion(question) {

  try {

    const response = await fetch(
      `http://127.0.0.1:8000/api/query?question=${encodeURIComponent(question)}`
    );

    if (!response.ok) {
      throw new Error("MetricMind API request failed");
    }

    const data = await response.json();

    if (data.status === "verified") {

      return {
        title: `${data.metric} analysis`,

        summary:
          `${data.metric} for ${data.filter} is ${formatValue(data.value)}.`,

        metrics: [
          {
            label: "Metric",
            value: data.metric,
          },
          {
            label: data.dimension,
            value: data.filter,
          },
          {
            label: "Value",
            value: formatValue(data.value),
          },
        ],

        drivers: [
          `Metric: ${data.metric}`,
          `Dimension: ${data.dimension}`,
          `Filter: ${data.filter}`,
          "Result retrieved from the MetricMind warehouse",
        ],
      };
    }

    return {
      title: "Governed analysis",

      summary:
        data.message ||
        "MetricMind could not complete this analysis.",

      metrics: [
        {
          label: "Status",
          value: "Recognized",
        },
        {
          label: "Governance",
          value: "Passed",
        },
        {
          label: "Mode",
          value: "Warehouse",
        },
      ],

      drivers: [
        "Natural-language question received",
        "Semantic validation completed",
        "Query is not implemented yet",
      ],
    };

  } catch (error) {

    console.error(error);

    return {
      title: "Connection error",

      summary:
        "MetricMind could not reach the analytics backend.",

      metrics: [
        {
          label: "Backend",
          value: "Unavailable",
        },
        {
          label: "Warehouse",
          value: "Unknown",
        },
        {
          label: "Status",
          value: "Error",
        },
      ],

      drivers: [
        "Check that FastAPI is running",
        "Check http://127.0.0.1:8000",
        "Retry the analysis",
      ],
    };
  }
}


function formatValue(value) {

  if (typeof value !== "number") {
    return String(value);
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }
  ).format(value);
}