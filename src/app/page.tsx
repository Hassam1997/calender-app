// pages/index.tsx
'use client'
import React from 'react';
import Calendar from './components/Calender';
import { DataProvider } from './ducks';

const Home: React.FC = () => {
  return (
    <div>
      <DataProvider>
        <h1 className="text-center text-4xl my-4">Vocare</h1>
        <Calendar />
      </DataProvider>
    </div>
  );
};

export default Home;
