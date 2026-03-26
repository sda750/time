/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UploadAuth from "./pages/UploadAuth";
import Upload from "./pages/Upload";
import Explore from "./pages/Explore";
import AudioPlayer from "./components/AudioPlayer";
import Navbar from "./components/Navbar";
import GlobalBackground from "./components/GlobalBackground";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
        <GlobalBackground />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload-auth" element={<UploadAuth />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/explore" element={<Explore />} />
        </Routes>
        <AudioPlayer />
      </div>
    </Router>
  );
}

