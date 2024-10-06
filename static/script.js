function toggleFAQ(element) {
    const content = element.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
}

// Change navbar background on scroll
window.onscroll = function () {
    const navbar = document.querySelector('.navbar');
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
};

async function submitResponse(questionId) {
    const responseElement = document.getElementById('response-' + questionId);
    const response = responseElement.value.trim();

    if (!response) {
        alert("Please provide a response before submitting.");
        return;
    }

    const button = document.querySelector(`#response-${questionId} + button`);
    button.innerText = 'Submitting...';
    button.disabled = true;

    try {
        const result = await fetch('/analyze_response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ response: response }),
        }).then(res => res.json());

        if (result.error) {
            alert(result.error);
        } else {
            // Display the well-being score for this question
            document.getElementById('score-' + questionId).innerText =
                `Sentiment: ${result.label}, Score: ${result.score.toFixed(2)}`;
        }
    } catch (error) {
        alert("There was an error submitting your response. Please try again.");
    } finally {
        button.innerText = 'Submit';
        button.disabled = false;
    }
}



// Function to calculate the overall well-being score
function calculateFinalScore() {
    let totalScore = 0;
    let numQuestions = 10; // Adjust based on the number of questions
    let answeredQuestions = 0;

    for (let i = 1; i <= numQuestions; i++) {
        const scoreText = document.getElementById('score-' + i).innerText;
        if (scoreText) {
            const scoreMatch = scoreText.match(/Score: (\d+(\.\d+)?)/);
            if (scoreMatch) {
                const score = parseFloat(scoreMatch[1]);
                totalScore += score;
                answeredQuestions++;
            }
        }
    }

    // Calculate and display the average score
    if (answeredQuestions > 0) {
        const finalScore = totalScore / answeredQuestions;
        document.getElementById('final-score').innerText = finalScore.toFixed(2);
        
        // Show an alert with the final well-being score
        alert(`Your overall well-being score is: ${finalScore.toFixed(2)}`);
    }
}


