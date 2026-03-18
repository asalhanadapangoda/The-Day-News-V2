import api from './client/src/services/api.js';
import axios from 'axios';

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@thedaynews.com',
      password: 'password123'
    });
    console.log("SUCCESS:", res.data);
  } catch (err) {
    console.log("ERROR STATUS:", err.response?.status);
    console.log("ERROR DATA:", err.response?.data);
    console.log("ERROR MSG:", err.message);
  }
}

test();
