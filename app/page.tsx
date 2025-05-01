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
<<<<<<< HEAD
    guidingPrinciples: string;
=======
>>>>>>> 3fab617 (First commit)
  };
}

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
<<<<<<< HEAD
  const [guidingPrinciples, setGuidingPrinciples] = useState<string>("");
=======
>>>>>>> 3fab617 (First commit)
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

    loadData(currentWeek);
    loadAvailableWeeks();
  }, []);

  const loadAvailableWeeks = () => {
    const weeks = Object.keys(localStorage)
      .filter(key => key.startsWith('blocks_'))
      .map(key => key.replace('blocks_', ''));
    setAvailableWeeks(weeks);
  };

  const loadData = (week: string) => {
    const savedBlocks = localStorage.getItem(`blocks_${week}`);
    const savedCompletedChoices = localStorage.getItem(`completedChoices_${week}`);
    const savedDailyValueCreation = localStorage.getItem(`dailyValueCreation_${week}`);
    const savedDailyMeditations = localStorage.getItem(`dailyMeditations_${week}`);
<<<<<<< HEAD
<<<<<<< HEAD
    const savedDailyAffirmations = localStorage.getItem(`dailyAffirmations_${week}`);
    const savedGuidingPrinciples = localStorage.getItem(`guidingPrinciples_${week}`);

    if (
      savedBlocks &&
      savedCompletedChoices &&
      savedDailyValueCreation &&
      savedDailyMeditations &&
      savedDailyAffirmations &&
      savedGuidingPrinciples
    ) {
=======

    if (savedBlocks && savedCompletedChoices && savedDailyValueCreation && savedDailyMeditations) {
>>>>>>> c584326 (Implement calendar to select and load previous weeks' data)
=======
    const savedDailyAffirmations = localStorage.getItem(`dailyAffirmations_${week}`);

    if (savedBlocks && savedCompletedChoices && savedDailyValueCreation && savedDailyMeditations && savedDailyAffirmations) {
>>>>>>> 3fab617 (First commit)
      setBlocks(JSON.parse(savedBlocks));
      setCompletedChoices(JSON.parse(savedCompletedChoices));
      setDailyValueCreation(JSON.parse(savedDailyValueCreation));
      setDailyMeditations(JSON.parse(savedDailyMeditations));
<<<<<<< HEAD
<<<<<<< HEAD
      setDailyAffirmations(JSON.parse(savedDailyAffirmations));
      setGuidingPrinciples(savedGuidingPrinciples);
=======
>>>>>>> c584326 (Implement calendar to select and load previous weeks' data)
=======
      setDailyAffirmations(JSON.parse(savedDailyAffirmations));
>>>>>>> 3fab617 (First commit)
    } else {
      setBlocks(initialBlocks);
      setCompletedChoices(initialBlocks.map((block) => block.choices.map(() => Array(7).fill(false))));
      setDailyValueCreation(Array(7).fill(""));
      setDailyMeditations(Array(7).fill(""));
<<<<<<< HEAD
<<<<<<< HEAD
      setDailyAffirmations("");
      setGuidingPrinciples("");
=======
>>>>>>> c584326 (Implement calendar to select and load previous weeks' data)
=======
      setDailyAffirmations("");
>>>>>>> 3fab617 (First commit)
    }
  };

  const handleDateChange = (date: Date) => {
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
    loadData(selectedWeek);
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

<<<<<<< HEAD
  const handleGuidingPrinciplesChange = (value: string) => {
    setGuidingPrinciples(value);
  };

=======
>>>>>>> 3fab617 (First commit)
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

  const saveData = () => {
    localStorage.setItem(`blocks_${week}`, JSON.stringify(blocks));
    localStorage.setItem(`completedChoices_${week}`, JSON.stringify(completedChoices));
    localStorage.setItem(`dailyValueCreation_${week}`, JSON.stringify(dailyValueCreation));
    localStorage.setItem(`dailyMeditations_${week}`, JSON.stringify(dailyMeditations));
<<<<<<< HEAD
<<<<<<< HEAD
    localStorage.setItem(`dailyAffirmations_${week}`, JSON.stringify(dailyAffirmations));
    localStorage.setItem(`guidingPrinciples_${week}`, guidingPrinciples);
=======
>>>>>>> c584326 (Implement calendar to select and load previous weeks' data)
=======
    localStorage.setItem(`dailyAffirmations_${week}`, JSON.stringify(dailyAffirmations));
>>>>>>> 3fab617 (First commit)
    alert("Data saved successfully!");
    loadAvailableWeeks();
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
<<<<<<< HEAD
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
=======
>>>>>>> c584326 (Implement calendar to select and load previous weeks' data)
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
          className="w-full border p-2 rounded h-64" // Ajuste de altura
          value={dailyAffirmations}
          onChange={(e) => handleAffirmationChange(e.target.value)}
          rows={20} // Ajuste de filas
          placeholder="Write your daily affirmations here..."
        />
      </div>
    </div>
  );
}
