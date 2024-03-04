import { state, useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

export const UserContext = createContext();

export function UserWrapper({ user, setUser, setJWT, socket }) {
    return(
        <UserContext.Provider value={{user, setUser, setJWT }} >
            <BrowserRouter>
                <Routes>
                <Route path="/*" element={<LoginPage />} />
                <Route path="/home" element={<HomePage socket={socket} />} />
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>
    )
}