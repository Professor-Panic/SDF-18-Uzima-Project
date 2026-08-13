import { Link } from "react-router";
import { useState, useEffect } from "react";
import {
  CalendarDays,
  Pill,
  HeartPulse,
  MapPin,
  Brain,
  ArrowRight,
  Frown,
  Meh,
  Smile,
  Laugh,
} from "lucide-react";

import "./dashboard.css";
import { getAppointments } from "../Appointments/appointmentsService";
import { getMedications } from "../Medication/medicationsService";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const data = await getAppointments("user_123");
        setAppointments(data);
      } catch (error) {
        console.error("Failed to load appointments:", error);
      }
    }

    loadAppointments();
  }, []);

  useEffect(() => {
    async function loadMedications() {
      try {
        const data = await getMedications("user_123");
        setMedications(data);
      } catch (error) {
        console.error("Failed to load medications:", error);
      }
    }

    loadMedications();
  }, []);

  return (
    <div className="dashboard">

      <section className="dashboard-hero">
        <div>
          <p className="dashboard-eyebrow">UZIMA WELLNESS</p>

          <h1>Welcome back John Salim</h1>

          <p className="dashboard-subtitle">
            Here's an overview of your health and wellness activity.
          </p>
        </div>

        <div className="dashboard-date">
          <span>Today</span>

          <strong>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </strong>
        </div>
      </section>


      <section className="dashboard-stats">

        <div className="stat-card">
          <div className="stat-icon">
            <CalendarDays size={24} />
          </div>

          <div>
            <p>Appointments</p>
            <h2>{appointments.length}</h2>
            <span>No pending appointments today.</span>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">
            <Pill size={24} />
          </div>

          <div>
            <p>Medications</p>
            <h2>{medications.length}</h2>
            <span>Nothing scheduled yet at the moment</span>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">
            <HeartPulse size={24} />
          </div>

          <div>
            <p>Wellness Status</p>
            <h2>Good</h2>
            <span>Keep taking care of yourself</span>
          </div>
        </div>

      </section>


      <section className="dashboard-grid">

        <div className="dashboard-panel">

          <div className="panel-header">
            <div>
              <p className="dashboard-eyebrow">
                QUICK ACTIONS
              </p>

              <h2>What would you like to do?</h2>
            </div>
          </div>


          <div className="quick-actions">

            <Link
              to="/appointments"
              className="quick-action"
            >
              <span className="quick-action-icon">
                <CalendarDays size={22} />
              </span>

              <div>
                <h3>Appointments</h3>
                <p>Schedule and manage appointments</p>
              </div>

              <ArrowRight
                className="arrow"
                size={20}
              />
            </Link>


            <Link
              to="/map"
              className="quick-action"
            >
              <span className="quick-action-icon">
                <MapPin size={22} />
              </span>

              <div>
                <h3>Find Healthcare</h3>
                <p>Locate nearby healthcare facilities</p>
              </div>

              <ArrowRight
                className="arrow"
                size={20}
              />
            </Link>


            <Link
              to="/mental-health"
              className="quick-action"
            >
              <span className="quick-action-icon">
                <Brain size={22} />
              </span>

              <div>
                <h3>Mental Health</h3>
                <p>Talk and access wellness support</p>
              </div>

              <ArrowRight
                className="arrow"
                size={20}
              />
            </Link>

          </div>

        </div>


        <div className="dashboard-panel wellness-card">

          <p className="dashboard-eyebrow">
            DAILY WELLNESS
          </p>

          <h2>How are you feeling today?</h2>


          <div className="mood-options">

            <button aria-label="Feeling sad">
              <Frown size={24} />
            </button>

            <button aria-label="Feeling unhappy">
              <Meh size={24} />
            </button>

            <button aria-label="Feeling neutral">
              <Meh size={24} />
            </button>

            <button aria-label="Feeling good">
              <Smile size={24} />
            </button>

            <button aria-label="Feeling great">
              <Laugh size={24} />
            </button>

          </div>


          <p className="wellness-text">
            Taking a moment to check in with yourself is an important
            part of your wellbeing.
          </p>


          <Link
            to="/mental-health"
            className="wellness-button"
          >
            Check in

            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;