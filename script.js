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

// Score bands (total score out of 9)
const scoreBands = [
  { name: "Validation Needed", min: 0, max: 4, funding: "Grants, Bootstrapping", description: "Focus on validating your idea and fixing critical gaps." },
  { name: "Product Market Fit Stage", min: 4.5, max: 6, funding: "Grants + Angels", description: "Apply for grants and seek angel investment to build traction." },
  { name: "Pre-Seed", min: 6.5, max: 8, funding: "Angels + Crowdfunding", description: "Target angels and crowdfunding platforms for early-stage capital." },
  { name: "Seed-Ready", min: 8.5, max: 9, funding: "Seed VC", description: "Approach VCs with a strong pitch and traction." }
];

// UK funding recommendations by stage
const ukRecommendations = {
  "Validation Needed": [
    { type: "Grants", name: "UKRI Funding Finder", link: "https://www.ukri.org/apply-for-funding/", description: "Non-dilutive funding for R&D projects." },
    { type: "Tax", name: "Westcotts Chartered Accountants", link: "https://westcotts.uk/specialist-sectors/manufacturing-technology/", description: "Advice on R&D Tax Credits and Patent Box." },
    { type: "Test and Validate", name: "Market Testing", link: "https://www.lennysnewsletter.com/p/how-to-validate-your-b2b-startup", description: "Be prepared to listen, learn and pivot." },
    { type: "Structure and Ecosystem", name: "Accelerators", link: "https://accelerate-fyi.vercel.app/", description: "See what is out there that could help with your problem - look for alignment with your goals even if the programme isn't local." }
  ],
  "Product Market Fit Stage": [
    { type: "Grants", name: "UKRI", link: "https://www.ukri.org/apply-for-funding/", description: "UK’s innovation agency for early-stage projects." },
    { type: "Angels", name: "UK Business Angels Association", link: "https://ukbaa.org.uk/member-directory/", description: "Member Directory (register for free as a subscriber)." },
    { type: "Structure and Ecosystem", name: "Accelerators", link: "https://accelerate-fyi.vercel.app/", description: "See what is out there that could help with your problem - look for alignment with your goals even if the programme isn't local." },
    { type: "Sales expertise", name: "Contact Steampunk for contacts in specific verticals", link: "https://www.steampunk.ventures/", description: "Support with opportunity identification, bid strategy development, stakeholder mapping, and tailored engagement plans." }
  ],
  "Pre-Seed": [
    { type: "Angels", name: "UK Business Angels Association", link: "https://ukbaa.org.uk/member-directory/", description: "Member Directory (register for free as a subscriber)." },
    { type: "VC", name: "Shipshape", link: "https://www.shipshape.vc/", description: "Search engine to find investors." },
    { type: "Crowdfunding", name: "The Crowdspace", link: "https://thecrowdspace.com/", description: "Search and filter Investment Platforms by UK & Equity." },
    { type: "Structure and Ecosystem", name: "Accelerators", link: "https://accelerate-fyi.vercel.app/", description: "See what is out there that could help with your problem - look for alignment with your goals even if the programme isn't local." }
  ],
  "Seed-Ready": [
    { type: "Fundraising community", name: "Focused for Business", link: "https://focusedforbusiness.com/startup-business-support/", description: "Early-stage advice, accelerator and community for founders." },
    { type: "VC", name: "Shipshape", link: "https://www.shipshape.vc/", description: "Search engine to find investors." },
    { type: "Crowdfunding", name: "The Crowdspace", link: "https://thecrowdspace.com/", description: "Search and filter Investment Platforms by UK & Equity." },
    { type: "Structure and Ecosystem", name: "Accelerators", link: "https://accelerate-fyi.vercel.app/", description: "See what is out there that could help with your problem - look for alignment with your goals even if the programme isn't local." }
  ]
};
// Calculate total score and stage
function calculateResults() {
  let totalScore = 0;
  let gaps = [];

  // Calculate total score (each ✅ = 1, ⚠️ = 0.5, ❌ = 0)
  for (let i = 1; i <= 9; i++) {
    const question = `q${i}`;
    const selectedOption = document.querySelector(`input[name="${question}"]:checked`);
    if (selectedOption) {
      const score = parseInt(selectedOption.value) / 100; // Convert 100/50/0 to 1/0.5/0
      totalScore += score;

      // Check for gaps (score < 1)
      if (score < 1) {
        gaps.push({
          name: criteriaNames[question],
          score: score,
          flag: score === 0 ? "❌" : "⚠️"
        });
      }
    }
  }

  // Determine stage based on total score
  let stage;
  for (const band of scoreBands) {
    if (totalScore >= band.min && totalScore <= band.max) {
      stage = band;
      break;
    }
  }

  // Sort gaps by score (lowest first)
  gaps.sort((a, b) => a.score - b.score);

  // Display results
  document.getElementById("score").textContent = `${totalScore.toFixed(1)}/9`;
  document.getElementById("stage").innerHTML = `
    <h3>Stage: ${stage.name}</h3>
    <p><strong>Funding Strategy:</strong> ${stage.funding}</p>
    <p>${stage.description}</p>
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
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
}

// Handle form submission
document.getElementById("assessment-form").addEventListener("submit", function(e) {
  e.preventDefault(); // Prevent page reload
  calculateResults();

  // Optional: Send email with results (requires backend)
  const email = document.getElementById("email").value;
  if (email) {
    console.log("Email to send results to:", email);
    alert("Your results have been calculated! (Demo only - no email sent)");
  }
});
