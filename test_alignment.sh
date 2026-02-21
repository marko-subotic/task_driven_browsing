#!/bin/bash

API_ENDPOINT="https://9f8978yqm4.execute-api.us-west-2.amazonaws.com/prod/check-alignment"
API_KEY="kzeu8IlSyC5mZDsz7P5C7YgyqGpcF8Z6VyxX2C85"

echo "Running 10 realistic alignment tests..."
echo "========================================"

# Test 1: Wikipedia article on Python (aligned)
echo -e "\n1. Wikipedia Python article for 'learn Python' goal:"
curl -s -X POST "$API_ENDPOINT" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "learn Python programming",
    "pageTitle": "Python (programming language) - Wikipedia",
    "pageUrl": "https://en.wikipedia.org/wiki/Python_(programming_language)",
    "pageContent": "Python is a high-level, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation. Python is dynamically typed and garbage-collected. It supports multiple programming paradigms, including structured, object-oriented and functional programming. Guido van Rossum began working on Python in the late 1980s as a successor to the ABC programming language.",
    "goalSpecificity": "specific"
  }' | jq -c

# Test 2: Reddit homepage for Python goal (misaligned)
echo -e "\n2. Reddit homepage for 'learn Python' goal:"
curl -s -X POST "$API_ENDPOINT" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "learn Python programming",
    "pageTitle": "Reddit - Dive into anything",
    "pageUrl": "https://reddit.com",
    "pageContent": "Reddit is a network of communities where people can dive into their interests, hobbies and passions. There is a community for whatever you are interested in on Reddit. Popular posts today: Funny cat compilation, AITA for not inviting my sister to my wedding, What is your favorite movie of all time?",
    "goalSpecificity": "specific"
  }' | jq -c

# Test 3: Amazon product page for laptop (aligned with shopping goal)
echo -e "\n3. Laptop product page for 'buy a laptop' goal:"
curl -s -X POST "$API_ENDPOINT" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "buy a new laptop for programming",
    "pageTitle": "Dell XPS 15 Laptop - 16GB RAM, 512GB SSD | Amazon.com",
    "pageUrl": "https://amazon.com/dp/B08XYZ123",
    "pageContent": "Dell XPS 15 9520 Laptop - Intel Core i7-12700H, 16GB DDR5 RAM, 512GB PCIe SSD, 15.6 inch FHD+ Display, NVIDIA GeForce RTX 3050 Ti, Windows 11 Pro. Perfect for developers and content creators. Price: $1,299.99. Free shipping. In stock. Add to Cart. Customer reviews: 4.5 out of 5 stars (2,847 ratings).",
    "goalSpecificity": "specific"
  }' | jq -c

# Test 4: Google search results page (aligned with search goal)
echo -e "\n4. Google search for 'machine learning tutorials' goal:"
curl -s -X POST "$API_ENDPOINT" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "find machine learning tutorials",
    "pageTitle": "machine learning tutorials - Google Search",
    "pageUrl": "https://google.com/search?q=machine+learning+tutorials",
    "pageContent": "About 1,240,000,000 results (0.52 seconds). Top results: Machine Learning Crash Course - Google Developers, Introduction to Machine Learning - Coursera, Machine Learning Tutorial for Beginners - YouTube, Deep Learning Specialization - Andrew Ng.",
    "goalSpecificity": "specific"
  }' | jq -c

# Test 5: News article about politics (misaligned with tech goal)
echo -e "\n5. Political news for 'learn web development' goal:"
curl -s -X POST "$API_ENDPOINT" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "learn web development",
    "pageTitle": "Senate Passes New Infrastructure Bill - CNN Politics",
    "pageUrl": "https://cnn.com/politics/senate-infrastructure-bill",
    "pageContent": "The Senate voted 69-30 to pass a $1.2 trillion infrastructure package on Tuesday, marking a major bipartisan achievement. The bill includes funding for roads, bridges, broadband internet, and electric vehicle charging stations. President Biden praised the legislation as a historic investment in America.",
    "goalSpecificity": "specific"
  }' | jq -c

