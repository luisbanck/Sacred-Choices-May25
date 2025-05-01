"use client";

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Block {
  name: string;
  description: string;
  choices: string[];
}

interface SavedData {
  [key: string]: {
    blocks: Block[];
    completedChoices: boolean[][][];
    dailyValueCreation: string[];
    dailyMeditations: string[];
    dailyAffirmations: string;
    guidingPrinciples: string;
  };
}

const API_BASE_URL = 'http://127.0.0.1:5000/api';

export default function Home() {
  const initialBlocks: Block[] = [
    {
      name: "1. Prime",
      description: "Build Your Higher Self",
      choices: ["Rise early", "God First", "Learn", "Exercise", "Meditation", "Nutrition"],
    },
    {
      name: "2. Prosper",
      description: "Create and Monetize Value",
      choices: ["DW#1 TCF", "DW#2 GrowTime AI", "DW#3 BubbleTech"],
    },
    {
      name: "3. Play",
      description: "Enjoy the Best Things Life Has to Offer",
      choices: ["Quality Time With Loved Ones", "Fun", "Plan and Enjoy Transformational Experiences"],
    },
    {
      name: "4. Purpose",
      description: "Contribute Locally and Globally",
      choices: ["Sagetown", "FUNDEMEX"],
    },
    {
      name: "5. Peace",
      description: "Wind Down, Rest Well",
      choices: ["Meditation", "Sleep early"],
    },
  ];

  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [completedChoices, setCompletedChoices] = useState<boolean[][][]>(
    initialBlocks.map((block) => block.choices.map(() => Array(7).fill(false)))
  );
  const [dailyValueCreation, setDailyValueCreation] = useState<string[]>(Array(7).fill(""));
  const [dailyMeditations, setDailyMeditations] = useState<string[]>(Array(7).fill(""));
  const [dailyAffirmations, setDailyAffirmations] = useState<string>("");
  const [guidingPrinciples, setGuidingPrinciples] = useState<string>("");
  const [week, setWeek] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);

  useEffect(() => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    const options: Intl.DateTimeFormatOptions = { 
      month: "long", 
      day: "numeric", 
      year: "numeric" as "numeric" | "2-digit"
    };
    const currentWeek = `${firstDayOfWeek.toLocaleDateString(undefined, options)} - ${lastDayOfWeek.toLocaleDateString(
      undefined,
      options
    )}`;
    setWeek(currentWeek);

    (async () => {
      await loadData(currentWeek);
      await loadAvailableWeeks();
    })();
  }, []);

  const loadAvailableWeeks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/weeks`);
      if (!response.ok) {
        throw new Error('Failed to fetch available weeks');
      }
      const weeks = await response.json();
      setAvailableWeeks(weeks);
    } catch (error) {
      console.error('Error loading available weeks:', error);
    }
  };

  const loadData = async (week: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/data/${encodeURIComponent(week)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      
      setBlocks(data.blocks);
      // Transform the completions data to match the frontend structure
      const newCompletedChoices = data.blocks.map((block: any) =>
        block.choices.map((choice: any) => choice.completions)
      );
      setCompletedChoices(newCompletedChoices);
      setDailyValueCreation(data.daily_value_creation);
      setDailyMeditations(data.daily_meditations);
      setDailyAffirmations(data.daily_affirmations || "");
      setGuidingPrinciples(data.guiding_principles || "");
    } catch (error) {
      console.error('Error loading data:', error);
      // Optionally show an error message to the user
      alert('Failed to load data. Please try again.');
    }
  };

  const handleDateChange = async (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      const firstDayOfWeek = new Date(date);
      firstDayOfWeek.setDate(date.getDate() - date.getDay() + 1);
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      const options: Intl.DateTimeFormatOptions = { 
        month: "long", 
        day: "numeric", 
        year: "numeric" as "numeric" | "2-digit"
      };
      const selectedWeek = `${firstDayOfWeek.toLocaleDateString(undefined, options)} - ${lastDayOfWeek.toLocaleDateString(
        undefined,
        options
      )}`;
      setWeek(selectedWeek);
      await loadData(selectedWeek);
    }
  };

  const toggleCompletion = (blockIndex: number, choiceIndex: number, dayIndex: number) => {
    const updatedCompletedChoices = [...completedChoices];
    updatedCompletedChoices[blockIndex][choiceIndex][dayIndex] =
      !updatedCompletedChoices[blockIndex][choiceIndex][dayIndex];
    setCompletedChoices(updatedCompletedChoices);
  };

  const handleValueChange = (dayIndex: number, value: string) => {
    const updatedDailyValueCreation = [...dailyValueCreation];
    updatedDailyValueCreation[dayIndex] = value;
    setDailyValueCreation(updatedDailyValueCreation);
  };

  const handleMeditationChange = (dayIndex: number, value: string) => {
    const updatedDailyMeditations = [...dailyMeditations];
    updatedDailyMeditations[dayIndex] = value;
    setDailyMeditations(updatedDailyMeditations);
  };

  const handleAffirmationChange = (value: string) => {
    setDailyAffirmations(value);
  };

  const handleGuidingPrinciplesChange = (value: string) => {
    setGuidingPrinciples(value);
  };

  const handleAddChoice = (blockIndex: number) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[blockIndex].choices.push("New Choice");
    setBlocks(updatedBlocks);

    const updatedCompletedChoices = [...completedChoices];
    updatedCompletedChoices[blockIndex].push(Array(7).fill(false));
    setCompletedChoices(updatedCompletedChoices);
  };

  const handleEditChoice = (blockIndex: number, choiceIndex: number, value: string) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[blockIndex].choices[choiceIndex] = value;
    setBlocks(updatedBlocks);
  };

  const handleDeleteChoice = (blockIndex: number, choiceIndex: number) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[blockIndex].choices.splice(choiceIndex, 1);
    setBlocks(updatedBlocks);

    const updatedCompletedChoices = [...completedChoices];
    updatedCompletedChoices[blockIndex].splice(choiceIndex, 1);
    setCompletedChoices(updatedCompletedChoices);
  };

  const calculateStats = (blockIndex: number) => {
    const blockChoices = completedChoices[blockIndex];
    const totalDays = blockChoices.reduce(
      (sum, choice) => sum + choice.filter((day) => day).length,
      0
    );
    const totalChoices = blockChoices.length * 7;
    const blockScore =
      totalChoices > 0 ? Math.round((totalDays / totalChoices) * 100) : 0;
    return { totalDays, blockScore };
  };

  const blockScores = blocks.map((_, index) => calculateStats(index).blockScore);

  const data = {
    labels: ["Prime", "Prosper", "Play", "Purpose", "Peace"],
    datasets: [
      {
        label: 'Completion Percentage',
        data: blockScores,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const saveData = async () => {
    try {
      const payload = {
        blocks: blocks.map((block, blockIndex) => ({
          id: (block as any).id, // Add type assertion if needed
          name: block.name,
          description: block.description,
          choices: block.choices.map((choice, choiceIndex) => ({
            id: (choice as any).id, // Add type assertion if needed
            text: choice,
            completions: completedChoices[blockIndex][choiceIndex]
          }))
        })),
        guidingPrinciples: guidingPrinciples,
        dailyAffirmations: dailyAffirmations,
        dailyValueCreation: dailyValueCreation,
        dailyMeditations: dailyMeditations
      };

      const response = await fetch(`${API_BASE_URL}/data/${encodeURIComponent(week)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      const result = await response.json();
      alert(result.message || 'Data saved successfully!');
      loadAvailableWeeks(); // Refresh the list of available weeks
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-2">
        Sacred Choices
      </h1>
      <h2 className="text-4xl font-bold text-center mb-8">
        Daily Architecture for Optimized Performance
      </h2>
      <p className="text-center text-2xl font-bold mb-6">{week}</p>
      <p className="text-center text-2xl font-bold mb-6">
        My Path to Greatness
      </p>
      <div className="text-center my-4">
        <button
          className="bg-green-500 text-white px-6 py-2 rounded"
          onClick={saveData}
        >
          Save
        </button>
      </div>
      <div className="text-center my-4">
        <label htmlFor="datePicker" className="mr-2">Select Date:</label>
        <DatePicker
          id="datePicker"
          selected={selectedDate}
          onChange={handleDateChange}
          className="border p-2 rounded"
        />
      </div>
      <div className="mt-6 border p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Guiding Principles</h2>
        <textarea
          className="w-full border p-2 rounded h-64"
          value={guidingPrinciples}
          onChange={(e) => handleGuidingPrinciplesChange(e.target.value)}
          rows={20}
          placeholder="Write your guiding principles here..."
        />
      </div>
      <div className="space-y-6">
        {blocks.map((block, blockIndex) => (
          <div key={blockIndex} className="border p-4 rounded shadow">
            <h2 className="text-2xl font-bold mb-2">{block.name}</h2>
            <p className="mb-2">{block.description}</p>
            <table className="table-auto w-full mb-4">
              <thead>
                <tr>
                  <th className="text-left">Sacred Choice</th>
                  {"Mon Tue Wed Thu Fri Sat Sun"
                    .split(" ")
                    .map((day, index) => (
                      <th key={index} className="text-center">{day}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {block.choices.map((choice, choiceIndex) => (
                  <tr key={choiceIndex}>
                    <td className="flex items-center">
                      <input
                        className="border p-1 mr-2 flex-grow"
                        type="text"
                        value={choice}
                        onChange={(e) =>
                          handleEditChoice(blockIndex, choiceIndex, e.target.value)
                        }
                      />
                      <button
                        className="text-gray-500 ml-2 hover:text-red-500"
                        onClick={() => handleDeleteChoice(blockIndex, choiceIndex)}
                      >
                        ✕
                      </button>
                    </td>
                    {completedChoices[blockIndex][choiceIndex].map(
                      (completed, dayIndex) => (
                        <td key={dayIndex} className="text-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={completed}
                            onChange={() =>
                              toggleCompletion(blockIndex, choiceIndex, dayIndex)
                            }
                          />
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => handleAddChoice(blockIndex)}
            >
              + Add Choice
            </button>
            <div className="mt-4">
              <p>Weekly Stats:</p>
              <p>Total Choices Completed: {calculateStats(blockIndex).totalDays}</p>
              <p>Block Score: {calculateStats(blockIndex).blockScore}%</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 border p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Progress Overview</h2>
        <Bar data={data} options={options} />
      </div>
      <div className="mt-6 border p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Daily Value Creation</h2>
        <div className="grid grid-cols-1 gap-2">
          {"Monday Tuesday Wednesday Thursday Friday Saturday Sunday"
            .split(" ")
            .map((day, dayIndex) => (
              <div key={dayIndex} className="flex items-center">
                <span className="w-24 font-medium">{day}:</span>
                <textarea
                  className="flex-grow border p-2 rounded"
                  value={dailyValueCreation[dayIndex]}
                  onChange={(e) => handleValueChange(dayIndex, e.target.value)}
                  rows={2}
                />
              </div>
            ))}
        </div>
      </div>
      <div className="mt-6 border p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Daily Meditations</h2>
        <div className="grid grid-cols-1 gap-2">
          {"Monday Tuesday Wednesday Thursday Friday Saturday Sunday"
            .split(" ")
            .map((day, dayIndex) => (
              <div key={dayIndex} className="flex items-center">
                <span className="w-24 font-medium">{day}:</span>
                <textarea
                  className="flex-grow border p-2 rounded"
                  value={dailyMeditations[dayIndex]}
                  onChange={(e) => handleMeditationChange(dayIndex, e.target.value)}
                  rows={2}
                />
              </div>
            ))}
        </div>
      </div>
      <div className="mt-6 border p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Daily Affirmations</h2>
        <textarea
          className="w-full border p-2 rounded h-64"
          value={dailyAffirmations}
          onChange={(e) => handleAffirmationChange(e.target.value)}
          rows={20}
          placeholder="Write your daily affirmations here..."
        />
      </div>
    </div>
  );
}