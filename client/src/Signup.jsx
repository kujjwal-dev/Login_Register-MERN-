import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!name || !email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    try {
      const result = await axios.post('http://localhost:3001/register', { name, email, password },{
        withCredentials:true,
      });
      console.log(result);
      if (result.data.message === "User registered successfully") {
        navigate("/login");
      } else {
        setErrorMessage(result.data.message || 'Registration failed.');
      }
    } catch (err) {
      console.log(err);
      setErrorMessage('An error occurred. Please try again.');
    }
  }

  return (
    <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='name'>
              <strong>Name</strong>
            </label>
            <input
              type='text'
              placeholder='Enter Name'
              autoComplete='off'
              name='name'
              className='form-control rounded-0'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='email'>
              <strong>Email</strong>
            </label>
            <input
              type='email'
              placeholder='Enter Email'
              autoComplete='off'
              name='email'
              className='form-control rounded-0'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='password'>
              <strong>Password</strong>
            </label>
            <input
              type='password'
              placeholder='Enter Password'
              autoComplete='off'
              name='password'
              className='form-control rounded-0'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <button type='submit' className='btn btn-success w-100 rounded-0'>
            Register
          </button>
        </form>
        <p>Already have an account?</p>
        <Link to="/login" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
