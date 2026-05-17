import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing    from "./pages/Landing";
import Login      from "./pages/Login";
import Signup     from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard  from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Landing />}    />
        <Route path="/login"      element={<Login />}      />
        <Route path="/signup"     element={<Signup />}     />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard"  element={<Dashboard />}  />
        {/* coming next */}
        {/* <Route path="/meals"    element={<MealTracker />}     /> */}
        {/* <Route path="/workouts" element={<WorkoutLog />}      /> */}
        {/* <Route path="/posture"  element={<PostureDetector />} /> */}
        {/* <Route path="/progress" element={<Progress />}        /> */}
        {/* <Route path="/profile"  element={<Profile />}         /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}