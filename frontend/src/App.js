import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Card,
  CardContent,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

function App() {
  const [models, setModels] = useState({ openai: [], huggingface: [] });
  const [selectedModel1, setSelectedModel1] = useState("");
  const [selectedModel2, setSelectedModel2] = useState("");
  const [inputText, setInputText] = useState("");
  const [summaries, setSummaries] = useState({});
  const [ratings, setRatings] = useState({});
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchModels();
    fetchRatings();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/models`);
      setModels(response.data.models);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ratings`);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const handleSummarize = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/summarize`, {
        text: inputText,
        model1: selectedModel1,
        model2: selectedModel2,
      });
      setSummaries(response.data.summaries);
    } catch (error) {
      console.error("Error generating summaries:", error);
    }
  };

  const handleRate = async (modelName, rating) => {
    try {
      await axios.post(`${API_BASE_URL}/rate`, {
        model_name: modelName,
        ...rating,
      });
      fetchRatings();
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Battle of the LLMs: Summarizer Showdown
        </Typography>

        <Grid container spacing={3}>
          {/* Model Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Model 1</InputLabel>
              <Select
                value={selectedModel1}
                onChange={(e) => setSelectedModel1(e.target.value)}
              >
                {models.openai.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
                {models.huggingface.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Model 2</InputLabel>
              <Select
                value={selectedModel2}
                onChange={(e) => setSelectedModel2(e.target.value)}
              >
                {models.openai.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
                {models.huggingface.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Input Text */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Enter text to summarize"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSummarize}
              disabled={!selectedModel1 || !selectedModel2 || !inputText}
            >
              Compare Summaries
            </Button>
          </Grid>

          {/* Summaries */}
          {Object.keys(summaries).length > 0 && (
            <>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {selectedModel1} Summary
                    </Typography>
                    <Typography>{summaries[selectedModel1]}</Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography component="legend">
                        Rate this summary:
                      </Typography>
                      <Rating
                        name="clarity"
                        onChange={(_, value) =>
                          handleRate(selectedModel1, { clarity: value })
                        }
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {selectedModel2} Summary
                    </Typography>
                    <Typography>{summaries[selectedModel2]}</Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography component="legend">
                        Rate this summary:
                      </Typography>
                      <Rating
                        name="clarity"
                        onChange={(_, value) =>
                          handleRate(selectedModel2, { clarity: value })
                        }
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          {/* Statistics */}
          {stats && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Overall Statistics
                </Typography>
                <BarChart
                  width={800}
                  height={300}
                  data={[
                    {
                      name: "Clarity",
                      Model1: stats.avg_clarity,
                      Model2: stats.avg_clarity,
                    },
                    {
                      name: "Accuracy",
                      Model1: stats.avg_accuracy,
                      Model2: stats.avg_accuracy,
                    },
                    {
                      name: "Conciseness",
                      Model1: stats.avg_conciseness,
                      Model2: stats.avg_conciseness,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Model1" fill="#8884d8" />
                  <Bar dataKey="Model2" fill="#82ca9d" />
                </BarChart>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
