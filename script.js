// Criteria weights (must sum to 100)
const weights = {
  q1: 10,  // Problem-Solution Fit
  q2: 10,  // Market Size
  q3: 20,  // Traction
  q4: 15,  // Team
  q5: 10,  // Differentiation
  q6: 10,  // Scalability
  q7: 10,  // Capital Efficiency
  q8: 10,  // Investor Alignment
  q9: 15   // Regulatory/IP Clarity
};

// Stage thresholds
const stages = [
  { name: "Validation Needed", min: 0, max: 40, funding: "Grants, Bootstrapping" },
  { name: "Idea Stage", min: 41, max: 60, funding: "Grants + Angels" },
  { name: "Pre-Seed", min: 61, max: 80, funding: "Angels + Crowdfunding" },
  { name: "Seed-Ready", min: 81, max: 100, funding: "Seed VC" }
];

// UK funding recommendations by stage
const ukRecommendations = {
  "Validation Needed": [
    { type: "Grants", name: "Innovate UK Smart Grants", link: "https://www.ukri.org/opportunity/innovate-uk-smart-grants/", description: "Non-dilutive funding for R&D projects (up to £250K)." },
    { type: "Grants", name: "SBRI Healthcare", link: "https://www.sbrihealthcare.co.uk/", description: "Grants for healthcare innovations." },
    { type: "Accelerator", name: "Growth Forge", link: "https://growthforge.co.uk", description: "South West accelerator with funding support." }
  ],
  "Idea Stage": [
    { type: "Grants", name: "Innovate UK", link: "https://www.ukri.org/councils/innovate-uk/", description: "UK’s innovation agency for early-stage projects." },
    { type: "Angels", name: "South West Angel Network", link: "https://www.swangels.co.uk/", description: "Angel investors for South West startups." },
    { type: "Angels", name: "Bristol Private Equity Club", link: "https://www.bpec.co.uk/", description: "Local angel network for Bristol-based startups." }
  ],
  "Pre-Seed": [
    { type: "Angels", name: "South West Angel Network", link: "https://www.swangels.co.uk/", description: "Local angel network." },
    { type: "VC", name: "Octopus Ventures (Pre-Seed)", link: "https://octopusventures.com/", description: "Early-stage VC with health/CPG focus." },
    { type: "Crowdfunding", name: "Crowdcube", link: "https://www.crowdcube.com/", description: "Equity crowdfunding for UK startups." },
    { type: "Crowdfunding", name: "Seedrs", link: "https://www.seedrs.com/", description: "Equity crowdfunding with a strong CPG track record." }
  ],
  "Seed-Ready": [
    { type: "VC", name: "Balderton Capital", link: "https://www.balderton.com/", description: "Leading European VC for consumer/health startups." },
    { type: "VC", name: "MMC Ventures", link: "https://www.mmc.vc/", description: "Data-driven VC for scalable startups." },
    { type: "VC", name: "Ascension", link: "https://ascension.vc/", description: "VC with a focus on impact and scalability." }
  ]
};

// Criteria names for display
const criteriaNames = {
  q1: "Problem-Solution Fit",
  q2: "Market Size",
  q3: "Traction",
  q4: "Team",
  q5: "Differentiation",
  q6: "Scalability",
  q7: "Capital Efficiency",
  q8: "Investor Alignment",
  q9: "Regulatory/IP Clarity"
};

// Calculate score and stage
function calculateResults() {
  let totalScore = 0;
  let gaps = [];

  // Calculate total score
  for (let i = 1; i <= 9; i++) {
    const question = `q${i}`;
    const selectedOption = document.querySelector(`input[name="${question}"]:checked`);
    if (selectedOption) {
      const score = parseInt(selectedOption.value);
      const weight = weights[question];
      totalScore += (score / 100) * weight;

      // Check for gaps (score < 100)
      if (score < 100) {
        gaps.push({
          name: criteriaNames[question],
          score: score,
          flag: score === 0 ? "❌" : "⚠️"
        });
      }
    }
  }

  // Determine stage
  let stage;
  for (const s of stages) {
    if (totalScore >= s.min && totalScore <= s.max) {
      stage = s;
      break;
    }
  }

  // Sort gaps by score (lowest first)
  gaps.sort((a, b) => a.score - b.score);

  // Display results
  document.getElementById("score").textContent = `${Math.round(totalScore)}%`;
  document.getElementById("stage").innerHTML = `
    <h3>Stage: ${stage.name}</h3>
    <p><strong>Funding Strategy:</strong> ${stage.funding}</p>
  `;

  // Display gaps
  let gapsHTML = "<h3>Top Gaps to Fix:</h3><ul>";
  gaps.slice(0, 3).forEach(gap => {
    gapsHTML += `<li>${gap.flag} <strong>${gap.name}</strong></li>`;
  });
  gapsHTML += "</ul>";
  document.getElementById("gaps").innerHTML = gapsHTML;

  // Display UK recommendations
  let recsHTML = "<h3>Recommended UK Funding Options:</h3><ul>";
  ukRecommendations[stage.name].forEach(rec => {
    recsHTML += `<li><a href="${rec.link}" target="_blank" style="color: #4ECDC4;">${rec.name} (${rec.type})</a>: ${rec.description}</li>`;
  });
  recsHTML += "</ul>";
  document.getElementById("recommendations").innerHTML = recsHTML;

  // Show results
  document.getElementById("results").classList.remove("hidden");
  
  // Scroll to results
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
}

// Handle form submission
document.getElementById("assessment-form").addEventListener("submit", function(e) {
  e.preventDefault();
  calculateResults();

  // Optional: Send email with results (requires backend)
  const email = document.getElementById("email").value;
  if (email) {
    console.log("Email to send results to:", email);
    // In a real app, you'd send this to a Netlify Function or similar
    alert("Your results have been calculated! (Demo only - no email sent)");
  }
});
