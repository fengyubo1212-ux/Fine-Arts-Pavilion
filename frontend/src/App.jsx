import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/public/Home';
import ExhibitionList from './pages/public/ExhibitionList';
import ExhibitionDetail from './pages/public/ExhibitionDetail';
import ArtworkList from './pages/public/ArtworkList';
import ArtworkDetail from './pages/public/ArtworkDetail';
import ArtistList from './pages/public/ArtistList';
import ArtistDetail from './pages/public/ArtistDetail';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/exhibitions" element={<ExhibitionList />} />
        <Route path="/exhibitions/:id" element={<ExhibitionDetail />} />
        <Route path="/artworks" element={<ArtworkList />} />
        <Route path="/artworks/:id" element={<ArtworkDetail />} />
        <Route path="/artists" element={<ArtistList />} />
        <Route path="/artists/:id" element={<ArtistDetail />} />
      </Route>
    </Routes>
    </>
  );
}
