"use client";

import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";

export default function Home() {
  const initialBlocks = [
    {
      name: "1. Prime",
      description: "Build Your Higher Self",
      choices: ["Rise early", "Learn", "Exercise"],
    },
    {
      name: "2. Prosper",
      description: "Create and Monetize Value",
      choices: ["Networking", "Skill development"],
    },
    {
      name: "3. Play",
      description: "Enjoy the Best Things Life Has to Offer",
      choices: ["Quality time", "Hobbies"],
    },
    {
      name: "4. Purpose",
      description: "Contribute Locally and Globally",
      choices: ["Volunteering", "Mentoring"],
    },
    {
      name: "5. Peace",
      description: "Wind Down, Rest Well",
      choices: ["Meditation", "Sleep early"],
    },
  ];

  const [blocks, setBlocks] = useState(initialBlocks);
  const [completedChoices, setCompletedChoices] = useState(
    initialBlocks.map((block) => block.choices.map(() => Array(7).fill(false)))
  );
  const [dailyValueCreation, setDailyValueCreation] = useState(Array(7).fill(""));
  const [week, setWeek] = useState("");

  useEffect(() => {
    const today = new Date();
    const firstDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 1)
    );
    const lastDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 7)
    );
    const options = { month: "long", day: "numeric", year: "numeric" };
    setWeek(
      `${firstDayOfWeek.toLocaleDateString(undefined, options)} - ${lastDayOfWeek.toLocaleDateString(
        undefined,
        options
      )}`
    );

    // Load data from localStorage
    const savedBlocks = localStorage.getItem("blocks");
    const savedCompletedChoices = localStorage.getItem("completedChoices");
    const savedDailyValueCreation = localStorage.getItem("dailyValueCreation");

    if (savedBlocks && savedCompletedChoices && savedDailyValueCreation) {
      setBlocks(JSON.parse(savedBlocks));
      setCompletedChoices(JSON.parse(savedCompletedChoices));
      setDailyValueCreation(JSON.parse(savedDailyValueCreation));
    }
  }, []);

  const toggleCompletion = (blockIndex, choiceIndex, dayIndex) => {
    const updatedCompletedChoices = [...completedChoices];
    updatedCompletedChoices[blockIndex][choiceIndex][dayIndex] =
      !updatedCompletedChoices[blockIndex][choiceIndex][dayIndex];
    setCompletedChoices(updatedCompletedChoices);
  };

  const handleValueChange = (dayIndex, value) => {
    const updatedDailyValueCreation = [...dailyValueCreation];
    updatedDailyValueCreation[dayIndex] = value;
    setDailyValueCreation(updatedDailyValueCreation);
  };

  const handleAddChoice = (blockIndex) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[blockIndex].choices.push("New Choice");
    setBlocks(updatedBlocks);

    const updatedCompletedChoices = [...completedChoices];
    updatedCompletedChoices[blockIndex].push(Array(7).fill(false));
    setCompletedChoices(updatedCompletedChoices);
  };

  const handleEditChoice = (blockIndex, choiceIndex, value) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[blockIndex].choices[choiceIndex] = value;
    setBlocks(updatedBlocks);
  };

  const handleDeleteChoice = (blockIndex, choiceIndex) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[blockIndex].choices.splice(choiceIndex, 1);
    setBlocks(updatedBlocks);

    const updatedCompletedChoices = [...completedChoices];
    updatedCompletedChoices[blockIndex].splice(choiceIndex, 1);
    setCompletedChoices(updatedCompletedChoices);
  };

  const calculateStats = (blockIndex) => {
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

  const saveData = () => {
    localStorage.setItem("blocks", JSON.stringify(blocks));
    localStorage.setItem("completedChoices", JSON.stringify(completedChoices));
    localStorage.setItem("dailyValueCreation", JSON.stringify(dailyValueCreation));
    alert("Data saved successfully!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">
        Sacred Choices: Daily Architecture for Optimized Performance
      </h1>
      <p className="text-center mb-6">{week}</p>
      <p className="text-center mb-6">
        Fulfill the Five Blocks that Will Make Your Life Soar
      </p>
      <div className="text-center my-4">
        <button
          className="bg-green-500 text-white px-6 py-2 rounded"
          onClick={saveData}
        >
          Save
        </button>
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
        <h2 className="text-2xl font-bold mb-4">Daily Value Creation</h2>
        <div className="grid grid-cols-1 gap-2">
          {"Monday Tuesday Wednesday Thursday Friday Saturday Sunday"
            .split(" ")
            .map((day, dayIndex) => (
              <div key={dayIndex} className="flex items-center">
                <span className="w-24 font-medium">{day}:</span>
                <input
                  type="text"
                  className="flex-grow border p-2 rounded"
                  value={dailyValueCreation[dayIndex]}
                  onChange={(e) => handleValueChange(dayIndex, e.target.value)}
                />
              </div>
            ))}
        </div>
      </div>
      <Calendar />
    </div>
  );
}
```

import React from "react";

const Calendar = () => {
  return <div>Calendar Component</div>;
};

export default Calendar;
