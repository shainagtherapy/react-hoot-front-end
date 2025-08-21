import { useContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import HootList from './components/HootList/HootList';
import HootDetails from './components/HootDetails/HootDetails';
import * as hootService from './services/hootService';
import HootForm from './components/HootForm/HootForm';
import { UserContext } from './contexts/UserContext';
import CommentForm from './components/CommentForm/CommentForm';

const App = () => {
  const { user } = useContext(UserContext);

  const [hoots, setHoots] = useState([]);
  
  const navigate = useNavigate();
  
   useEffect(() => {
    const fetchAllHoots = async () => {
      const hootsData = await hootService.index();
  
      // console log to verify
      setHoots(hootsData);
    };
    if (user) fetchAllHoots();
  }, [user]);

  const handleAddHoot = async (hootFormData) => {
    const newHoot = await hootService.create(hootFormData);
    setHoots([newHoot, ...hoots]);
    navigate('/hoots');
  }

  const handleUpdateHoot = async (hootId, hootFormData) => {
    const updatedHoot = await hootService.update(hootId, hootFormData);
    setHoots(hoots.map((hoot) => (hootId === hoot._id ? updatedHoot : hoot)));
    navigate(`/hoots/${hootId}`);
  };


  const handleDeleteHoot = async (hootId) => {
   
    setHoots(hoots.filter((hoot) => hoot._id !== hootId));
    navigate('/hoots');
  };

  const handleAddComment = async (commentFormData) => {
    
  };
  
   return (
    <>
      <NavBar/>
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Landing />} />
        {user ? (
          <>
            {/* Protected routes (available only to signed-in users) */}
            <Route path='/hoots' element={<HootList hoots={hoots} />} />
            <Route path='/hoots/new' element={<HootForm handleAddHoot={handleAddHoot} />} />
            <Route path='/hoots/:hootId/edit' element={<HootForm handleUpdateHoot={handleUpdateHoot}/>} />
            <Route path='/hoots/:hootId' element={<HootDetails handleDeleteHoot={handleDeleteHoot}/>} />
            <Route path='/hoots/:hootId/comments/:commentId/edit' element={<CommentForm />} />
          
          </>
        ) : (
          <>
            {/* Non-user routes (available only to guests) */}
            <Route path='/sign-up' element={<SignUpForm />} />
            <Route path='/sign-in' element={<SignInForm />} />

          </>
        )};
      </Routes>
    </>
  );
};

export default App;