# Test 6: Stack Overflow question (uncertain - related but tangential)
echo -e "\n6. Stack Overflow CSS question for 'learn React' goal:"
curl -s -X POST "$API_ENDPOINT" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "learn React framework",
    "pageTitle": "How to center a div in CSS? - Stack Overflow",
    "pageUrl": "https://stackoverflow.com/questions/114543/center-div",
    "pageContent": "I am trying to center a div horizontally and vertically on the page. I have tried using margin: auto but it only centers horizontally. What is the best way to achieve this? Answers: Use flexbox with justify-content: center and align-items: center. Or use CSS Grid. Or use position: absolute with transform.",
    "goalSpecificity": "specific"
  }' | jq -c

# Test 7: YouTube video page (aligned)
echo -e "\n7. YouTube tutorial for 'learn guitar' goal:"
curl -s -X POST "$API_ENDPOINT" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "learn to play guitar",
    "pageTitle": "Beginner Guitar Lesson 1 - Your First Guitar Lesson - YouTube",
    "pageUrl": "https://youtube.com/watch?v=abc123",
    "pageContent": "Welcome to your first guitar lesson! In this video, we will cover the basics of holding the guitar, tuning, and playing your first chords. By the end of this lesson, you will be able to play a simple song. 2.3M views. 45K likes. Subscribe for more guitar tutorials. Next lesson: Strumming patterns.",
    "goalSpecificity": "vague"
  }' | jq -c

# Test 8: Twitter/X feed (misaligned with focused goal)
echo -e "\n8. Twitter feed for 'research cloud computing' goal:"
curl -s -X POST "$API_ENDPOINT" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "research AWS cloud computing services",
    "pageTitle": "Home / X",
    "pageUrl": "https://x.com/home",
    "pageContent": "What is happening?! Trending now: #MondayMotivation, Celebrity gossip, Sports highlights. For you timeline: @elonmusk: New feature coming soon! @randomuser: Just had the best coffee ever ☕. @newsperson: Breaking news about the economy. @techinfluencer: Check out this cool gadget!",
    "goalSpecificity": "specific"
  }' | jq -c

# Test 9: Documentation page (aligned)
echo -e "\n9. AWS docs for 'learn AWS Lambda' goal:"
curl -s -X POST "$API_ENDPOINT" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "learn how to use AWS Lambda",
    "pageTitle": "What is AWS Lambda? - AWS Lambda",
    "pageUrl": "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html",
    "pageContent": "AWS Lambda is a serverless compute service that lets you run code without provisioning or managing servers. You pay only for the compute time you consume. With Lambda, you can run code for virtually any type of application or backend service with zero administration. Lambda runs your code on high-availability compute infrastructure and performs all administration of compute resources. Getting started tutorial. Lambda function handler. Deployment packages.",
    "goalSpecificity": "specific"
  }' | jq -c

# Test 10: LinkedIn profile (misaligned)
echo -e "\n10. LinkedIn profile for 'debug JavaScript error' goal:"
curl -s -X POST "$API_ENDPOINT" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "debug JavaScript TypeError in my code",
    "pageTitle": "John Smith - Software Engineer - Tech Corp | LinkedIn",
    "pageUrl": "https://linkedin.com/in/johnsmith",
    "pageContent": "John Smith. Software Engineer at Tech Corp. San Francisco Bay Area. 500+ connections. About: Passionate software engineer with 5 years of experience in full-stack development. Skills: JavaScript, React, Node.js, Python, AWS. Experience: Senior Software Engineer at Tech Corp (2020-Present), Software Developer at StartupXYZ (2018-2020). Education: BS Computer Science, Stanford University.",
    "goalSpecificity": "specific"
  }' | jq -c

echo -e "\n========================================"
echo "Tests complete!"
