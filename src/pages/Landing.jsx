// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => (
  <div style={{ textAlign: 'center', marginTop: '60px' }}>
    <h1>Welcome to SaaS Notes</h1>
    <p>
      Multi-tenant notes application for enterprises.<br />
      Role-based access, secure, and simple.
    </p>
    <div style={{ marginTop: '30px' }}>
      <Link to="/login">
        <button>Login</button>
      </Link>
      <span className='text-amber-300'></span>
      <Link to="/register">
        <button className=''>Register</button>
      </Link>
    </div>
  </div>
);

export default LandingPage;
