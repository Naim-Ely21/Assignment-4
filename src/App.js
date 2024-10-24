import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { wordFrequency: [] };
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  getWordFrequency = (text) => {
    const stopWords = new Set([
      "the", "and", "a", "an", "in", "on", "at", "for", "with", "about", "as", "by", "to", "of", "from", "that", "which",
      "who", "whom", "this", "these", "those", "it", "its", "they", "their", "them", "we", "our", "ours", "you", "your",
      "yours", "he", "him", "his", "she", "her", "hers", "was", "were", "is", "am", "are", "be", "been", "being", "have",
      "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "as", "if", "each", "how", "which", "who",
      "whom", "what", "this", "these", "those", "that", "with", "without", "through", "over", "under", "above", "below",
      "between", "among", "during", "before", "after", "until", "while", "of", "for", "on", "off", "out", "in", "into",
      "by", "about", "against", "with", "amongst", "throughout", "despite", "towards", "upon", "isn't", "aren't", "wasn't",
      "weren't", "haven't", "hasn't", "hadn't", "doesn't", "didn't", "don't", "won't", "wouldn't", "can't", "couldn't", 
      "shouldn't", "mustn't", "needn't", "daren't", "hasn't", "haven't", "hadn't"
    ]);
    const words = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=_`~()]/g, "").replace(/\s{2,}/g, " ").split(" ");
    const filteredWords = words.filter(word => !stopWords.has(word));
    return Object.entries(filteredWords.reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {}));
  }

  renderChart() {
    const data = this.state.wordFrequency.sort((a, b) => b[1] - a[1]).slice(0, 5); // Ensure we get top 5 words

    const svg = d3.select(".svg_parent");
    svg.selectAll("*").remove(); // Clear the previous chart

    const width = 1000; // Set width to 800
    const height = 400; // Adjust height for single line display

    svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(0, ${height / 2})`); // Center vertically

    // Create scales for font size and position
    const fontSizeScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[1])])
      .range([10, 40]); // Font size range (adjust as needed)

    const positionScale = d3.scaleLinear()
      .domain([0, data.length - 1]) // Make sure the domain can accommodate 5 words
      .range([0, width]);

    const spacing = width / data.length; // Space based on the number of words

    const words = svg.select("g")
      .selectAll("text")
      .data(data, d => d[0]); // Use word as key for update

    // Enter selection for new words
    words.enter()
      .append("text")
      .style("font-size", 0) // Start from font size 0 for animation
      .attr("x", (d, i) => positionScale(i) + spacing / 2) // Position words evenly
      .attr("y", 0) // Center vertically
      .attr("text-anchor", "middle") // Center text horizontally
      .text(d => d[0])
      .transition()
      .duration(500) // Animation duration
      .style("font-size", d => `${fontSizeScale(d[1])}px`); // Animate to final font size

    // Update selection for existing words
    words.transition()
      .duration(500) // Animation duration
      .style("font-size", d => `${fontSizeScale(d[1])}px`) // Update font size
      .attr("x", (d, i) => positionScale(i) + spacing / 2); // Update position

    // Exit selection for removed words
    words.exit().transition()
      .duration(500) // Animation duration
      .style("font-size", "0px") // Animate to font size 0
      .remove(); // Remove from DOM after transition
}



  render() {
    return (
      <div className="parent">
        <div className="child1" style={{ width: 1000 }}>
          <textarea id="input_field" style={{ height: 150, width: 1000 }} />
          <button
            style={{ marginTop: 10, height: 40, width: 1000 }}
            onClick={() => {
              const input_data = document.getElementById("input_field").value;
              this.setState({ wordFrequency: this.getWordFrequency(input_data) });
            }}
          >
            Generate WordCloud
          </button>
        </div>
        <div className="child2">
          <svg className="svg_parent"></svg>
        </div>
      </div>
    );
  }
}

export default App;
