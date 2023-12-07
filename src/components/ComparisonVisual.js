import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "../styles/comparison.css";

const ComparisonVisual = ({
  initialEpsilon,
  initialK,
  initialConfidence,
  showEpsilonSlider,
  showKSensitivitySlider,
  showConfidenceSlider,
}) => {
  const [epsilon, setEpsilon] = useState(initialEpsilon || 2);
  const [k, setK] = useState(initialK || 1);
  const [confidenceLevel, setConfidenceLevel] = useState(
    initialConfidence || 0.95
  );

  const svgRef = useRef(null);
  const delta = 0.000001;
  const sensitivity_L1 = k;
  const sensitivity_L2 = Math.sqrt(k);
  const sigma =
    (sensitivity_L2 * Math.sqrt(2 * Math.log(1.25 / delta))) / epsilon;
  const b = sensitivity_L1 / epsilon;
  const laplaceError = b * Math.log(2 / (1 - confidenceLevel));
  const zScore = d3.quantile(
    d3.range(0, 1, 0.0001).map(d3.randomNormal()),
    (1 + confidenceLevel) / 2
  );
  const gaussianError = zScore * sigma;

  let betterAlgorithm = "Laplace";
  if (gaussianError < laplaceError) {
    betterAlgorithm = "Gaussian";
  }

  useEffect(() => {
    const delta = 0.000001;
    const x = d3.range(-30, 30, 0.06);
    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    const width = 800; // or svgRef.current.clientWidth;
    const height = 400; // or svgRef.current.clientHeight;

    // Scales
    const xScale = d3.scaleLinear().domain([-30, 30]).range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 0.5]) // Adjust domain based on your data
      .range([height - 20, 0]);

    // Axis
    const xAxis = d3.axisBottom(xScale).ticks(10);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - 20})`)
      .call(xAxis);

    // Statistical calculations
    const sensitivity_L1 = k;
    const sensitivity_L2 = Math.sqrt(k);

    const sigma =
      (sensitivity_L2 * Math.sqrt(2 * Math.log(1.25 / delta))) / epsilon;
    const b = sensitivity_L1 / epsilon;

    const laplaceBound = b * Math.log(2 / (1 - confidenceLevel));
    const zScore = d3.quantile(
      d3.range(0, 1, 0.0001).map(d3.randomNormal()),
      (1 + confidenceLevel) / 2
    );
    const gaussianBound = zScore * sigma;

    // Distributions
    const laplacePdf = x.map((xVal) => ({
      x: xVal,
      y: (1 / (2 * b)) * Math.exp(-Math.abs(xVal) / b),
    }));
    const gaussianPdf = x.map((xVal) => ({
      x: xVal,
      y:
        (1 / (sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-Math.pow(xVal, 2) / (2 * sigma * sigma)),
    }));

    // Plotting distributions
    const line = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    svg
      .append("path")
      .datum(laplacePdf)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 1.5)
      .attr("d", line);
    svg
      .append("path")
      .datum(gaussianPdf)
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    // Error bounds lines
    const drawErrorLine = (bound, color) => {
      svg
        .append("line")
        .attr("x1", xScale(bound))
        .attr("y1", yScale(0))
        .attr("x2", xScale(bound))
        .attr("y2", yScale(0.5)) // Adjust the y2 value as needed
        .attr("stroke", color)
        .attr("stroke-dasharray", "5,5");
    };

    drawErrorLine(laplaceBound, "blue");
    drawErrorLine(gaussianBound, "orange");
    svg
      .append("text")
      .attr("x", 20)
      .attr("y", 20)
      .text("Laplace - Blue")
      .style("fill", "blue");

    svg
      .append("text")
      .attr("x", 20)
      .attr("y", 40)
      .text("Gaussian - Orange")
      .style("fill", "orange");
  }, [epsilon, k, confidenceLevel, laplaceError, gaussianError]);

  return (
    <div className="comparison-visual" style={{ textAlign: "center" }}>
      {showEpsilonSlider && (
        <label>
          Epsilon: {epsilon}
          <input
            type="range"
            min=".5"
            max="3"
            step="0.1"
            value={epsilon}
            onChange={(e) => setEpsilon(+e.target.value)}
          />
        </label>
      )}
      <br />
      {showKSensitivitySlider && (
        <label>
          Queries: {k}
          <input
            type="range"
            min="1"
            max="15"
            step="1"
            value={k}
            onChange={(e) => setK(+e.target.value)}
          />
        </label>
      )}
      <br />
      {showConfidenceSlider && (
        <label>
          Confidence Level: {confidenceLevel.toFixed(2)}
          <input
            type="range"
            min="0.5"
            max="0.99"
            step="0.01"
            value={confidenceLevel}
            onChange={(e) => setConfidenceLevel(+e.target.value)}
          />
        </label>
      )}
      <br />
      <svg ref={svgRef} width={800} height={400}></svg>
      <div>
        <p>Laplace error: {laplaceError.toFixed(2)}</p>
        <p>Gaussian error: {gaussianError.toFixed(2)}</p>
        <p>
          When releasing {k} dependent queries at an epsilon of {epsilon} and a
          confidence bound of {confidenceLevel.toFixed(2)}, we should choose the{" "}
          <span
            style={{ color: betterAlgorithm === "Laplace" ? "blue" : "orange" }}
          >
            {betterAlgorithm}
          </span>{" "}
          algorithm.
        </p>
      </div>
    </div>
  );
};

export default ComparisonVisual;
