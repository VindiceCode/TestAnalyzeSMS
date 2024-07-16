import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle } from 'lucide-react';

const CATEGORIES = [
  "Hard DNC Language",
  "Wrong Number",
  "Do not want a response",
  "Land Loan",
  "Ask For LE / Already in Process",
  "HELOC / No Cash-Out Intention",
  "Spanish",
  "Not Interested",
  "New",
  "Uncategorized"
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const classifyResponse = (text) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("opt out") || lowerText.includes("stop") || lowerText.includes("remove")) {
    return "Hard DNC Language";
  } else if (lowerText.includes("wrong number")) {
    return "Wrong Number";
  } else if (lowerText.includes("fuck") || lowerText.includes("ass")) {
    return "Do not want a response";
  } else if (lowerText.includes("land loan")) {
    return "Land Loan";
  } else if (lowerText.includes("locked") || lowerText.includes("closing")) {
    return "Ask For LE / Already in Process";
  } else if (lowerText.includes("heloc") || lowerText.includes("equity line")) {
    return "HELOC / No Cash-Out Intention";
  } else if (lowerText.includes("spanish") || lowerText.includes("espanol")) {
    return "Spanish";
  } else if (lowerText.includes("not interested") || lowerText.includes("no thank")) {
    return "Not Interested";
  } else if (lowerText.includes("interest") || lowerText.includes("more info")) {
    return "New";
  }
  return "Uncategorized";
};

const mockAIClassify = (text) => {
  const lowerText = text.toLowerCase();
  // AI classification is more nuanced and context-aware
  if (lowerText.includes("opt out") || lowerText.includes("stop") || lowerText.includes("remove")) {
    return Math.random() < 0.9 ? "Hard DNC Language" : "Do not want a response";
  } else if (lowerText.includes("wrong number")) {
    return "Wrong Number";
  } else if (lowerText.includes("fuck") || lowerText.includes("ass")) {
    return Math.random() < 0.8 ? "Do not want a response" : "Hard DNC Language";
  } else if (lowerText.includes("land loan")) {
    return "Land Loan";
  } else if (lowerText.includes("locked") || lowerText.includes("closing")) {
    return Math.random() < 0.9 ? "Ask For LE / Already in Process" : "New";
  } else if (lowerText.includes("heloc") || lowerText.includes("equity line")) {
    return "HELOC / No Cash-Out Intention";
  } else if (lowerText.includes("spanish") || lowerText.includes("espanol")) {
    return "Spanish";
  } else if (lowerText.includes("not interested") || lowerText.includes("no thank")) {
    return Math.random() < 0.8 ? "Not Interested" : "Do not want a response";
  } else if (lowerText.includes("interest") || lowerText.includes("more info")) {
    return Math.random() < 0.9 ? "New" : "Ask For LE / Already in Process";
  }
  return Math.random() < 0.7 ? "Uncategorized" : "New";
};

const generateResponse = (clarity, sentiment, creativity) => {
  const clarityTexts = {
    "Clear": ["I want to opt out", "This is the wrong number", "I'm interested in a loan", "Not looking for a mortgage"],
    "Ambiguous": ["Maybe later", "What are your rates?", "Can you tell me more?", "I'm not sure"]
  };
  const sentimentTexts = {
    "Positive": ["Sounds good", "I'd like to apply", "When can we start?"],
    "Negative": ["No thanks", "Remove me from your list", "Not interested"]
  };

  let baseText = clarityTexts[clarity][Math.floor(Math.random() * clarityTexts[clarity].length)];
  baseText += " " + sentimentTexts[sentiment][Math.floor(Math.random() * sentimentTexts[sentiment].length)];

  if (creativity > 0.5) {
    const creativeAdditions = [
      "by the way, do you offer HELOC?",
      "I just got a promotion, so maybe it's time to upgrade!",
      "but I'm in the middle of closing on another property, can we discuss later?"
    ];
    baseText += " " + creativeAdditions[Math.floor(Math.random() * creativeAdditions.length)];
  }

  return baseText;
};

const reviewClassification = (response, currentClassification, aiClassification) => {
  const lowerResponse = response.toLowerCase();
  
  if (lowerResponse.includes("opt out") && currentClassification !== "Hard DNC Language") {
    return { current: "Fail", ai: aiClassification === "Hard DNC Language" ? "Pass" : "Fail" };
  }
  if (lowerResponse.includes("wrong number") && currentClassification !== "Wrong Number") {
    return { current: "Fail", ai: aiClassification === "Wrong Number" ? "Pass" : "Fail" };
  }
  if ((lowerResponse.includes("interest") || lowerResponse.includes("apply")) && currentClassification !== "New") {
    return { current: "Fail", ai: aiClassification === "New" ? "Pass" : "Fail" };
  }
  if (lowerResponse.includes("not interested") && currentClassification !== "Not Interested") {
    return { current: "Fail", ai: aiClassification === "Not Interested" ? "Pass" : "Fail" };
  }

  return { current: "Pass", ai: "Pass" };
};

