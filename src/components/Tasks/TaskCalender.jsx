import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { fetchTasks } from "../../services/task";
import { priorityColors } from "../../utils/priorityUtils";

export default function TaskCalendar() {
  const [events, setEvents] = useState([]);

  const getEventColor = (priority) => {
    return priorityColors[priority] || "#6c757d";
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        const mappedEvents = data.results.map((task) => ({
          title: task.title,
          date: task.due_date,
          color: getEventColor(task.priority),
        }));
        setEvents(mappedEvents);
      } catch (err) {
        console.error("Failed to load tasks for calendar", err);
      }
    };
    loadTasks();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4">📅 Task Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
      />
    </div>
  );
}
