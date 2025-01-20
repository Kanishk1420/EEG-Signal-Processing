import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card.jsx";
import { Sun, Moon } from "lucide-react";

const sampleData = Array.from({ length: 100 }, () => Math.random() * 600 - 300);

const fetchPrediction = async (data) => {
  try {
    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: data }),
    });
    if (!response.ok) throw new Error("Backend connection failed");
    const result = await response.json();
    return result.status;
  } catch (error) {
    console.error("Prediction error:", error);
    return "Backend Error";
  }
};

const EEGForm = () => {
  const [eegData, setEegData] = useState([]);
  const [bandData, setBandData] = useState({
    delta: [],
    theta: [],
    alpha: [],
    beta: [],
    gamma: [],
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(100);
  const [seizureStatus, setSeizureStatus] = useState("No Data");
  const [darkMode, setDarkMode] = useState(false);

  const processBands = React.useCallback((rawData) => {
    const windowSize = 20;
    if (rawData.length < windowSize) return null;

    const sample = rawData.slice(-windowSize);
    const time = Date.now();

    return {
      // Delta: 0.5-4 Hz, high amplitude
      delta: sample.map(
        (v, i) => v * 0.6 + Math.sin(time / 2000 + i * 0.5) * 40
      ),
      // Theta: 4-8 Hz, moderate amplitude
      theta: sample.map(
        (v, i) =>
          v * 0.4 +
          Math.sin(time / 1000 + i * 0.8) * 20 +
          Math.sin(time / 800 + i) * 10
      ),
      // Alpha: 8-13 Hz, medium-low amplitude
      alpha: sample.map(
        (v, i) =>
          v * 0.3 +
          Math.sin(time / 500 + i * 1.3) * 10 +
          Math.sin(time / 400 + i) * 5
      ),
      // Beta: 13-30 Hz, low amplitude, faster
      beta: sample.map(
        (v, i) =>
          v * 0.2 +
          Math.sin(time / 200 + i * 2) * 5 +
          Math.sin(time / 150 + i * 2.5) * 3
      ),
      // Gamma: >30 Hz, very low amplitude, fastest
      gamma: sample.map(
        (v, i) =>
          v * 0.1 +
          Math.sin(time / 100 + i * 4) * 2 +
          Math.sin(time / 50 + i * 5) * 1
      ),
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Possible Seizure Activity":
        return "bg-red-500 text-white font-bold";
      case "Normal":
        return "bg-green-500 text-white font-bold";
      case "Backend Error":
        return "bg-yellow-500 text-white font-bold";
      case "No Data":
        return "bg-gray-500 text-white font-bold";
      default:
        return "bg-gray-500 text-white font-bold";
    }
  };
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [darkMode]);
  useEffect(() => {
    let interval;
    if (isPlaying) {
      const updateData = async () => {
        try {
          const response = await fetch("http://localhost:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ features: [] }),
          });

          if (!response.ok) {
            setIsPlaying(false);
            setSeizureStatus("Backend Error");
            return;
          }

          setEegData((prev) => {
            const newData = Array.isArray(prev) ? [...prev] : [];
            if (newData.length > 100) newData.shift();
            const lastIndex =
              newData.length > 0 ? newData[newData.length - 1].time + 1 : 0;
            const dataIndex = lastIndex % sampleData.length;
            newData.push({
              time: lastIndex,
              value: sampleData[dataIndex],
            });
            return newData;
          });

          const bands = processBands(eegData.map((d) => d.value));
          if (bands) {
            setBandData(bands);
          }

          if (eegData.length >= 20) {
            const prediction = await fetchPrediction(
              eegData.slice(-20).map((d) => d.value)
            );
            setSeizureStatus(prediction);
          }
        } catch (error) {
          setIsPlaying(false);
          setSeizureStatus("Backend Error");
        }
      };

      interval = setInterval(updateData, speed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, speed, processBands, eegData]);

  // Rest of your component remains the same...
  const handleClear = () => {
    setEegData([]);
    setBandData({
      delta: [],
      theta: [],
      alpha: [],
      beta: [],
      gamma: [],
    });
    setIsPlaying(false);
    setSeizureStatus("No Data");
  };

  const renderBandChart = (data, title, color, domain, isDark) => (
    <div
      className={`h-40 md:h-48 rounded-xl p-2 md:p-4 shadow-inner ${
        isDark ? "bg-gray-700" : "bg-gray-50"
      }`}
    >
      <p
        className={`text-sm font-semibold mb-2 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </p>
      <ResponsiveContainer>
        <LineChart
          data={data.map((value, index) => ({ time: index, value }))}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className={isDark ? "opacity-20" : "opacity-30"}
          />
          <XAxis dataKey="time" stroke={isDark ? "#9ca3af" : "#64748b"} />
          <YAxis domain={domain} stroke={isDark ? "#9ca3af" : "#64748b"} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div
                    className={`${
                      isDark ? "bg-gray-800" : "bg-white/90"
                    } backdrop-blur p-2 rounded border border-gray-600`}
                  >
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      Value:{" "}
                      <span style={{ color }}>
                        {payload[0].value.toFixed(2)}
                      </span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div
      className={`w-full px-4 py-6 md:px-6 lg:max-w-7xl lg:mx-auto font-sans transition-colors duration-200 ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {darkMode ? (
            <Sun className="w-6 h-6 text-yellow-500" />
          ) : (
            <Moon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      <Card
        className={`bg-white dark:bg-gray-800 shadow-2xl rounded-xl transition-colors`}
      >
        <CardHeader className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 rounded-t-xl p-4 md:p-6 mb-4 md:mb-8">
          <CardTitle className="text-white text-xl md:text-3xl font-bold font-mono text-center">
            Real-Time EEG Signal Processing
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 md:space-y-10 p-4 md:p-8">
          {/* Controls */}
          <div className="flex flex-col items-center gap-4 md:gap-8">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-6 md:px-8 py-3 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105 ${
                  isPlaying
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white w-full md:w-auto min-w-[140px] flex items-center justify-center gap-2`}
              >
                {isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
              <button
                onClick={handleClear}
                className="px-6 md:px-8 py-3 rounded-lg font-semibold bg-gray-600 hover:bg-gray-700 text-white shadow-lg transition-all transform hover:scale-105 w-full md:w-auto min-w-[140px] flex items-center justify-center gap-2"
              >
                🔄 Clear
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Speed Control:
              </span>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200"
              >
                <option value={20}>Fast</option>
                <option value={90}>Normal</option>
                <option value={150}>Slow</option>
              </select>
            </div>

            <div
              className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold ${getStatusColor(
                seizureStatus
              )} shadow-md text-center`}
            >
              Status: {seizureStatus}
            </div>
          </div>

          {/* Raw EEG Chart */}
          <div
            className={`h-64 md:h-80 rounded-xl p-2 md:p-6 shadow-inner ${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            }`}
          >
            <p className="text-sm font-semibold mb-2 dark:text-white">
              Raw EEG Signal
            </p>
            <ResponsiveContainer>
              <LineChart
                data={eegData}
                margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className={`${darkMode ? "opacity-20" : "opacity-30"}`}
                />
                <XAxis
                  dataKey="time"
                  stroke={darkMode ? "#9ca3af" : "#64748b"}
                  label={{
                    value: "Time (ms)",
                    position: "insideBottom",
                    offset: -10,
                    fill: darkMode ? "#9ca3af" : "#64748b",
                  }}
                />
                <YAxis
                  domain={[-300, 300]}
                  stroke={darkMode ? "#9ca3af" : "#64748b"}
                  label={{
                    value: "Amplitude (μV)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fill: darkMode ? "#9ca3af" : "#64748b",
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div
                          className={`${
                            darkMode ? "bg-gray-800" : "bg-white/90"
                          } backdrop-blur p-2 rounded border border-gray-600`}
                        >
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            Value:{" "}
                            <span style={{ color: "#2563eb" }}>
                              {payload[0].value.toFixed(2)} μV
                            </span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Update the band charts rendering */}
          <div className="space-y-4">
            {renderBandChart(
              bandData.delta,
              "Delta (0.5-4 Hz)",
              "#3b82f6",
              [-60, 60],
              darkMode
            )}
            {renderBandChart(
              bandData.theta,
              "Theta (4-8 Hz)",
              "#06b6d4",
              [-30, 30],
              darkMode
            )}
            {renderBandChart(
              bandData.alpha,
              "Alpha (8-13 Hz)",
              "#8b5cf6",
              [-15, 15],
              darkMode
            )}
            {renderBandChart(
              bandData.beta,
              "Beta (13-30 Hz)",
              "#ec4899",
              [-8, 8],
              darkMode
            )}
            {renderBandChart(
              bandData.gamma,
              "Gamma (30-100 Hz)",
              "#f43f5e",
              [-3, 3],
              darkMode
            )}
          </div>

          {/* Info Cards with dark mode */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card
              className={`${
                darkMode
                  ? "bg-gradient-to-br from-gray-800 to-gray-700 hover:bg-gray-600/90"
                  : "bg-gradient-to-br from-blue-50 to-blue-100"
              } border-none shadow-md hover:shadow-lg transition-colors duration-200`}
            >
              <CardContent className="p-4 md:p-6">
                <h3
                  className={`text-base md:text-lg font-bold mb-3 ${
                    darkMode ? "text-blue-400" : "text-blue-800"
                  }`}
                >
                  📊 Signal Info
                </h3>
                <div
                  className={`space-y-2 text-sm ${
                    darkMode ? "text-gray-300" : "text-blue-700"
                  }`}
                >
                  <p>
                    Sampling Rate: <span className="font-mono">10 Hz</span>
                  </p>
                  <p>
                    Window Size: <span className="font-mono">100 samples</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${
                darkMode
                  ? "bg-gradient-to-br from-gray-800 to-gray-700 hover:bg-gray-600/90"
                  : "bg-gradient-to-br from-green-50 to-green-100"
              } border-none shadow-md hover:shadow-lg transition-colors duration-200`}
            >
              <CardContent className="p-4 md:p-6">
                <h3
                  className={`text-base md:text-lg font-bold mb-3 ${
                    darkMode ? "text-green-400" : "text-green-800"
                  }`}
                >
                  ⚡ Current Status
                </h3>
                <div
                  className={`space-y-2 text-sm ${
                    darkMode ? "text-gray-300" : "text-green-700"
                  }`}
                >
                  <p>
                    State:{" "}
                    <span className="font-mono">
                      {isPlaying ? "🎥 Recording" : "⏸ Paused"}
                    </span>
                  </p>
                  <p>
                    Update Speed: <span className="font-mono">{speed}ms</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${
                darkMode
                  ? "bg-gradient-to-br from-gray-800 to-gray-700 hover:bg-gray-600/90"
                  : "bg-gradient-to-br from-purple-50 to-purple-100"
              } border-none shadow-md hover:shadow-lg transition-colors duration-200`}
            >
              <CardContent className="p-4 md:p-6">
                <h3
                  className={`text-base md:text-lg font-bold mb-3 ${
                    darkMode ? "text-purple-400" : "text-purple-800"
                  }`}
                >
                  📶 Analysis
                </h3>
                <div
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-purple-700"
                  }`}
                >
                  <p className="font-mono text-base md:text-lg">
                    {seizureStatus}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EEGForm;
