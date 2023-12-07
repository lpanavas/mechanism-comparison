import React from "react";
import "./styles/App.css";
import ComparisonVisual from "./components/ComparisonVisual";

function App() {
  return (
    <div className="App">
      <div className="MainColumn">
        <h1 style={{ textAlign: "center" }}>
          Exploring Differential Privacy: Laplace vs Gaussian
        </h1>
        <p>
          Below we will compare two different algorithms to implement
          differential privacy: Laplace and Gaussian. We will explore when it's
          better to use one over the other through an interactive visualization
          showing the two distributions.
        </p>
        <h2>Epsilon</h2>
        <p>
          Let's first start by looking at what the two distributions look like
          and how they shift. These distributions are for releasing one query
          with a sensitivity of 1, such as "What is the count of people who have
          arthritis?" Since the Laplace distribution is more closely centered
          around the mean, we will always have the Laplace error be smaller than
          the Gaussian error.
        </p>
        <p>
          To find out the error, look at the vertical lines. The further from
          the center of the distribution, the greater the error. This line shows
          the 95% confidence interval. There is a 95% chance that the noise
          addition will be below the value shown.
        </p>
        <p>
          Try it yourself: slide the epsilon slider to explore how the
          distributions change. Look at the errors. Is the Laplace error ever
          larger than the Gaussian? It won’t be because of the tighter bounds.
          What does this mean for your release? If you are releasing just one
          statistic from your dataset, the Laplace mechanism will give better
          accuracy than the Gaussian distribution.
        </p>

        <ComparisonVisual
          initialEpsilon={2}
          showEpsilonSlider={true}
          showKSensitivitySlider={false}
          showConfidenceSlider={false}
        />
        <h2>Sensitivity and Composition</h2>

        <p>
          Now let’s add another parameter that begins to affect our decision on
          whether to choose Laplace or Gaussian. Suppose we are interested in
          releasing more counts than just one. For instance, releasing the
          counts of people who have arthritis and those with other conditions
          such as cancer or scoliosis. Since we are releasing multiple
          statistics that an individual could be part of, the error changes
          because the sensitivity is calculated differently for the two
          mechanisms.
        </p>
        <p>
          When multiple queries are released, the sensitivities are added,
          resulting in more noise. Remember that, simply put,{" "}
          <i>Error = Sensitivity / Epsilon</i>.
        </p>
        <p>
          This difference in error is because we are either adding the queries
          together through basic composition for Laplace or advanced composition
          for Gaussian.
        </p>
        <p>
          Consider a person visiting a hospital where there are 100 possible
          diseases. The hospital wants to release the counts for all 100
          diseases. This individual could potentially be diagnosed with all 100
          diseases.
        </p>
        <p>
          <b>L1 Sensitivity (Cumulative Impact):</b>
          <br />
          The maximum number of diseases a person could have is 100, so the L1
          sensitivity is: <br />
          <i>
            Δ<sub>L1</sub> = 100
          </i>
        </p>
        <p>
          <b>L2 Sensitivity (Magnitude of Change):</b>
          <br />
          When considering the vector magnitude of the change for a person
          having all 100 diseases:
          <br />
          <i>
            Δ<sub>L2</sub> = √(1² + 1² + ... + 1²) = √100 = 10
          </i>
        </p>

        <p>Let’s explore this through the visualization.</p>
        <p>
          Try it yourself: Keep epsilon the same and adjust the query release
          slider. Notice as you increase the number of queries released, the
          Gaussian error becomes less than the Laplace error and therefore
          becomes the better choice. If you are going to release many queries
          from the same dataset, consider using Gaussian as it will likely
          provide better accuracy.
        </p>

        <ComparisonVisual
          initialEpsilon={2}
          initialK={7}
          showEpsilonSlider={false}
          showKSensitivitySlider={true}
          showConfidenceSlider={false}
        />
        <h2>Confidence</h2>

        <p>
          Another choice affecting which algorithm you should choose is the
          confidence of the error bound. The Laplace distribution and the
          Gaussian distribution differ in how their tails behave. The confidence
          level represents the probability that the error (or noise added to the
          data) remains within a certain bound. A higher confidence level means
          you want to be more certain that the error does not exceed a specific
          threshold. This is important, for instance, if you are releasing many
          statistics, such as the Census, and may not have the chance to check
          every single one.
        </p>
        <p>
          The Laplace distribution decreases exponentially as you move away from
          the mean. This characteristic leads to a thinner tail, implying that
          the probability of extreme values decreases rapidly. As a result, for
          a given error bound, the Laplace distribution can achieve higher
          confidence levels with smaller bounds compared to the Gaussian
          distribution at lower confidence levels.
        </p>
        <p>
          However, as the confidence level increases (approaching 100%), the
          thin tails of the Laplace distribution become a limiting factor. The
          Laplace distribution requires a relatively larger increase in the
          error bound to encompass more of the tail area and increase the
          confidence level.
        </p>
        <p>
          On the other hand, the Gaussian distribution has thicker tails.
          Initially, at lower confidence levels, the Gaussian distribution
          requires a larger error bound than the Laplace distribution to achieve
          the same confidence level. But as the confidence level increases, the
          thicker tails of the Gaussian distribution mean that a smaller
          proportional increase in the error bound is needed to capture more of
          the tail area.
        </p>
        <p>
          Try it yourself: Take a look at the two distributions. Align the two
          vertical lines so they are close together. Now adjust the confidence
          level. As you increase the confidence, the error of the Gaussian will
          increase more gradually than the Laplace error.
        </p>

        <ComparisonVisual
          initialEpsilon={2}
          initialK={8}
          initialConfidenceLevel={0.8}
          showEpsilonSlider={false}
          showKSensitivitySlider={false}
          showConfidenceSlider={true}
        />

        <p>
          Now that you have a basic understanding of all these parameters, play
          around with them and adjust them to see how they affect the accuracy
          of your queries.
        </p>

        <ComparisonVisual
          initialEpsilon={2}
          showEpsilonSlider={true}
          showKSensitivitySlider={true}
          showConfidenceSlider={true}
        />
      </div>
    </div>
  );
}

export default App;
