import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/public/Home';
import ExhibitionList from './pages/public/ExhibitionList';
import ExhibitionDetail from './pages/public/ExhibitionDetail';
import ArtworkList from './pages/public/ArtworkList';
import ArtworkDetail from './pages/public/ArtworkDetail';
import ArtistList from './pages/public/ArtistList';
import ArtistDetail from './pages/public/ArtistDetail';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminExhibitionList from './pages/admin/ExhibitionList';
import AdminExhibitionForm from './pages/admin/ExhibitionForm';
import AdminArtworkList from './pages/admin/ArtworkList';
import AdminArtworkForm from './pages/admin/ArtworkForm';
import AdminArtistList from './pages/admin/ArtistList';
import AdminArtistForm from './pages/admin/ArtistForm';

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

      <Route path="/admin/login" element={<Login />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/exhibitions" element={<AdminExhibitionList />} />
        <Route path="/admin/exhibitions/new" element={<AdminExhibitionForm />} />
        <Route path="/admin/exhibitions/:id/edit" element={<AdminExhibitionForm />} />
        <Route path="/admin/artworks" element={<AdminArtworkList />} />
        <Route path="/admin/artworks/new" element={<AdminArtworkForm />} />
        <Route path="/admin/artworks/:id/edit" element={<AdminArtworkForm />} />
        <Route path="/admin/artists" element={<AdminArtistList />} />
        <Route path="/admin/artists/new" element={<AdminArtistForm />} />
        <Route path="/admin/artists/:id/edit" element={<AdminArtistForm />} />
      </Route>
    </Routes>
    </>
  );
}
