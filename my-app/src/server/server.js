import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/employees', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Employee Schema
const employeeSchema = new mongoose.Schema({
  employee_id: { type: String, required: true },
  employee_name: { type: String, required: true },
  password: { type: String, required: true },
});

const Employee = mongoose.model('Employee', employeeSchema);

// Function to Add Dummy Employees
async function addDummyEmployees() {
  const employees = [
    {
      employee_id: 'E001',
      employee_name: 'Alice',
      password: await bcrypt.hash('password123', 10),
    },
    {
      employee_id: 'E002',
      employee_name: 'Bob',
      password: await bcrypt.hash('securepass', 10),
    },
    {
      employee_id: 'E003',
      employee_name: 'Charlie',
      password: await bcrypt.hash('mypassword', 10),
    },
  ];

  try {
    await Employee.insertMany(employees);
    console.log('Dummy employees added successfully!');
  } catch (error) {
    console.error('Error adding dummy employees:', error);
  }
}

// Call the function to add dummy employees when the server starts
addDummyEmployees();

// Login Route with JWT
app.post('/api/login', async (req, res) => {
  const { employee_id, password } = req.body;

  try {
    const employee = await Employee.findOne({ employee_id });

    if (!employee) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, employee.password);

    if (isMatch) {
      // Generate JWT token
      const token = jwt.sign(
        { employee_id: employee.employee_id },
        'secret', // Replace with a secure environment variable
        { expiresIn: '1h' } // Token valid for 1 hour
      );

      res.json({
        message: 'Login successful',
        token: token,
        employee_name: employee.employee_name,
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