const MatrixSelector = ({ options, selected, onSelect }) => (
  <div className="grid grid-cols-2 gap-2">
    {options.map((option) => (
      <Button
        key={option}
        onClick={() => onSelect(option)}
        variant={selected === option ? "default" : "outline"}
        className={`${selected === option ? 'bg-blue-500 text-white' : 'bg-white text-blue-700'} border-blue-500 transition-all duration-200 hover:scale-105`}
      >
        {option}
      </Button>
    ))}
  </div>
);

const Dashboard = () => {
  const [responseList, setResponseList] = useState([]);
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [clarity, setClarity] = useState("Clear");
  const [sentiment, setSentiment] = useState("Positive");
  const [creativity, setCreativity] = useState(0.5);
  const [analysisData, setAnalysisData] = useState([]);
  const [overallStats, setOverallStats] = useState({ total: 0, currentPass: 0, aiPass: 0 });

  const generateNewResponse = () => {
    const newResponse = generateResponse(clarity, sentiment, creativity);
    setGeneratedResponse(newResponse);
  };

  const addToList = () => {
    if (generatedResponse) {
      setResponseList([...responseList, generatedResponse]);
      setGeneratedResponse('');
    }
  };

  const analyzeResponses = () => {
    const analysis = responseList.map(response => {
      const currentClassification = classifyResponse(response);
      const aiClassification = mockAIClassify(response);
      const review = reviewClassification(response, currentClassification, aiClassification);
      
      return {
        response,
        currentClassification,
        aiClassification,
        review
      };
    });

    setAnalysisData(analysis);

    const stats = analysis.reduce((acc, item) => {
      acc.total++;
      if (item.review.current === "Pass") acc.currentPass++;
      if (item.review.ai === "Pass") acc.aiPass++;
      return acc;
    }, { total: 0, currentPass: 0, aiPass: 0 });

    setOverallStats(stats);
  };

  const getChartData = () => {
    const data = CATEGORIES.map(category => ({
      name: category,
      current: analysisData.filter(item => item.currentClassification === category).length,
      ai: analysisData.filter(item => item.aiClassification === category).length
    }));
    return data.filter(item => item.current > 0 || item.ai > 0);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-blue-700 text-center">M3 Solutions SMS Analysis Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-blue-600 text-white">Response Generator</CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-semibold">Clarity</label>
                <MatrixSelector
                  options={["Clear", "Ambiguous"]}
                  selected={clarity}
                  onSelect={setClarity}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Sentiment</label>
                <MatrixSelector
                  options={["Positive", "Negative"]}
                  selected={sentiment}
                  onSelect={setSentiment}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Creativity: {creativity.toFixed(2)}</label>
                <Slider 
                  value={[creativity]} 
                  onValueChange={([value]) => setCreativity(value)} 
                  max={1} 
                  step={0.01}
                  className="bg-blue-200"
                />
              </div>
              <Button onClick={generateNewResponse} className="bg-blue-500 hover:bg-blue-600 text-white w-full">Generate Response</Button>
              <div>
                <Input
                  value={generatedResponse}
                  onChange={(e) => setGeneratedResponse(e.target.value)}
                  placeholder="Generated response will appear here"
                  className="w-full border-blue-300"
                />
              </div>
              <Button onClick={addToList} className="bg-green-500 hover:bg-green-600 text-white w-full">Add to List</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-blue-600 text-white">Response List</CardHeader>
          <CardContent>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {responseList.map((response, index) => (
                <li key={index} className="border-b pb-2">{response}</li>
              ))}
            </ul>
            <Button onClick={analyzeResponses} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white w-full">Analyze Responses</Button>
          </CardContent>
        </Card>
      </div>

      {analysisData.length > 0 && (
        <>
          <Card className="mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-blue-600 text-white">Classification Comparison</CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={getChartData()}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#3B82F6" name="Current System" />
                  <Bar dataKey="ai" fill="#10B981" name="AI Classification" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-blue-600 text-white">Overall Performance</CardHeader>
              <CardContent>
                <div className="flex justify-around items-center h-full">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{((overallStats.currentPass / overallStats.total) * 100).toFixed(1)}%</p>
                    <p>Current System Accuracy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{((overallStats.aiPass / overallStats.total) * 100).toFixed(1)}%</p>
                    <p>AI System Accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-blue-600 text-white">Category Distribution</CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={getChartData()}
                      dataKey="ai"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {getChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-blue-600 text-white">Analysis Summary</CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {analysisData.map((item, index) => (
                  <li key={index} className="border-b pb-2">
                    <p className="font-semibold">Response: {item.response}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p>Current System: {item.currentClassification}</p>
                      {item.review.current === "Pass" ? (
                        <CheckCircle className="text-green-500" />
                      ) : (
                        <AlertCircle className="text-red-500" />
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p>AI Classification: {item.aiClassification}</p>
                      {item.review.ai === "Pass" ? (
                        <CheckCircle className="text-green-500" />
                      ) : (
                        <AlertCircle className="text-red-500" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;