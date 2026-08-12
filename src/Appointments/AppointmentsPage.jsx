function AppointmentPage(){
   return (
      //Main div
      <div>
         {/* Below the Navbar on the left*/}
         <div>
            <div>
               <h3>Upcoming Appointments</h3>
               <button>+ Book Visit</button>
            </div>
            <div>{/* Calendar */}</div>
            <div>
               {/* Appointment List */}

               {/* Date */}
               <Date></Date>
               <div>
                  {/* facility */}
                  {/* Purpose */}
                  {/* Time */}
               </div>
            </div>
         </div>

         {/* Below the Navbar on the right*/}
         <div>
            <div>
               <h3>Today's Meds</h3>
               <button>+ Add Rx</button>
            </div>

            {/* Morning */}
            <div>
               <h2>Morning {/*Time*/}</h2>
               <ul></ul>
            </div>

            {/* Evening */}
            <div>
               <h2>Evening {/*Time*/}</h2>
               <ul></ul>
            </div>

            {/* Notification that meds are running low */}
         </div>
      </div>
   );
}

export default AppointmentPage;